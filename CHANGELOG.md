# Changelog

All notable changes to the Agentic AI Command Glossary are recorded here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

The document itself is dated at the top (currently "April 2026") and updated only on substantive revisions; this file captures every commit that changed reference content.

## [Unreleased]

## 2026-04-12 (second revision)

### Added
- Part II §§ XI–XXI — 11 new conceptual sections totaling ~205 commands:
  - XI. Error Handling & Recovery
  - XII. Context Engineering
  - XIII. Observability & Debugging
  - XIV. Inter-Agent Communication
  - XV. Security & Trust
  - XVI. Prompt Architecture
  - XVII. Human-in-the-Loop Patterns
  - XVIII. SDLC Commands
  - XIX. Infrastructure & Security Operations
  - XX. Document Writing & Composition
  - XXI. Architecture Disciplines
- `scripts/build.js` — section metadata and CSS rules extended for the 11 new sections

### Changed
- Total command count: 167 → 372
- Part I section renames normalized (`Configuration` → `Configuration & Permissions`, `Extensions` → `Extensions & Integrations`)

## 2026-04-12

### Added
- Part II § IX — Foreman / Supervisor Orchestration (Plan Management, Task Board & State Tracking, Agent Lifecycle, Completion & Convergence) — 23 new commands across four subsections ([40b2b27](../../commit/40b2b27))
- Part II § X — Foreman Execution Lifecycle, with an ASCII-art meta-loop diagram and a "Mapping Foreman Commands to Claude Code" table ([40b2b27](../../commit/40b2b27))
- `CLAUDE.md` — repo guidance for future Claude Code sessions; captures the Markdown/HTML parity invariant and editorial conventions ([40b2b27](../../commit/40b2b27))
- `README.md` — project description and file index ([086e67e](../../commit/086e67e))
- Initial release of the reference in paired Markdown + standalone HTML formats ([1ffa508](../../commit/1ffa508))
  - Part I: Claude Code practical commands — slash commands, CLI flags, keyboard shortcuts, skills
  - Part II §§ I–VIII: universal agentic vocabulary — workflow orchestration, cognitive/reasoning, QA & remediation, memory & information flow, tool use, guardrails, output & delivery, collaboration & multi-agent
