import { Fragment, type ReactNode } from "react";

const KEYWORDS = new Set([
  "export",
  "async",
  "function",
  "const",
  "let",
  "await",
  "return",
  "new",
  "if",
  "else",
  "for",
  "of",
  "in",
  "while",
  "try",
  "catch",
  "break",
  "throw",
  "class",
  "interface",
  "type",
  "true",
  "false",
  "null",
]);

const TOKEN_RE = /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*")|(\b\d[\d_.]*\b)|([A-Za-z_$][\w$]*)|([^\w\s"]+)|(\s+)/g;

function highlight(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  let match: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  let i = 0;

  while ((match = TOKEN_RE.exec(line)) !== null) {
    const [text, comment, str, num, ident] = match;
    const key = `t${i++}`;
    if (comment) out.push(<span key={key} className="text-code-comment">{text}</span>);
    else if (str) out.push(<span key={key} className="text-code-string">{text}</span>);
    else if (num) out.push(<span key={key} className="text-code-number">{text}</span>);
    else if (ident && KEYWORDS.has(ident))
      out.push(<span key={key} className="text-code-keyword">{text}</span>);
    else if (ident && /^[A-Z]/.test(ident))
      out.push(<span key={key} className="text-code-ident">{text}</span>);
    else out.push(<Fragment key={key}>{text}</Fragment>);
  }

  return out;
}

export function CodeViewer({ code, startLine = 1 }: { code: string; startLine?: number }) {
  const lines = code.split("\n");

  return (
    <pre className="overflow-x-auto px-3 py-3 font-mono text-[11px] leading-[1.75] text-foreground/90">
      <code>
        {lines.map((line, idx) => (
          <div key={idx} className="whitespace-pre">
            <span className="mr-3 inline-block w-8 shrink-0 text-right text-muted/50 select-none">
              {startLine + idx}
            </span>
            {highlight(line)}
          </div>
        ))}
      </code>
    </pre>
  );
}
