/**
 * MOCK DATA — repository overview.
 * Replace these exports with real API calls later; the UI only reads the types.
 */

export type Severity = "Critical" | "High" | "Medium" | "Low";
export type FindingCategory = "security" | "performance" | "quality" | "reliability";

export interface Repository {
  name: string;
  branch: string;
  commit: string;
  lastAnalyzed: string;
  language: string;
}

export interface RepoCounts {
  files: number;
  components: number;
  endpoints: number;
  functions: number;
}

export interface HealthScore {
  label: string;
  key: FindingCategory;
  value: number;
}

export interface Finding {
  id: string;
  severity: Severity;
  category: FindingCategory;
  title: string;
  file: string;
  line: number;
  detail: string;
  recommendation: string;
  age: string;
}

export const repository: Repository = {
  name: "acme/payments-service",
  branch: "main",
  commit: "8a4b2c1",
  lastAnalyzed: "12 minutes ago",
  language: "TypeScript",
};

export const repoCounts: RepoCounts = {
  files: 12408,
  components: 1284,
  endpoints: 247,
  functions: 38902,
};

export const healthScores: HealthScore[] = [
  { label: "Security", key: "security", value: 72 },
  { label: "Performance", key: "performance", value: 88 },
  { label: "Code quality", key: "quality", value: 91 },
  { label: "Reliability", key: "reliability", value: 85 },
];

export const heroStats = [
  { value: "12,408", label: "files indexed" },
  { value: "94.6%", label: "coverage" },
  { value: "312", label: "findings" },
  { value: "2.1s", label: "avg query" },
];

export const findings: Finding[] = [
  {
    id: "SEC-118",
    severity: "Critical",
    category: "security",
    title: "Hardcoded credential in config/prod.ts",
    file: "src/config/prod.ts",
    line: 27,
    detail:
      "A live Stripe secret key is committed as a fallback value when STRIPE_SECRET_KEY is absent from the environment.",
    recommendation:
      "Remove the literal fallback and fail fast on boot when the variable is missing. Rotate the exposed key.",
    age: "2m",
  },
  {
    id: "SEC-092",
    severity: "High",
    category: "security",
    title: "SQL string interpolation in query/orm.ts",
    file: "src/db/query/orm.ts",
    line: 143,
    detail:
      "buildFilter() concatenates caller-supplied column names directly into the WHERE clause without escaping.",
    recommendation: "Use parameterised bindings and validate column names against an allowlist.",
    age: "18m",
  },
  {
    id: "SEC-071",
    severity: "Medium",
    category: "security",
    title: "Session token never rotated on privilege change",
    file: "src/auth/session.ts",
    line: 21,
    detail:
      "createSession issues a 24h token that survives role escalation, widening the window for session fixation.",
    recommendation: "Invalidate and re-mint the session whenever a user's role or password changes.",
    age: "1h",
  },
  {
    id: "PERF-044",
    severity: "Medium",
    category: "performance",
    title: "Unbounded loop in worker/queue.ts",
    file: "src/workers/queue.ts",
    line: 88,
    detail:
      "The drain loop has no maximum iteration count, so a poison message can hold the worker indefinitely.",
    recommendation: "Add an iteration ceiling plus a dead-letter path for repeatedly failing jobs.",
    age: "1h",
  },
  {
    id: "PERF-031",
    severity: "High",
    category: "performance",
    title: "N+1 query in checkout summary",
    file: "src/api/checkout.ts",
    line: 112,
    detail:
      "Each cart line triggers a separate product lookup; a 40-item cart issues 41 round trips to Postgres.",
    recommendation: "Batch the lookups with a single WHERE id = ANY($1) query or a dataloader.",
    age: "3h",
  },
  {
    id: "PERF-019",
    severity: "Low",
    category: "performance",
    title: "Large synchronous JSON parse on cold start",
    file: "src/config/catalog.ts",
    line: 9,
    detail: "A 4.2 MB catalog snapshot is parsed at module scope, adding ~380ms to cold boots.",
    recommendation: "Load the snapshot lazily on first access or move it behind a cached fetch.",
    age: "5h",
  },
  {
    id: "QUAL-207",
    severity: "Low",
    category: "quality",
    title: "Dead export in utils/legacy.ts",
    file: "src/utils/legacy.ts",
    line: 4,
    detail: "formatLegacyAmount is exported but has no remaining references in the repository.",
    recommendation: "Delete the export or move it to an archived package.",
    age: "6h",
  },
  {
    id: "QUAL-186",
    severity: "Medium",
    category: "quality",
    title: "Duplicate validation logic across 3 modules",
    file: "src/api/users.ts",
    line: 58,
    detail:
      "Email validation is reimplemented in users.ts, signup.ts and admin/invite.ts with diverging rules.",
    recommendation: "Extract one shared validator and reuse it in all three call sites.",
    age: "9h",
  },
  {
    id: "QUAL-150",
    severity: "Low",
    category: "quality",
    title: "Implicit any on 14 exported functions",
    file: "src/utils/format.ts",
    line: 31,
    detail: "Public helpers rely on inferred any parameters, weakening type safety for consumers.",
    recommendation: "Annotate the public surface and enable noImplicitAny for this directory.",
    age: "1d",
  },
  {
    id: "REL-063",
    severity: "High",
    category: "reliability",
    title: "Missing retry on external fetch in api/gateway.ts",
    file: "src/api/gateway.ts",
    line: 74,
    detail:
      "Calls to the fraud-scoring provider have no retry or timeout, so a single blip fails the payment.",
    recommendation: "Add a bounded exponential backoff with a 2s timeout and a safe fallback decision.",
    age: "4h",
  },
  {
    id: "REL-058",
    severity: "Critical",
    category: "reliability",
    title: "Unhandled promise rejection in webhook dispatcher",
    file: "src/workers/webhooks.ts",
    line: 46,
    detail:
      "dispatchAll() fires requests without awaiting them, so failures crash the worker process silently.",
    recommendation: "Await with Promise.allSettled and record per-target failures.",
    age: "7h",
  },
  {
    id: "REL-040",
    severity: "Medium",
    category: "reliability",
    title: "Database pool exhaustion under burst load",
    file: "src/db/pool.ts",
    line: 18,
    detail: "Pool max is 10 while the worker fleet opens up to 32 concurrent transactions.",
    recommendation: "Raise the pool ceiling and add queue-time metrics with an alert threshold.",
    age: "2d",
  },
];

export const recentFindings = findings.slice(0, 5);

export const categoryLabels: Record<FindingCategory, string> = {
  security: "Security",
  performance: "Performance",
  quality: "Code quality",
  reliability: "Reliability",
};
