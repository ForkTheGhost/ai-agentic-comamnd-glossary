# Agentic AI — Complete Command Reference

> Part I: Every Claude Code slash command, CLI flag, shortcut, and skill.
> Part II: Universal AI agent command glossary — the conceptual patterns behind any agentic system.
>
> April 2026

---

## Part I: Claude Code — Practical Commands

Slash commands, CLI flags, keyboard shortcuts

---

### Session Management

*Conversation lifecycle*

| Command | Description |
|---|---|
| `/clear` | Wipe conversation history. Aliases: `/reset` `/new` |
| `/compact [focus]` | Summarize context to reclaim tokens while preserving thread. Use at ~80% context. |
| `/resume [id]` | Resume a past session. Alias: `/continue` |
| `/rename [name]` | Rename the current session for easier recall. |
| `/branch [name]` | Fork conversation at this point — like git branch for your session. Alias: `/fork` |
| `/rewind` | Roll back conversation AND code changes to an earlier checkpoint. Alias: `/checkpoint` |
| `/export [file]` | Export full conversation as text file. |
| `/copy [N]` | Copy last (or Nth) response to clipboard. |
| `/exit` | Exit Claude Code. Alias: `/quit` |

> 💡 `/compact` at ~80% context. `/clear` when switching tasks entirely.

---

### Context & Information

*Visibility into usage & changes*

| Command | Description |
|---|---|
| `/context` | Visual grid showing context window consumption — what's using space and how much remains. |
| `/usage` | Show plan usage and rate limits. |
| `/cost` | Token usage and estimated cost for current session. |
| `/diff` | Interactive diff viewer — uncommitted git changes + Claude's per-turn changes. |
| `/doctor` | Diagnose installation, settings, and environment issues. |
| `/insights` | Analyze session patterns and identify friction points. |
| `/help` | List all available commands including custom ones. |
| `/release-notes` | View full changelog for current version. |
| `/pr-comments [PR]` | Fetch GitHub PR review comments into context. |

---

### Model & Mode Control

*Reasoning depth & execution style*

| Command | Description |
|---|---|
| `/model [name]` | Switch model mid-session. Arrow keys adjust effort level in picker. |
| `/effort [level]` | Set reasoning depth: `low` `medium` `high` `max` `auto`. `max` = Opus 4.6 deep think. |
| `/fast [on\|off]` | Speed-optimized API settings (same model, faster params). Great for rapid iteration. |
| `/plan [desc]` | Read-only reasoning mode — Claude analyzes and plans without executing changes. |
| `/sandbox` | Toggle sandboxed execution for risky operations. |

> 💡 `/effort low` for mechanical tasks. `/effort max` for complex architecture decisions (Opus 4.6 only).

---

### Configuration & Permissions

*Settings, memory & rules*

| Command | Description |
|---|---|
| `/config` | Open settings UI (theme, model prefs, output style). Alias: `/settings` |
| `/permissions` | Manage allow / ask / deny rules at project/global scope. Alias: `/allowed-tools` |
| `/memory` | Edit CLAUDE.md and auto-memory. Claude saves build commands, debugging insights, conventions. |
| `/init` | Bootstrap project with a CLAUDE.md file for coding standards and context. |
| `/hooks` | View lifecycle hooks — shell commands that run before/after Claude actions. |
| `/keybindings` | Open keybinding configuration file. |
| `/login` / `/logout` | Sign in or out of Anthropic account. |
| `/privacy-settings` | Update privacy preferences (Pro/Max plans). |
| `/extra-usage` | Configure pay-as-you-go overflow when plan limits hit. |
| `/color [color]` | Set prompt bar color — visually distinguish parallel sessions. |

---

### Extensions & Integrations

*MCP, plugins, IDE & team tools*

| Command | Description |
|---|---|
| `/mcp` | Manage MCP server connections. Servers expose tools as `/mcp__<server>__<prompt>` commands. |
| `/plugin` | Manage plugins — install, remove, discover from marketplaces. |
| `/reload-plugins` | Hot-reload all active plugins without restarting. |
| `/agents` | Manage sub-agent configurations. |
| `/chrome` | Configure browser automation integration. |
| `/ide` | Manage IDE integrations (VS Code, Cursor, JetBrains). |
| `/install-github-app` | Set up Claude GitHub App for PR reviews via GitHub Actions. |
| `/install-slack-app` | Install Claude for Slack integration. |
| `/add-dir <path>` | Add an additional working directory for this session. |
| `/desktop` | Open session in the Desktop app. Alias: `/app` |
| `/remote-control` | Enable remote control from claude.ai. Alias: `/rc` |

---

### Bundled Skills

*Multi-agent workflows out of the box*

| Command | Description |
|---|---|
| `/simplify` | 3-agent parallel code review. Replaced the older `/review` command. |
| `/batch <task>` | Run a task across multiple files simultaneously. |
| `/debug` | Structured debugging workflow — reads errors, proposes fixes, tests iteratively. |
| `/loop [interval] <prompt>` | Recurring prompt on a schedule. E.g., `/loop 5m check deploy status`. Units: `s m h d`. |
| `/schedule [desc]` | Create cloud-hosted scheduled task (persists beyond session). |
| `/security-review` | Scan current branch diff for vulnerabilities (SQLi, XSS, exposed creds). |
| `/btw <question>` | Quick side question — no context cost, keeps main conversation clean. |
| `/claude-api` | Quick reference for Anthropic API usage patterns. |

> 💡 `/loop 5m check if CI passed` — great for monitoring deploys. Session-scoped; dies on exit.

---

### Multi-Agent & Orchestration

*Agent Teams, sub-agents, parallel work*

| Command | Description |
|---|---|
| Agent Teams | Enable with `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`. Lead agent spawns teammates, coordinates via shared task list. |
| `/agents` | View and manage sub-agent configurations. Define in `.claude/agents/`. |
| `context: fork` | Skill frontmatter — runs skill in a forked sub-agent to avoid polluting main context. |
| Agent SDK | `@anthropic-ai/claude-agent-sdk` — Full control over orchestration, tools, and permissions. |
| Builder-Validator | Pattern: one agent builds, another validates. Exploration → B-V for implementation. |
| Parallel Sessions | Multiple `claude` instances in different terminals/worktrees for true parallelism. |

> 💡 Agent Teams for collaborative exploration, then builder-validator chains for quality-gated implementation.

---

### CLI Flags

*Terminal & scripting options*

| Flag | Description |
|---|---|
| `claude -p "prompt"` | Non-interactive single prompt. Scriptable for CI, cron, and automation. |
| `--output-format json` | Machine-readable output. Options: `json` `stream-json` `text` |
| `--model <name>` | Choose model at launch. |
| `--dangerously-skip-permissions` | No approval prompts. CI/cron only — scope prompts tightly. |
| `--allowedTools "Bash,Read"` | Pre-approve specific tools. More granular than skip-permissions. |
| `--permission-mode acceptEdits` | Auto-accept file writes, still prompt for other actions. |
| `--append-system-prompt` | Add to system prompt (preserves built-ins). Preferred for most use cases. |
| `--system-prompt-file f.md` | Replace system prompt entirely from a file. |
| `--continue` / `--resume <id>` | Resume most recent or specific session by ID. |
| `--bare` | Skip hooks, skills, MCP, plugins, auto-memory. Clean for CI. |
| `--json-schema '{...}'` | Enforce structured output schema on response. |

> 💡 Cron automation: `echo 'cd /project && claude -p "$(cat prompt.md)" > out.md 2>&1' | at 21:30`

---

### Keyboard Shortcuts

*Speed up your workflow*

| Shortcut | Description |
|---|---|
| `Shift + Tab` | Cycle modes: normal → auto-accept → plan. The most-used shortcut. |
| `Ctrl + O` | Toggle verbose / extended thinking output. |
| `Ctrl + R` | Reverse search command history. |
| `Ctrl + F × 2` | Kill all background agents (press twice rapidly). |
| `Esc` | Cancel current generation or exit menu. |
| `@ file` | Attach file or directory to context inline. |
| `! command` | Run shell command with conversation context. E.g., `! git status` |
| `/vim` | Enable vim keybindings in the prompt editor. |

---

### Custom Skills & Commands

*Build your own agentic workflows*

| Item | Description |
|---|---|
| `~/.claude/skills/` | Personal skills — available across all projects. Add `SKILL.md` with YAML frontmatter. |
| `.claude/skills/` | Project skills — shared via git with your team. |
| `.claude/commands/` | Legacy commands — still work. Skills recommended for new commands. |
| `allowed-tools` | Frontmatter: grant tool access without per-use approval. E.g., `Bash(git add:*)` |
| `model: haiku` | Frontmatter: override model per skill. Use `haiku` for cheap repetitive tasks. |
| `context: fork` | Frontmatter: run in a sub-agent so it doesn't pollute main context. |
| `$ARGUMENTS` | Capture args passed after the command. `/fix-issue 123 high` → `"123 high"` |
| `disable-model-invocation` | Frontmatter: prevent auto-invocation. Explicit `/command` only. |

> 💡 Your `~/.claude/skills/` synced across machines via git is the highest-leverage setup.

---
---

## Part II: AI Agent Command Glossary

Universal patterns for any agentic system

---

### I. Workflow Orchestration

*Task decomposition & coordination*

| Command | Description |
|---|---|
| **Decompose** | Split a complex goal into granular, executable steps with clear dependencies. |
| **Route** | Assign tasks to specialized sub-agents based on capability matching. |
| **Parallelize** | Run non-dependent tasks simultaneously to compress wall-clock time. |
| **Handoff** | Transfer full context between agents or back to a human operator. |
| **Synchronize** | Ensure all agents are working off the latest data version before proceeding. |
| **Replan** | Revise the task graph mid-execution when assumptions break or new info emerges. |
| **Checkpoint** | Save full state at a known-good point so you can roll back if a path fails. |
| **Backtrack** | Abandon a failing path and revert to the last checkpoint to try an alternative approach. |

> 💡 Replan ≠ Reflect. Reflect is post-hoc analysis; Replan is in-flight course correction while tasks are still running.

---

### II. Cognitive & Reasoning Commands

*How the agent thinks*

| Command | Description |
|---|---|
| **Chain-of-Thought** | Document every logical step taken. Makes reasoning auditable and debuggable. |
| **ReAct Loop** | Iteratively Think → Act → Observe. The core agent execution cycle. |
| **Step-Back** | Identify core principles before specific execution. "What problem am I actually solving?" |
| **Self-Consistency** | Generate multiple solutions via different reasoning paths and pick the most common/best one. |
| **Reflect** | Critically analyze the previous output for errors, gaps, or unstated assumptions. |

> 💡 In Claude Code: `/effort max` deepens Chain-of-Thought. `/plan` is a Step-Back. `/simplify` runs Self-Consistency via 3 parallel reviewers.

---

### III. Quality Assurance & Remediation

*Verify, validate, fix*

| Command | Description |
|---|---|
| **Audit** | Verify output against strict compliance, security, or data rules. |
| **Validate** | Fact-check against a "Ground Truth" source — docs, tests, schema, or API response. |
| **Refactor** | Rewrite logic for better performance or clarity — not just patching symptoms. |
| **Stress-Test** | Find the breaking point of a plan, code path, or architecture under edge cases. |
| **Remediate** | Address the root cause of an identified bug, not just the surface error. |

> 💡 In Claude Code: `/security-review` = Audit on branch diff. `/debug` = Remediate loop (read error → fix → test → iterate).

---

### IV. Memory & Information Flow

*Context acquisition, management & persistence*

| Command | Description |
|---|---|
| **Ground** | Restrict responses to provided reference materials only — no hallucination allowed. |
| **Synthesize** | Create a "State of the Project" summary from raw, scattered data sources. |
| **Prune** | Clear outdated context to focus the agent's attention on what's current. |
| **Commit** | Store key results in long-term persistent memory for future sessions. |
| **Retrieve** | RAG-style lookup from a knowledge base, vector store, or document corpus. |
| **Search** | Web or codebase search to fill knowledge gaps the agent can't answer from memory. |
| **Inspect** | Read the current state of the environment — filesystem, database, API response, logs. |
| **Attach** | Pull specific artifacts (files, docs, images) into the working context on demand. |

> 💡 In Claude Code: `/compact` = Prune. `/memory` = Commit. `@file` = Attach. MCP servers = Retrieve from external sources.

---

### V. Tool Use & Environment Interaction

*What makes agents agentic*

| Command | Description |
|---|---|
| **Invoke** | Call an external tool, API, or function and parse the structured result. |
| **Observe** | Read the environment state after an action — the "O" in ReAct, independently named. |
| **Sandbox** | Execute code or commands in an isolated environment to prevent unintended side effects. |
| **Escalate** | Recognize when a task exceeds the agent's capability and surface it to a human or higher-privilege system. |
| **Transform** | Convert data between formats (JSON→XML, CSV→SQL, Mermaid→image) as an intermediate step. |
| **Retry** | Re-execute a failed tool call with adjusted parameters or after a backoff delay. |

> 💡 In Claude Code: `! command` = Invoke + Observe in one step. `/sandbox` = Sandbox. Plan mode forces Observe before Act.

---

### VI. Guard Rails & Control Flow

*Prevent bad actions before they happen*

| Command | Description |
|---|---|
| **Constrain** | Enforce boundaries on what the agent is allowed to do — tool permissions, token budgets, scope limits. |
| **Gate** | Require explicit human approval before irreversible or high-risk actions. |
| **Abort** | Hard-stop execution when a safety threshold, cost limit, or error budget is breached. |
| **Throttle** | Rate-limit agent actions to prevent runaway loops, API exhaustion, or cost overruns. |
| **Scope** | Restrict the agent's view to only the files, data, or systems relevant to the current task. |
| **Fence** | Define explicit "never do this" rules — immutable constraints the agent cannot override. |

> 💡 In Claude Code: `/permissions` = Constrain. Plan mode = Gate. `Ctrl+F×2` = Abort. `--allowedTools` = Scope.

---

### VII. Output & Delivery

*How agents deliver results*

| Command | Description |
|---|---|
| **Emit** | Produce a structured output artifact — JSON, file, diff, commit, PR, or API response. |
| **Summarize** | Compress a long working session into a concise deliverable for the human. |
| **Present** | Format and deliver results in context-appropriate form — diff, report, Slack message, dashboard. |
| **Narrate** | Provide a running explanation of what the agent is doing and why — builds trust and debuggability. |
| **Log** | Record actions, decisions, and outcomes for later audit without cluttering the main output. |

> 💡 In Claude Code: `/export` = Log. `/copy` = Emit to clipboard. `/diff` = Present. `Ctrl+O` = Narrate (verbose thinking).

---

### VIII. Collaboration & Multi-Agent

*Agents working together*

| Command | Description |
|---|---|
| **Delegate** | Assign a scoped sub-task to a sub-agent with its own context fork. Distinct from Route (which chooses the agent). |
| **Merge** | Combine outputs from parallel agents into a single coherent result. |
| **Negotiate** | Agents resolve conflicting outputs or approaches through structured debate. |
| **Vote** | Ensemble pattern — multiple agents weigh in and the majority/best answer wins. |
| **Supervise** | A lead agent monitors sub-agents, intervening only when they stall, conflict, or exceed bounds. |
| **Broadcast** | Push a state update, constraint change, or new context to all active agents simultaneously. |

> 💡 In Claude Code: Agent Teams = Supervise + Delegate + Merge. `/simplify` = Vote (3 reviewers). `context: fork` = Delegate.

---

### IX. Foreman / Supervisor Orchestration

*The lead agent that owns the entire project from plan through completion*

#### A. Plan Management

| Command | Description |
|---|---|
| **Spec** | Define acceptance criteria, constraints, and deliverables before any work begins. The contract between the human and the foreman. |
| **Sequence** | Order tasks by dependency graph — what blocks what — not just priority. Produces a DAG (directed acyclic graph) of execution. |
| **Estimate** | Size each task (time, tokens, complexity) so the foreman knows when something is running long and needs intervention. |
| **Assign** | Match a task to the best-fit agent based on capability, current load, and context proximity. |
| **Rebalance** | Redistribute work across agents when one finishes early, another gets stuck, or a new dependency emerges. |
| **Phase** | Group tasks into ordered stages (e.g., scaffold → implement → test → integrate). The next phase doesn't start until the current one passes its gate. |

> 💡 Spec is the most underused command. Without explicit acceptance criteria, the foreman has no way to know when "done" is actually done — it just keeps iterating.

#### B. Task Board & State Tracking

| Command | Description |
|---|---|
| **Track** | Maintain a persistent task board with lifecycle states: `queued → assigned → in-progress → review → done → blocked`. |
| **Poll** | Periodically check agent status rather than waiting for callbacks. Detects silent failures and stalls. |
| **Unblock** | Detect and resolve blockers — reassign the task, provide missing context, or escalate to the human. |
| **Promote** | Move a task through its lifecycle gates after validation passes (e.g., in-progress → review after tests pass). |
| **Flag** | Mark a task or agent output as needing human attention without halting the entire pipeline. |
| **Deprioritize** | Push a non-critical blocked task to the back of the queue so other work continues flowing. |

> 💡 The foreman should Poll on a cadence, not just react to events. A stuck agent won't always tell you it's stuck — you have to ask.

#### C. Agent Lifecycle

| Command | Description |
|---|---|
| **Spawn** | Create a new agent with scoped context, tool permissions, and a specific task assignment. |
| **Heartbeat** | Verify an agent is still alive and making progress — not spinning, looping, or silently failing. |
| **Reassign** | Take work from a stalled or failing agent and give it to another (with context transfer). |
| **Retire** | Clean up an agent when its work is done — reclaim context budget, save outputs, update the board. |
| **Quarantine** | Isolate an agent producing bad outputs so its work doesn't contaminate other agents' context. |

> 💡 In Claude Code: `Ctrl+F×2` is a manual Quarantine/Abort. Agent Teams handles Spawn and Retire automatically. Heartbeat is what `/loop` can approximate.

#### D. Completion & Convergence

| Command | Description |
|---|---|
| **Converge** | All parallel streams merge back to a single coherent state — code, docs, configs unified. |
| **Reconcile** | Resolve conflicts between agents that modified overlapping files, APIs, or shared state. |
| **Accept** | The foreman validates that acceptance criteria from the Spec are met. Binary: pass or fail. |
| **Integrate** | Run integration tests, lint, type-check — verify that individually-correct pieces work together. |
| **Ship** | Final assembly — combine all outputs, produce the deliverable (PR, artifact, deployment), close the board. |
| **Retrospect** | Post-completion analysis: what worked, what stalled, which estimates were off. Feed learnings back into memory for next time. |

> 💡 Converge without Reconcile is how you get merge conflicts at the end of a multi-agent build. The foreman should Reconcile incrementally, not in one big bang at the end.

---

### X. Foreman Execution Lifecycle

*The meta-loop that ties it all together*

This is the operational sequence a foreman agent follows from start to finish. Each step maps back to commands from the glossary.

```
┌─────────────────────────────────────────────────────────────┐
│                    FOREMAN LIFECYCLE                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. PLAN                                                    │
│     Spec → Decompose → Sequence → Estimate → Phase          │
│                                                             │
│  2. MOBILIZE                                                │
│     Spawn agents → Assign tasks → Broadcast context          │
│     Track (initialize board)                                │
│                                                             │
│  3. EXECUTE (loop until all phases complete)                │
│     ┌──────────────────────────────────────────┐            │
│     │  Poll all agents (Heartbeat)             │            │
│     │  ├─ Agent done?                          │            │
│     │  │   → Validate → Promote → Retire       │            │
│     │  │   → Assign next task or Rebalance      │            │
│     │  ├─ Agent stuck?                         │            │
│     │  │   → Unblock or Reassign               │            │
│     │  ├─ Agent failing?                       │            │
│     │  │   → Quarantine → Spawn replacement     │            │
│     │  ├─ Assumptions broken?                  │            │
│     │  │   → Replan → Rebalance → Broadcast     │            │
│     │  ├─ Conflict detected?                   │            │
│     │  │   → Reconcile or Negotiate             │            │
│     │  └─ All clear?                           │            │
│     │      → Continue (next Poll cycle)         │            │
│     └──────────────────────────────────────────┘            │
│                                                             │
│  4. CONVERGE                                                │
│     Merge all outputs → Reconcile conflicts                  │
│     Integrate (run full test suite)                          │
│                                                             │
│  5. ACCEPT                                                  │
│     Validate against Spec acceptance criteria                │
│     ├─ Pass → Ship → Retrospect → Done                      │
│     └─ Fail → Flag gaps → loop back to EXECUTE              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

> 💡 The key insight: the foreman never does the work itself. It Specs, Tracks, Polls, Unblocks, Reconciles, and Accepts. The agents do the building. The human sets the goal and reviews the Ship.

---

### Mapping Foreman Commands to Claude Code

For implementing this pattern today in Claude Code:

| Foreman Command | Claude Code Implementation |
|---|---|
| **Spec** | Write acceptance criteria in CLAUDE.md or a `spec.md` file the foreman references. |
| **Sequence / Phase** | Encode the DAG as a checklist or task list in a markdown file the foreman maintains. |
| **Spawn** | Agent Teams auto-spawns, or manual parallel `claude` sessions in separate worktrees. |
| **Track** | Foreman maintains a `BOARD.md` or structured JSON file, updating after each Poll cycle. |
| **Poll / Heartbeat** | `/loop` with a status-check prompt, or the foreman's own ReAct loop reading agent output files. |
| **Assign / Reassign** | Agent Teams handles this via the shared task list. Manual: write task to agent's input file. |
| **Reconcile** | `git merge` + foreman reviews conflicts, or foreman runs `/diff` across branches. |
| **Accept** | Foreman runs the test suite and compares output against the Spec's acceptance criteria. |
| **Ship** | Custom `/ship` skill: run tests → commit → push → open PR. |
| **Retrospect** | `/compact` the session with a focus on "what worked and what didn't" → `/memory` to persist. |

---

*Agentic AI — Complete Command Reference · April 2026*
*Part I: code.claude.com, Anthropic docs · Part II: Universal agent patterns*
