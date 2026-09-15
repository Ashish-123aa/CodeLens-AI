/**
 * MOCK DATA — file tree, file contents and AI explanations for the explorer.
 */

export interface TreeNode {
  name: string;
  path: string;
  type: "dir" | "file";
  children?: TreeNode[];
}

export interface FileExplanation {
  summary: string;
  calls: string;
  calledBy: string;
  risk: string;
  riskLevel: "none" | "low" | "high";
  confidence: number;
  tags: string[];
}

export interface SourceFile {
  path: string;
  language: string;
  startLine: number;
  code: string;
  explanation: FileExplanation;
}

export const fileTree: TreeNode[] = [
  {
    name: "src",
    path: "src",
    type: "dir",
    children: [
      {
        name: "auth",
        path: "src/auth",
        type: "dir",
        children: [
          { name: "session.ts", path: "src/auth/session.ts", type: "file" },
          { name: "login.ts", path: "src/auth/login.ts", type: "file" },
        ],
      },
      {
        name: "api",
        path: "src/api",
        type: "dir",
        children: [
          { name: "checkout.ts", path: "src/api/checkout.ts", type: "file" },
          { name: "gateway.ts", path: "src/api/gateway.ts", type: "file" },
        ],
      },
      {
        name: "db",
        path: "src/db",
        type: "dir",
        children: [{ name: "pool.ts", path: "src/db/pool.ts", type: "file" }],
      },
      {
        name: "utils",
        path: "src/utils",
        type: "dir",
        children: [{ name: "legacy.ts", path: "src/utils/legacy.ts", type: "file" }],
      },
      {
        name: "workers",
        path: "src/workers",
        type: "dir",
        children: [{ name: "queue.ts", path: "src/workers/queue.ts", type: "file" }],
      },
    ],
  },
  { name: "package.json", path: "package.json", type: "file" },
];

export const sourceFiles: Record<string, SourceFile> = {
  "src/auth/session.ts": {
    path: "src/auth/session.ts",
    language: "TypeScript",
    startLine: 14,
    code: `export async function createSession(u: User) {
  const tok = crypto.randomBytes(32).toString("hex");
  const exp = Date.now() + 86_400_000;
  await db.sessions.insert({
    userId: u.id, tokenHash: hash(tok),
    expiresAt: new Date(exp),
  });
  // TODO: rotate on privilege change
  return tok;
}`,
    explanation: {
      summary:
        "createSession mints a 256-bit opaque token, stores only its SHA-256 hash, and sets a 24h expiry. It is called from auth/login.ts:42 and api/refresh.ts:8.",
      calls: "hash, db.sessions",
      calledBy: "2 endpoints",
      risk: "1 finding (Medium)",
      riskLevel: "low",
      confidence: 0.97,
      tags: ["auth", "sessions", "stateful"],
    },
  },
  "src/auth/login.ts": {
    path: "src/auth/login.ts",
    language: "TypeScript",
    startLine: 36,
    code: `export async function login(email: string, pw: string) {
  const user = await db.users.findByEmail(email);
  if (!user) throw new AuthError("invalid-credentials");
  const ok = await verifyHash(pw, user.passwordHash);
  if (!ok) { await recordFailure(email); throw new AuthError("invalid-credentials"); }
  const token = await createSession(user);
  await audit.write("auth.login", { userId: user.id });
  return { token, user: toPublicUser(user) };
}`,
    explanation: {
      summary:
        "login resolves the account by email, verifies the Argon2 hash in constant time, records failed attempts for rate limiting, then delegates to createSession and writes an audit row.",
      calls: "db.users, verifyHash, createSession, audit.write",
      calledBy: "POST /auth/login",
      risk: "no findings",
      riskLevel: "none",
      confidence: 0.94,
      tags: ["auth", "entrypoint"],
    },
  },
  "src/api/checkout.ts": {
    path: "src/api/checkout.ts",
    language: "TypeScript",
    startLine: 104,
    code: `export async function buildSummary(cartId: string) {
  const cart = await db.carts.find(cartId);
  const lines = [];
  for (const line of cart.lines) {
    const product = await db.products.find(line.productId);
    lines.push({ ...line, price: product.price });
  }
  const tax = await taxEngine.quote(cart.region, lines);
  return { lines, tax, total: sum(lines) + tax.amount };
}`,
    explanation: {
      summary:
        "buildSummary assembles the priced cart before payment authorisation. Each line performs its own product lookup, which is the source of the N+1 finding PERF-031.",
      calls: "db.carts, db.products, taxEngine.quote",
      calledBy: "POST /checkout/summary, POST /checkout/confirm",
      risk: "1 finding (High)",
      riskLevel: "high",
      confidence: 0.91,
      tags: ["checkout", "hot-path", "database"],
    },
  },
  "src/api/gateway.ts": {
    path: "src/api/gateway.ts",
    language: "TypeScript",
    startLine: 68,
    code: `export async function scoreTransaction(payload: Payload) {
  const res = await fetch(FRAUD_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  // no timeout, no retry
  return (await res.json()) as FraudScore;
}`,
    explanation: {
      summary:
        "scoreTransaction is the only outbound call to the fraud provider. It has neither a timeout nor a retry, so a single upstream blip fails the whole payment (REL-063).",
      calls: "fetch",
      calledBy: "checkout.confirm, refunds.review",
      risk: "1 finding (High)",
      riskLevel: "high",
      confidence: 0.96,
      tags: ["external", "payments", "reliability"],
    },
  },
  "src/db/pool.ts": {
    path: "src/db/pool.ts",
    language: "TypeScript",
    startLine: 12,
    code: `export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
});

export function query<T>(sql: string, params: unknown[] = []) {
  return pool.query<T>(sql, params);
}`,
    explanation: {
      summary:
        "Every database read in the service funnels through this single pool. The ceiling of 10 connections is lower than the worker fleet's concurrency, which drives REL-040.",
      calls: "pg.Pool",
      calledBy: "41 modules",
      risk: "1 finding (Medium)",
      riskLevel: "low",
      confidence: 0.99,
      tags: ["database", "infrastructure"],
    },
  },
  "src/utils/legacy.ts": {
    path: "src/utils/legacy.ts",
    language: "TypeScript",
    startLine: 1,
    code: `// kept for the 2019 billing export
export function formatLegacyAmount(cents: number) {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  return sign + "$" + (abs / 100).toFixed(2);
}`,
    explanation: {
      summary:
        "formatLegacyAmount has no remaining callers anywhere in the repository. It is a safe deletion candidate (QUAL-207).",
      calls: "none",
      calledBy: "0 modules",
      risk: "1 finding (Low)",
      riskLevel: "low",
      confidence: 0.88,
      tags: ["dead-code", "billing"],
    },
  },
  "src/workers/queue.ts": {
    path: "src/workers/queue.ts",
    language: "TypeScript",
    startLine: 80,
    code: `export async function drain(q: Queue) {
  while (true) {
    const job = await q.reserve();
    if (!job) break;
    try { await handle(job); await q.ack(job); }
    catch { await q.release(job); }
  }
}`,
    explanation: {
      summary:
        "drain pulls jobs until the queue reports empty. A job that always throws is released back immediately, so the loop can spin forever (PERF-044).",
      calls: "q.reserve, handle, q.ack, q.release",
      calledBy: "worker bootstrap",
      risk: "1 finding (Medium)",
      riskLevel: "low",
      confidence: 0.93,
      tags: ["workers", "queue"],
    },
  },
  "package.json": {
    path: "package.json",
    language: "JSON",
    startLine: 1,
    code: `{
  "name": "payments-service",
  "private": true,
  "dependencies": {
    "pg": "8.11.5",
    "argon2": "0.31.2",
    "zod": "3.23.8"
  }
}`,
    explanation: {
      summary:
        "Three runtime dependencies, all currently on supported majors. No advisories matched the installed versions at the last index.",
      calls: "n/a",
      calledBy: "build",
      risk: "no findings",
      riskLevel: "none",
      confidence: 1,
      tags: ["manifest"],
    },
  },
};

export const defaultFilePath = "src/auth/session.ts";
