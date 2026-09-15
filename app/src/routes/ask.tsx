import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { PageHeader, Panel, PanelHeader } from "@/components/Panel";
import { findAnswer, suggestedQuestions, type Answer } from "@/data/ask";
import { repository } from "@/data/repository";

const title = "Ask Your Code — CodeLens AI";
const description =
  "Ask questions in plain English about authentication, checkout, database access and login behaviour, answered with file and line references.";

export const Route = createFileRoute("/ask")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Ask,
});

interface Turn {
  id: number;
  question: string;
  answer: Answer;
}

let turnId = 0;

function Ask() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");

  function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed) return;
    setTurns((prev) => [...prev, { id: ++turnId, question: trimmed, answer: findAnswer(trimmed) }]);
    setDraft("");
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    ask(draft);
  }

  return (
    <AppShell>
      <PageHeader
        title="Ask Your Code"
        description={`Grounded answers about ${repository.name}. This preview responds from a fixed local index.`}
      />

      <div className="grid gap-5 px-6 py-8 sm:px-10 lg:grid-cols-[1fr_300px]">
        <Panel className="flex min-h-[26rem] flex-col">
          <PanelHeader
            marker="❯_"
            title="Conversation"
            aside={turns.length ? `${turns.length} exchanges` : "idle"}
          />

          <div className="flex-1 space-y-6 overflow-y-auto p-5">
            {turns.length === 0 ? (
              <div className="py-10 text-center">
                <div className="mx-auto grid size-8 place-items-center rounded-md bg-primary font-mono text-[12px] font-semibold text-primary-foreground">
                  CL
                </div>
                <p className="mt-4 text-[13px] text-foreground">Ask anything about this codebase.</p>
                <p className="mx-auto mt-1.5 max-w-[42ch] text-[12px] text-muted">
                  Every answer cites the files and lines it was drawn from, so you can jump straight
                  into the explorer.
                </p>
              </div>
            ) : null}

            {turns.map((turn) => (
              <div key={turn.id} className="space-y-4">
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-lg bg-primary px-3.5 py-2 text-[13px] text-primary-foreground">
                    {turn.question}
                  </div>
                </div>
                <div className="max-w-[92%] space-y-2.5">
                  <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-primary uppercase">
                    ◈ CodeLens
                  </div>
                  {turn.answer.body.map((para, i) => (
                    <p key={i} className="text-[13px] leading-[1.7] text-foreground/90">
                      {para}
                    </p>
                  ))}
                  {turn.answer.refs.length ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {turn.answer.refs.map((ref) => (
                        <span
                          key={`${ref.file}:${ref.line}`}
                          className="rounded-md bg-foreground/[0.05] px-2 py-1 font-mono text-[11px] text-muted ring-1 ring-border"
                        >
                          {ref.file}
                          <span className="text-muted/50">:{ref.line}</span>
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={onSubmit} className="border-t border-border p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    ask(draft);
                  }
                }}
                rows={2}
                placeholder="Where is authentication implemented?"
                aria-label="Ask a question about the codebase"
                className="min-h-[3.25rem] flex-1 resize-none rounded-md bg-foreground/[0.03] px-3 py-2 text-[13px] text-foreground ring-1 ring-border outline-none placeholder:text-muted/60 focus:ring-primary/50"
              />
              <button
                type="submit"
                className="rounded-md bg-primary px-3.5 py-2.5 text-[12px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Ask
              </button>
            </div>
          </form>
        </Panel>

        <Panel className="h-fit">
          <PanelHeader marker="◇" title="Try asking" />
          <div className="space-y-2 p-3">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => ask(q)}
                className="w-full rounded-md bg-foreground/[0.03] px-3 py-2.5 text-left text-[12px] text-foreground ring-1 ring-border transition-colors hover:bg-foreground/[0.07]"
              >
                {q}
              </button>
            ))}
          </div>
          <p className="border-t border-border p-3 font-mono text-[10px] leading-relaxed text-muted/70">
            Demo mode — answers come from a fixed local set, not a live model.
          </p>
        </Panel>
      </div>
    </AppShell>
  );
}
