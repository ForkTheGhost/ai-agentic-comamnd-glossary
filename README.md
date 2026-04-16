# Agentic AI Command Glossary

A complete reference for agentic AI commands and concepts — from practical Claude Code slash commands to universal patterns that apply across any AI agent system.

**Read online:** https://<user>.github.io/ai-agentic-comamnd-glossary/ *(set up via [.github/PAGES_SETUP.md](.github/PAGES_SETUP.md))*

## What's Inside

- **Part I — Claude Code: Practical Commands.** Session management, context tools, model/mode control, configuration, extensions, keyboard shortcuts, CLI flags, and bundled skills.
- **Part II — Universal AI Agent Command Glossary.** The conceptual vocabulary behind agentic AI systems — delegation, tool use, memory, planning, guardrails, foreman/supervisor orchestration, and the foreman execution lifecycle. Framework-agnostic.

## Artifacts

| File | Format | Generated? |
|---|---|---|
| [`agentic-ai-complete-reference.md`](agentic-ai-complete-reference.md) | Canonical Markdown source | — |
| `dist/index.html` | Styled standalone HTML (dark theme, TOC, filters) | `node scripts/build.js` |
| [`commands.json`](commands.json) | Structured export — every command row as JSON | `node scripts/export-commands.js` |
| [`CHANGELOG.md`](CHANGELOG.md) | Per-commit content changes | — |

The Markdown file is the only hand-edited source. The HTML is a build artifact (gitignored, published to Pages). `commands.json` is generated and committed so downstream consumers can fetch it raw.

## Build

Zero dependencies. No `package.json`. Requires Node ≥ 18.

```sh
node scripts/build.js            # MD → dist/index.html (open in browser to preview)
node scripts/export-commands.js  # MD → commands.json
```

## License

This reference is provided as-is for educational purposes.

## Contributing

### Issues

All features and bug reports must be tracked as GitHub Issues before any work begins. Issues are the authoritative record of intent — PRs without a corresponding issue will not be merged.

### Pull Requests

All changes require a PR. Direct commits to the default branch are not permitted.

**PR requirements:**
- Reference the issue in the PR description (`Closes #N` or `Ref #N`)
- Include a `CHANGELOG.md` entry — one entry per issue, referencing the issue number for full context
- All code review comments must be acknowledged and addressed before merge — no unresolved items at merge time
