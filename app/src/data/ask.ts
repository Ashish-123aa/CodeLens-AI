/**
 * MOCK DATA — canned answers for the "Ask Your Code" surface.
 * Answers are matched locally; nothing leaves the browser.
 */

export interface CodeRef {
  file: string;
  line: number;
}

export interface Answer {
  id: string;
  question: string;
  keywords: string[];
  body: string[];
  refs: CodeRef[];
}

export const suggestedQuestions = [
  "Where is authentication implemented?",
  "How does the checkout flow work?",
  "Which files handle database access?",
  "What happens when a user logs in?",
];

export const answers: Answer[] = [
  {
    id: "auth",
    question: "Where is authentication implemented?",
    keywords: ["auth", "authentication", "login implemented", "jwt", "session"],
    body: [
      "Authentication lives entirely under src/auth/. There are two entry points: login.ts resolves the account and verifies the Argon2 password hash, and session.ts mints the opaque bearer token.",
      "Route protection is applied by the requireSession middleware in src/api/middleware.ts, which is mounted on every router except /health and /webhooks.",
      "Tokens are stored hashed — the plaintext value only exists in the response body of POST /auth/login.",
    ],
    refs: [
      { file: "src/auth/login.ts", line: 36 },
      { file: "src/auth/session.ts", line: 14 },
      { file: "src/api/middleware.ts", line: 22 },
    ],
  },
  {
    id: "checkout",
    question: "How does the checkout flow work?",
    keywords: ["checkout", "payment flow", "cart", "purchase"],
    body: [
      "Checkout is a three-step server flow. POST /checkout/summary calls buildSummary in api/checkout.ts to price the cart and quote tax.",
      "POST /checkout/confirm re-validates the summary, calls scoreTransaction in api/gateway.ts for a fraud decision, then authorises the charge through the payments adapter.",
      "On success the order row and the payment row are written in a single transaction via db/pool.ts, and a webhook job is queued in workers/queue.ts.",
    ],
    refs: [
      { file: "src/api/checkout.ts", line: 104 },
      { file: "src/api/gateway.ts", line: 68 },
      { file: "src/workers/queue.ts", line: 80 },
    ],
  },
  {
    id: "database",
    question: "Which files handle database access?",
    keywords: ["database", "db", "sql", "postgres", "query"],
    body: [
      "All database traffic goes through the single pool exported from src/db/pool.ts. 41 modules import it, directly or through the repository helpers.",
      "Query construction is split between db/query/orm.ts (filter builder) and per-domain repositories under db/repositories/.",
      "Note that orm.ts interpolates column names into the WHERE clause, which is finding SEC-092.",
    ],
    refs: [
      { file: "src/db/pool.ts", line: 12 },
      { file: "src/db/query/orm.ts", line: 143 },
    ],
  },
  {
    id: "login-flow",
    question: "What happens when a user logs in?",
    keywords: ["logs in", "log in", "login flow", "sign in", "happens when a user"],
    body: [
      "1. POST /auth/login validates the body with a Zod schema and rate-limits by email plus IP.",
      "2. login() loads the user, verifies the password hash, and records a failure counter on mismatch.",
      "3. createSession() generates a 32-byte token, stores its hash with a 24h expiry, and returns the plaintext once.",
      "4. An audit row is written and the public user shape is returned alongside the token.",
      "The token is not rotated when the user's role later changes — see finding SEC-071.",
    ],
    refs: [
      { file: "src/auth/login.ts", line: 36 },
      { file: "src/auth/session.ts", line: 14 },
    ],
  },
];

export const fallbackAnswer: Answer = {
  id: "fallback",
  question: "",
  keywords: [],
  body: [
    "This preview runs on a fixed set of indexed answers, so that question is outside the demo corpus.",
    "Try one of the suggested questions on the right to see how grounded answers are rendered.",
  ],
  refs: [],
};

export function findAnswer(input: string): Answer {
  const q = input.toLowerCase();
  const match = answers.find((a) => a.keywords.some((k) => q.includes(k)));
  return match ?? fallbackAnswer;
}
