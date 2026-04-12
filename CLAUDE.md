# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Nature

This is a **documentation-only repository** — no build system, package manager, tests, or runtime code. It publishes a single reference document in two synchronized formats.

## Source of Truth & Format Parity

The reference exists as two files that must stay in sync:

- `agentic-ai-complete-reference.md` — Markdown source
- `agentic-ai-complete-reference.html` — Standalone styled HTML (self-contained: inline CSS with a dark theme using CSS custom properties, Google Fonts link for JetBrains Mono + DM Sans, no external JS/assets)

When editing content, update **both** files. The HTML is not generated from the Markdown by a tool — they are hand-maintained companions. Treat the Markdown as the canonical structure; mirror structural/content edits into the HTML, preserving its existing class conventions and color-coded category styling.

## Document Structure

Both files share the same two-part outline:

- **Part I — Claude Code: Practical Commands.** Named sections (Session Management, Context & Information, Model & Mode Control, Configuration, Extensions, CLI Flags, Keyboard Shortcuts, Skills, etc.) — each a table of `command → description` pairs.
- **Part II — Universal AI Agent Command Glossary.** Roman-numeraled sections (`I.` through `X.` as of this revision) covering the conceptual vocabulary of agentic systems — workflow orchestration, reasoning, QA, memory, tool use, guardrails, delivery, multi-agent collaboration, foreman/supervisor orchestration, and the foreman execution lifecycle. Larger sections use lettered subsections (`A.`, `B.`, ...). When adding a new topic, continue the Roman-numeral sequence; don't re-number existing entries.

Content is organized as Markdown tables of `command → description` pairs, with short italic intro lines (`*subtitle*`) under each heading and occasional tip callouts (`> 💡 ...`). The Foreman Execution Lifecycle (§X) also uses an ASCII-art block inside a fenced code block — this is a deliberate visual element, mirrored in the HTML as a `<pre>` block. Preserve this table-heavy, scannable style.

## Previewing

There is no build step. To review changes:

- Markdown: render in any Markdown viewer.
- HTML: open `agentic-ai-complete-reference.html` directly in a browser — it is fully standalone.

## Editorial Conventions (from the existing content)

- Commands and identifiers are backtick-quoted (`` `/compact` ``). In Part II's conceptual tables, command *names* are bolded instead (e.g., `| **Spawn** | ... |`) since they aren't literal invocations.
- Aliases for a command are listed inline in the description (e.g., `Aliases: /reset /new`).
- Tip/callout lines use `> 💡` — these are the only emoji used in-content; do not introduce decorative emoji elsewhere.
- Section dividers are `---` on their own line between each section.
- The document carries a date line near the top (currently "April 2026"). It is not bumped on every edit — only update it for substantive revisions.
