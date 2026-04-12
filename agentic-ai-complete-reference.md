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

### XI. Error Handling & Recovery

*When agents fail — and they will*

| Command | Description |
|---|---|
| **Timeout** | Agent exceeded its time or token budget. Distinct from Abort (intentional) — Timeout is the system catching a runaway. |
| **Fallback** | When the primary approach fails, switch to a degraded but functional alternative (e.g., Opus fails → retry with Sonnet). |
| **Replay** | Re-run a failed sequence from a checkpoint with modified parameters. Distinct from Retry (single tool call) — Replay re-executes a full sub-workflow. |
| **Degrade** | Reduce scope or quality to keep the pipeline moving when a component is unavailable (e.g., skip optional validation, use cached data). |
| **Dead Letter** | Capture failed tasks with their full context (inputs, state, error) into a holding queue for later diagnosis and manual retry. |
| **Circuit Break** | After N consecutive failures on the same operation, stop retrying and fail fast. Prevents infinite retry loops and token burn. |
| **Compensate** | Undo the side effects of a partially-completed sequence that failed midway (e.g., rollback a DB migration, revert a partial commit). |

> 💡 In Claude Code: `/rewind` = Compensate (reverts code changes). `--bare` helps Replay by starting clean. Dead Letter = capturing failed output to a file for post-mortem.

---

### XII. Context Engineering

*The discipline that separates agents that kinda work from agents that reliably work*

| Command | Description |
|---|---|
| **Window** | Actively manage what's in the agent's context window — what gets included, summarized, or dropped at any given moment. |
| **Inject** | Push specific knowledge into an agent's context right before it needs it — just-in-time context, not load-everything-upfront. |
| **Compress** | Reduce context size without losing critical information. Different from Prune (which drops things) — Compress keeps everything but smaller. |
| **Isolate** | Prevent context contamination between tasks. One agent's debugging output shouldn't pollute another agent's clean working context. |
| **Hydrate** | Reconstruct full context from a checkpoint or summary when resuming work. The inverse of Compress — expand a compressed state back to working detail. |
| **Prefill** | Pre-populate an agent's context with structured background (architecture docs, API schemas, conventions) before it receives its task. |
| **Evict** | Forcibly remove a specific piece of context that's causing confusion or anchoring the agent to a wrong approach. More surgical than Prune. |
| **Snapshot** | Capture the exact context state at a point in time for reproducibility — if you need to debug why an agent made a decision, replay from the snapshot. |

> 💡 In Claude Code: `/compact` = Compress. `@file` = Inject. `context: fork` = Isolate. CLAUDE.md = Prefill. `/clear` = Evict (nuclear option). `/branch` = Snapshot.

---

### XIII. Observability & Debugging

*When multi-agent pipelines produce wrong output, how do you figure out why?*

| Command | Description |
|---|---|
| **Trace** | Follow the full execution path across agents — which agent touched what, in what order, with what inputs and outputs. |
| **Diff State** | Compare the state at two points in the pipeline to find where things diverged from expectations. |
| **Replay Dry** | Re-run a sequence in read-only mode to observe behavior without side effects. For understanding, not fixing. |
| **Cost Audit** | Break down token/time/money spent per agent, per task, per phase. Essential for optimization and budget enforcement. |
| **Blame** | Given a bad output, trace back to the specific agent and decision that caused it — like `git blame` for agent pipelines. |
| **Profile** | Identify bottlenecks — which agents are slow, which tasks consume disproportionate context, where the pipeline stalls. |
| **Canary** | Run a new agent configuration on a small subset of tasks before rolling it out to the full pipeline. Catches regressions early. |
| **Assert** | Place runtime assertions at key points in the pipeline — "after this step, X should be true" — and halt if they fail. |

> 💡 In Claude Code: `/cost` = Cost Audit. `/diff` = Diff State. `/insights` = Profile. `Ctrl+O` (verbose thinking) = Trace. `/export` captures the full trace for post-mortem.

---

### XIV. Inter-Agent Communication

*The plumbing that makes multi-agent actually work*

| Command | Description |
|---|---|
| **Message** | Direct agent-to-agent communication — structured request/response between two specific agents. |
| **Queue** | Async task queue that agents pull from. Decouples producers from consumers — agents work at their own pace. |
| **Publish / Subscribe** | Agents subscribe to event types and react when relevant events fire. Looser coupling than Broadcast (which pushes to all). |
| **Shared State** | A mutable data structure multiple agents can read and write — the BOARD.md / task-list pattern from the foreman section. |
| **Contract** | Define the expected input/output schema between agents so they can work independently without tight coupling. |
| **Pipe** | Chain agent outputs directly into the next agent's input — like Unix pipes for agent workflows. |
| **Barrier** | A synchronization point where all agents must arrive before any can proceed. Enforces phase boundaries. |
| **Mailbox** | Per-agent inbox that accumulates messages while the agent is busy. Agent processes them when it's ready, not when they arrive. |

> 💡 In Claude Code: Agent Teams shared task list = Shared State + Queue. `context: fork` output files = Pipe. Git branches per agent = Mailbox (work accumulates, merges when ready).

---

### XV. Security & Trust

*Especially critical for IAM automation, provisioning pipelines, and anything touching identity infrastructure*

| Command | Description |
|---|---|
| **Least Privilege** | Each agent gets only the permissions it needs for its specific task — no shared superuser context. |
| **Audit Trail** | Immutable, append-only log of every action every agent took — who did what, when, with what inputs. For compliance and forensics. |
| **Secret Scope** | Secrets are injected per-agent, not shared globally. An agent building a UI never sees the CyberArk credentials the provisioning agent uses. |
| **Trust Boundary** | Define which agents can communicate with which, and what data is allowed to cross boundaries. |
| **Attest** | An agent proves its output hasn't been tampered with — integrity verification for multi-agent chains (e.g., hash of output + agent ID). |
| **Redact** | Strip sensitive data from agent outputs before they're passed to other agents or logged. PII, secrets, tokens never leak downstream. |
| **Sandbox Escape Check** | Verify that a sandboxed agent hasn't broken out of its execution boundary — file access, network calls, privilege escalation. |
| **Provenance** | Tag every output with its origin — which agent, which model, which version, which inputs produced it. Chain of custody for generated artifacts. |
| **Rotate** | Periodically rotate credentials, tokens, and API keys used by long-running agents. Prevents stale credential accumulation. |

> 💡 In Claude Code: `/permissions` + `--allowedTools` = Least Privilege. `/export` = Audit Trail. `--bare` = Trust Boundary (no plugins/hooks from untrusted sources). Hooks = Sandbox Escape Check (run validators after actions).

---

### XVI. Prompt Architecture

*How you instruct agents — the building blocks for writing effective skills and commands*

| Command | Description |
|---|---|
| **Template** | Reusable prompt structures with variable slots. Your custom skills in `~/.claude/skills/` are exactly this pattern. |
| **Persona** | Assign a role/expertise frame to shape an agent's reasoning — "you are a SailPoint IIQ expert" vs "you are a security auditor." |
| **Constrain Output** | Specify format, length, and structure of the response — JSON schema, Given/When/Then, Mermaid, XML, table. |
| **Few-Shot** | Provide examples of correct input→output pairs to calibrate behavior. 2-3 examples dramatically improve consistency. |
| **System Prompt** | The persistent instructions that frame every interaction. CLAUDE.md is literally this — project-wide System Prompt. |
| **Chain Prompt** | Break a complex prompt into sequential stages where each stage's output feeds the next. Reduces hallucination in long-reasoning tasks. |
| **Negative Prompt** | Explicitly state what the agent should NOT do. "Do not modify any files outside `/src`." "Do not use deprecated API v1 endpoints." |
| **Meta-Prompt** | A prompt that generates other prompts — "write me a SKILL.md that does X." Used to bootstrap new skills and custom commands. |
| **Calibrate** | Test a prompt against known-good inputs to verify it produces expected outputs before deploying it in a pipeline. |

> 💡 In Claude Code: CLAUDE.md = System Prompt. `~/.claude/skills/*.md` = Template + Persona. `--json-schema` = Constrain Output. `--append-system-prompt` = Negative Prompt injection point.

---

### XVII. Human-in-the-Loop Patterns

*The full spectrum of human involvement — not just approve/reject*

| Command | Description |
|---|---|
| **Review** | Human inspects output before it progresses — async, non-blocking. Work continues on other tasks while review is pending. |
| **Approve** | Human gives explicit go/no-go — blocking. Pipeline halts until the human responds. Use sparingly. |
| **Steer** | Human provides mid-flight course correction without restarting — "actually, use the v2 API instead." |
| **Override** | Human manually replaces an agent's output with their own. The pipeline continues with the human's version. |
| **Annotate** | Human adds notes or context to agent output for downstream agents to consume. Enriches without replacing. |
| **Triage** | Human reviews a batch of flagged items and decides disposition for each — approve, reject, reassign, defer. |
| **Teach** | Human corrects an agent's mistake AND updates the persistent instructions (CLAUDE.md, skill file) so it doesn't recur. |
| **Delegate Back** | Human returns a task to the agent with additional context or constraints after reviewing it — "try again, but consider X." |

> 💡 In Claude Code: Plan mode = Review (see what Claude would do before it does it). `Shift+Tab` toggles between Approve (normal) and auto-accept. `/memory` edits = Teach. Conversation replies = Steer and Delegate Back.

---

### XVIII. SDLC Commands

*The software development lifecycle stages that agents automate end-to-end*

#### A. Requirements & Design

| Command | Description |
|---|---|
| **Elicit** | Gather requirements from stakeholders, tickets, or existing systems. Ingest ServiceNow RITMs, Jira issues, Slack threads, or user interviews into structured requirements. |
| **Acceptance Criteria** | Formalize pass/fail conditions — Given/When/Then, input/output pairs, or constraint lists. The contract between "what we want" and "how we know it's done." |
| **Spike** | Time-boxed exploration to reduce uncertainty before committing to an approach. "Can we even connect to this API? What does the response look like?" |
| **ADR** | Architecture Decision Record — capture the *why* behind a design choice so future agents and humans don't unknowingly undo it. Immutable once written. |
| **Threat Model** | Identify attack surfaces, trust boundaries, and security risks before implementation — not after. STRIDE, DREAD, or lightweight asset-based approaches. |
| **RFC** | Request for Comments — propose a significant change with context, alternatives considered, and trade-offs. Agents or humans review and approve before work begins. |

> 💡 In Claude Code: `/plan` = Spike (explore without executing). CLAUDE.md can store ADRs. Your Given/When/Then AC patterns for AD OU/password policy findings are textbook Acceptance Criteria.

#### B. Implementation & Build

| Command | Description |
|---|---|
| **Scaffold** | Generate project or module boilerplate — directory structure, configs, base classes, CI templates. The skeleton before the meat. |
| **Implement** | Write the production code. The core build step — one task, one component, one deliverable. |
| **Wire** | Connect components together — API integrations, dependency injection, config binding, import graphs. Distinct from Implement (which builds individual pieces). |
| **Mock** | Create fake endpoints, services, or data for development and testing before real dependencies are available. Stubs, fixtures, contract-based mocks. |
| **Migrate** | Schema changes, data transformations, version upgrades. Distinct from Implement because migrations have rollback requirements and must be idempotent. |
| **Generate** | Auto-produce derived artifacts from a source of truth — TypeScript types from a schema, API clients from OpenAPI specs, IIQ connectors from config templates. |

> 💡 In Claude Code: `/batch` can Scaffold across multiple files. The AI provisioning pipeline you've designed (SNOW → SailPoint connector generation) is Elicit → Generate → Wire → Migrate in sequence.

#### C. Testing

| Command | Description |
|---|---|
| **Unit Test** | Test individual functions or classes in isolation. Fast, focused, deterministic. The foundation of the test pyramid. |
| **Integration Test** | Test components working together — APIs calling databases, services calling services, connectors talking to endpoints. |
| **E2E Test** | Full workflow simulation from user input to final output. Slowest, most brittle, but highest confidence. |
| **Regression Test** | Verify that new changes didn't break existing functionality. Run the existing suite against the new code. |
| **Load Test** | Verify behavior under scale — concurrent users, large datasets, sustained throughput. JMeter, k6, Locust. |
| **Fuzz** | Throw random or malformed inputs at the system to find crashes, panics, and unhandled edge cases. |
| **Smoke Test** | Quick sanity check that the basic happy path works before running the full suite. First gate after deployment. |
| **Contract Test** | Verify that two services agree on their shared interface — request/response shapes, error codes, auth headers — without running both together. |

> 💡 In Claude Code: `/debug` starts from a test failure and iterates toward a fix. `/security-review` is a specialized Fuzz + Regression on the branch diff. `/loop` can run Smoke Tests on a cadence.

#### D. Release & Deploy

| Command | Description |
|---|---|
| **Version** | Tag a release with semantic versioning (major.minor.patch). Communicates the nature of changes to consumers. |
| **Package** | Bundle artifacts for deployment — Docker images, binaries, archives, Helm charts, IIQ deployment packages. |
| **Stage** | Deploy to a pre-production environment for final validation. Mirror of production with synthetic or sanitized data. |
| **Deploy** | Push to production. Blue-green, rolling, or canary strategy depending on risk tolerance. |
| **Rollback** | Revert a bad deployment to the previous known-good state. Distinct from Compensate (broader) — Rollback specifically targets deployment artifacts. |
| **Feature Flag** | Toggle new functionality on/off without redeploying. Decouple deployment from release — ship dark, enable when ready. |
| **Canary Deploy** | Route a percentage of traffic to the new version before full rollout. Catch production-only issues with limited blast radius. |
| **Promote** | Move an artifact from one environment to the next — dev → staging → production. Same artifact, different config. |

> 💡 In Claude Code: A custom `/ship` skill can chain Version → Package → Deploy. `/schedule` can trigger off-hours deployments. `--dangerously-skip-permissions` enables unattended CI/CD Deploy.

#### E. Operate & Maintain

| Command | Description |
|---|---|
| **Monitor** | Ongoing health checks, alerting, SLA tracking. Detect drift from expected behavior before users report it. |
| **Incident** | Detect, classify, and respond to production issues. Severity levels, runbooks, escalation paths, blameless post-mortems. |
| **Hotfix** | Emergency patch applied outside the normal release cycle. Bypasses staging for speed, but must be backported to the main branch. |
| **Deprecate** | Mark functionality for removal with a migration path and timeline. Consumers get warnings before it disappears. |
| **Decommission** | Safely shut down a service, integration, or infrastructure. Cleanup DNS, secrets, access, monitoring, documentation. The inverse of Scaffold. |
| **Patch** | Apply targeted security or dependency updates. Smaller than a release, more structured than a hotfix. Often automated via Dependabot or Renovate. |

> 💡 In Claude Code: `/loop` = lightweight Monitor ("check if the service is responding every 5m"). `/debug` handles Incident triage. The Azure DevOps pipeline you designed for OIDC provisioning has Decommission built into its rollback logic.

#### F. Documentation & Knowledge

| Command | Description |
|---|---|
| **Document** | Generate or update technical docs — API specs, runbooks, architecture diagrams, config references. Living docs, not afterthoughts. |
| **Changelog** | Maintain a human-readable record of what changed and why per release. Audience: consumers of the system, not the builders. |
| **Onboard** | Produce context that lets a new agent or human pick up the project — the "getting started" package. README, setup guide, key decisions, known gotchas. |
| **Runbook** | Step-by-step procedure for a specific operational scenario — "how to rotate the EPIC_EPCS CyberArk credential" or "how to restart the IIQ provisioning service." |
| **Postmortem** | Structured analysis of an incident — timeline, root cause, contributing factors, action items. Blameless, focused on systemic improvement. |

> 💡 In Claude Code: `/memory` + CLAUDE.md = Onboard (persistent project context for future sessions). `/export` captures session history for Postmortem. A custom `/docs` skill can auto-generate Documentation from code.

---

### XIX. Infrastructure & Security Operations

*IAM, secrets management, directory ops, network security, compliance, and SecOps — the operational vocabulary for identity and infrastructure automation*

#### A. Identity & Access Management

| Command | Description |
|---|---|
| **Provision** | Create an identity, account, or entitlement in a target system — IIQ pushing to Epic, Entra ID app registrations, SCIM user creation. |
| **Deprovision** | Remove access — the inverse of Provision, with full audit trail and confirmation that access is actually gone. |
| **Entitle** | Grant a specific permission or role. Finer-grained than Provision (which creates the account) — Entitle adds capabilities to an existing identity. |
| **Revoke** | Remove a specific entitlement without deprovisioning the entire account. Surgical access removal. |
| **Certify** | Periodic access review — manager confirms "yes, this person still needs this access." Catch entitlement creep. |
| **Recertify** | Re-run certification after a change event — role change, org transfer, risk flag, or time-based trigger. |
| **Joiner-Mover-Leaver** | The lifecycle trigger — detect an HR event and fire the appropriate provision/modify/deprovision workflow automatically. |
| **Correlate** | Match an identity across systems — "is jsmith in AD the same person as j.smith in Epic?" Identity resolution across disparate sources. |
| **Reconcile Identity** | Detect drift between the authoritative source and target systems — orphaned accounts, entitlements that don't match policy, stale access. |
| **Aggregate** | Pull current account and entitlement data from a target system into the identity governance platform. The read before the reconcile. |
| **Role Mine** | Analyze existing entitlements to discover natural role clusters. Bottom-up role engineering from real access patterns. |

> 💡 Your SailPoint IIQ work is this section in practice — querying `PS_IIQ_PERSON_VW` for Epic technical roles is Aggregate → Correlate. The AI provisioning pipeline is Elicit (SNOW RITM) → Provision → Entitle → Reconcile Identity.

#### B. Secrets & Credential Management

| Command | Description |
|---|---|
| **Vault** | Store a secret in a centralized secrets manager (CyberArk, HashiCorp Vault, Azure Key Vault) with access controls and audit logging. |
| **Checkout** | Retrieve a credential for time-limited use. CyberArk PSM pattern — credential is locked to the session and returned on completion. |
| **Rotate** | Scheduled credential rotation with zero-downtime swap — update the secret in the vault and all consumers without service interruption. |
| **Inject Secret** | Deliver a credential to a runtime without exposing it in config files or env vars — sidecar, init container, or API fetch at startup. |
| **Break Glass** | Emergency access to a privileged credential outside normal workflow. Audited, alerted, time-limited, requires justification. |
| **Seal** | Mark a secret as compromised or expired and ensure all cached copies are purged — revoke, rotate, and verify in one operation. |
| **Escrow** | Store a recovery key or credential with a trusted third party for disaster recovery — distinct from Vault (operational) vs Escrow (break-the-glass recovery). |

> 💡 Your Azure DevOps OIDC pipeline stores secrets in Key Vault + CyberArk — that's Vault + Inject Secret. The EPIC_EPCS auth policy work is Enforce Policy (next section) gating Checkout.

#### C. Directory & Authentication Operations

| Command | Description |
|---|---|
| **Bind** | Establish an authenticated connection to a directory — LDAP bind, Kerberos TGT request, OIDC token exchange. The handshake before any query. |
| **Query** | Search the directory for objects matching criteria — LDAP filters, IIQ Filter API, Graph API queries. The read operation. |
| **Enforce Policy** | Apply authentication or password policy to a scope — CyberArk auth policies, fine-grained password policies, conditional access rules. |
| **Sync** | Replicate identity data between systems — Azure Cross-Tenant Sync, AD Connect, SCIM provisioning cycles (~40-min cadence). |
| **Delegate Admin** | Grant administrative permissions over a specific OU or scope — OU delegation in AD, administrative units in Entra ID. |
| **Nest / Flatten** | Manage group membership hierarchy — nested group resolution for systems that support it, flattening for those that don't (Azure CTS). |
| **Claim** | Assert an identity attribute for consumption by a relying party — SAML assertion, OIDC claim, JWT claim mapping, token enrichment. |
| **Federate** | Establish trust between identity providers — SAML federation, OIDC trust, cross-domain B2B/B2C relationships. |
| **Step-Up Auth** | Require additional authentication factors when the risk level increases — MFA challenge on sensitive operations, adaptive auth. |

> 💡 Your CyberArk `EPIC_EPCS` policy scripting is Enforce Policy. Azure CTS investigation is Sync + Nest/Flatten (no nested group support). The RL IDDM → BCHS LDAP → JV AD fallback flow is Bind → Query → Federate.

#### D. Network & Infrastructure Security

| Command | Description |
|---|---|
| **Segment** | Isolate network zones — microsegmentation, VLAN assignment, SDN rules, security groups. Limit lateral movement. |
| **Tunnel** | Establish encrypted connectivity — WireGuard, IPsec, Tailscale, SSH tunneling. Secure the transport layer. |
| **Attest Device** | Verify device health and posture before granting access — TPM attestation, MDM compliance, certificate validation, PCR verification. |
| **JIT Access** | Just-In-Time — grant access only when needed, revoke automatically after a time window or session end. Minimize standing privileges. |
| **Quarantine Host** | Isolate a compromised or non-compliant host from the network pending investigation. Infra-level variant of agent Quarantine (IX). |
| **Baseline** | Establish the "normal" behavior profile for a system, user, or network segment. Deviations from baseline trigger alerts. |
| **Harden** | Apply security configuration to infrastructure — CIS benchmarks, STIG compliance, disable unnecessary services, enforce TLS versions. |
| **Zero Trust Evaluate** | Continuous policy evaluation — re-assess trust for every request based on identity, device, location, behavior, and risk score. Never implicit trust. |

> 💡 Your ZTNA architecture work maps here — SPIFFE/SPIRE is Attest Device at the workload level, eBPF/Cilium is Segment, OPA delta bundles are Zero Trust Evaluate, and CAEP/Kafka is the event bus feeding continuous evaluation.

#### E. Compliance & Audit

| Command | Description |
|---|---|
| **Collect Evidence** | Gather artifacts proving a control is operating — screenshots, logs, config exports, query results, attestation records. |
| **Attest Control** | Formally certify that a security control is in place and functioning. Your AD OU restriction and password policy findings are exactly this. |
| **Map Control** | Link a technical implementation to a compliance framework requirement — "this GPO satisfies HIPAA §164.312(d)." Traceability. |
| **Gap Analysis** | Compare current state against a target framework and identify what's missing. The delta between "where we are" and "where we need to be." |
| **Remediation Plan** | For each gap, define the fix, owner, timeline, and acceptance criteria. Your Given/When/Then AC patterns are textbook remediation plans. |
| **Exception** | Formally document and approve a deviation from policy — compensating controls, expiration date, risk acceptance, and sign-off. |
| **Continuous Compliance** | Automate evidence collection and control attestation on a schedule — not just point-in-time audits but ongoing verification. |

> 💡 Your BSWH audit work — rewriting AD OU restriction and FGPP findings into Given/When/Then acceptance criteria — is Attest Control → Gap Analysis → Remediation Plan in sequence.

#### F. Monitoring & Detection (SecOps)

| Command | Description |
|---|---|
| **Ingest** | Collect logs, events, and telemetry from infrastructure into a SIEM or analysis platform. The raw data pipeline. |
| **Correlate Events** | Connect related signals across systems — failed login + VPN connection + file access = potential lateral movement. |
| **Triage Alert** | Evaluate an alert for severity, scope, and required response — true positive, false positive, or needs investigation. |
| **Contain** | Limit blast radius of an active threat — disable account, isolate host, block IP, revoke sessions, kill tokens. |
| **Eradicate** | Remove root cause of a security incident — patch vulnerability, remove malware, close unauthorized access path, rotate compromised creds. |
| **Recover** | Restore normal operations after an incident — re-enable accounts, restore from backup, validate integrity, resume monitoring. |
| **Hunt** | Proactive search for threats that haven't triggered alerts — hypothesis-driven investigation using logs, telemetry, and behavioral analysis. |

> 💡 The incident response lifecycle is: Ingest → Correlate Events → Triage Alert → Contain → Eradicate → Recover → Postmortem (from XVIII-F). Hunt runs in parallel as a continuous activity.

---

### XX. Document Writing & Composition

*The process of producing written deliverables — proposals, findings, standards, reports, and technical prose*

#### A. Planning & Structure

| Command | Description |
|---|---|
| **Outline** | Define the document's skeleton — sections, flow, argument structure — before writing any prose. The blueprint. |
| **Scope** | Explicitly state what the document covers and what it doesn't. Prevents scope creep mid-draft and sets reader expectations. |
| **Audience** | Identify who will read this and calibrate tone, depth, and assumed knowledge accordingly. An exec summary ≠ an engineering spec. |
| **Frame** | Choose the document's rhetorical structure — problem/solution, current-state/future-state, situation/complication/resolution, chronological, topical. |
| **Template** | Select or create a reusable document skeleton for a recurring deliverable type — finding reports, architecture proposals, user stories, runbooks. |

> 💡 In Claude Code: `/plan` before writing = Outline. CLAUDE.md can store Templates for recurring doc types. `--json-schema` can enforce structured output that maps to a Frame.

#### B. Drafting & Composition

| Command | Description |
|---|---|
| **Draft** | Write the first pass — get ideas down without polishing. Prioritize completeness over perfection. |
| **Expand** | Take a bullet point, outline item, or stub and develop it into full prose with supporting detail. |
| **Condense** | Compress verbose content into tighter prose without losing meaning. The inverse of Expand. |
| **Translate Register** | Rewrite content for a different audience — technical to executive, internal to customer-facing, formal to conversational. |
| **Cite** | Add references, sources, or evidence to support claims. Link assertions to authoritative sources. |
| **Illustrate** | Add diagrams, tables, examples, or analogies that make abstract concepts concrete. Mermaid, sequence diagrams, architecture diagrams. |
| **Cross-Reference** | Link related sections, documents, or external resources so the reader can navigate the knowledge graph. |

> 💡 Your IDP user stories (password, token, MFA, step-up, push, RADIUS, OIDC/SAML, account recovery) with happy/bad path coverage are Draft → Expand → Illustrate applied to identity workflows.

#### C. Review & Refinement

| Command | Description |
|---|---|
| **Proofread** | Check for grammar, spelling, punctuation, and typographical errors. Mechanical correctness. |
| **Edit** | Improve clarity, flow, and structure. Rewrite awkward sentences, eliminate redundancy, strengthen transitions. |
| **Peer Review** | Have another agent or human read for technical accuracy, logical gaps, and unstated assumptions. |
| **Red Team** | Deliberately try to poke holes in the document's argument, find missing edge cases, or identify claims without evidence. |
| **Harmonize** | Ensure consistent terminology, formatting, tone, and style across a multi-author or multi-section document. |
| **Version** | Tag a document revision with a version identifier and change summary. Maintain history without cluttering the current draft. |

> 💡 In Claude Code: `/simplify` = Peer Review (3-agent parallel review). `/diff` shows what changed between versions. `/compact` focused on a doc = Condense.

#### D. Delivery & Publishing

| Command | Description |
|---|---|
| **Format** | Apply the target format — Markdown, DOCX, PDF, Confluence wiki, slide deck, email. Structure meets medium. |
| **Finalize** | Lock the document — no more edits. Mark as approved, add signatures or sign-offs if required. |
| **Distribute** | Deliver the document to its audience — email, wiki publish, SharePoint upload, Slack post, PR comment. |
| **Archive** | Move a superseded or completed document to long-term storage with metadata for future retrieval. |

> 💡 In Claude Code: `/export` = Format + Distribute (to file). `/copy` for quick delivery to clipboard. Custom `/publish` skill can chain Format → Finalize → Distribute.

---

### XXI. Architecture Disciplines

*The design-level vocabulary for enterprise, identity, governance, network, and container/platform architecture*

#### A. Enterprise Architecture

| Command | Description |
|---|---|
| **Capability Map** | Identify and organize what the organization does (not how) — business capabilities, technology capabilities, data capabilities. The "what" before the "how." |
| **Reference Architecture** | Define the canonical pattern for a domain — "this is how we build API services" or "this is our identity architecture." Reusable, opinionated, versioned. |
| **Technology Radar** | Evaluate and classify technologies as Adopt / Trial / Assess / Hold. Guides teams without mandating — "we recommend X, we're evaluating Y, stop using Z." |
| **Fitness Function** | Define automated checks that verify an architecture property is being maintained — "all services must respond in <200ms" or "no direct database access from the UI layer." |
| **Trade-off Analysis** | Explicitly document what you gain and what you lose with each architectural decision. No free lunches — make the trade-offs visible. |
| **Current-State / Future-State** | Map where you are today and where you're going. The gap between them is the roadmap. |
| **Domain Boundary** | Define where one domain ends and another begins — bounded contexts, service boundaries, team ownership lines. |
| **Portfolio Rationalize** | Evaluate the existing technology portfolio and decide what to keep, consolidate, migrate, or retire. |

> 💡 Your ZTNA architecture work is Reference Architecture + Trade-off Analysis. The AI provisioning pipeline design is Current-State/Future-State with IIQ connectors as the Domain Boundary.

#### B. Identity & Access Architecture

| Command | Description |
|---|---|
| **Trust Model** | Define who trusts whom, how trust is established, and what trust means in terms of access. The foundation of any identity architecture. |
| **Identity Fabric** | Design the topology of identity providers, directories, and federation relationships. How identity flows across the organization. |
| **Protocol Select** | Choose the right auth protocol for the context — SAML for legacy SSO, OIDC for modern apps, RADIUS for network, Kerberos for on-prem AD, FIDO2 for passwordless. |
| **Access Pattern Model** | Map how users, services, and devices actually access resources — request paths, auth flows, token lifecycles, session management. |
| **Entitlement Schema** | Design the structure of permissions — RBAC roles, ABAC attributes, policy hierarchies, inheritance rules, separation-of-duty constraints. |
| **Delegation Model** | Define how administrative authority is distributed — OU delegation, administrative units, tiered admin, privilege scoping. |
| **Identity Lifecycle** | Design the end-to-end journey from identity creation to decommission — joiner flows, mover workflows, leaver automation, dormant account handling. |
| **Authentication Assurance** | Define assurance levels (e.g., NIST AAL 1/2/3) and map them to authentication methods, step-up triggers, and risk thresholds. |

> 💡 Your Kerberos delegation deep-dive (unconstrained/constrained/RBCD) is Trust Model + Delegation Model. FIDO2/passkeys/WHfB exploration is Protocol Select + Authentication Assurance.

#### C. Governance & Policy Architecture

| Command | Description |
|---|---|
| **Policy Hierarchy** | Define the structure of policies — enterprise policy → standard → procedure → guideline. Each level constrains the one below it. |
| **Decision Rights** | Specify who can approve what — data classification owners, system owners, risk acceptors, exception approvers. RACI for governance. |
| **Control Framework** | Select or build the control structure — NIST CSF, CIS Controls, ISO 27001, COBIT, or a custom hybrid. Map controls to risks. |
| **Risk Taxonomy** | Categorize risks consistently — operational, compliance, financial, reputational, technical. Enables apples-to-apples comparison across domains. |
| **Risk Register** | Maintain a living inventory of identified risks with likelihood, impact, owner, and treatment plan. The central governance artifact. |
| **Separation of Duties** | Design constraints that prevent any single identity from having conflicting privileges — approve-and-execute, create-and-review. |
| **Policy-as-Code** | Express governance rules in executable form — OPA/Rego, Sentinel, Cedar, AWS SCPs. Shift from document-based to enforceable policy. |

> 💡 Your BSWH audit findings work is Control Framework → Gap Analysis (XIX-E) → Remediation Plan. OPA delta bundles in your ZTNA design is Policy-as-Code in action.

#### D. Network Architecture

| Command | Description |
|---|---|
| **Topology Design** | Define the physical and logical layout of the network — hub-and-spoke, mesh, segmented zones, overlay networks. |
| **Zone Model** | Classify network segments by trust level and data sensitivity — DMZ, internal, restricted, management, guest. Traffic rules follow zone boundaries. |
| **Traffic Flow Model** | Map how data actually moves — north-south (in/out), east-west (lateral), service-to-service, user-to-service. Identifies chokepoints and exposure. |
| **Connectivity Architecture** | Design how sites, clouds, and partners connect — SD-WAN, MPLS, VPN tunnels, peering, direct connect. The physical underlay. |
| **Service Mesh** | Define the communication layer between services — sidecar proxies, mTLS, traffic management, observability, retry/circuit-break at the network level. |
| **DNS Architecture** | Design name resolution — split-horizon, conditional forwarding, private zones, service discovery. The invisible plumbing everything depends on. |
| **Certificate Architecture** | Design the PKI hierarchy — root CA, intermediate CAs, certificate lifecycle, auto-renewal, pinning strategy. Trust anchors for the entire infrastructure. |

> 💡 Your Tailscale security analysis is Connectivity Architecture + Trust Model. The eBPF/Cilium work is Zone Model + Service Mesh at the kernel level.

#### E. Container & Platform Architecture

| Command | Description |
|---|---|
| **Platform Blueprint** | Define the target developer platform — orchestrator (K8s), runtime, CI/CD, observability, secrets, networking. The "golden path" for teams. |
| **Workload Pattern** | Classify workloads by their operational characteristics — stateless web, stateful database, batch job, event-driven, long-running daemon. Pattern determines topology. |
| **Orchestrate** | Design how containers are scheduled, scaled, health-checked, and replaced — K8s deployments, StatefulSets, DaemonSets, Jobs, CronJobs. |
| **Image Pipeline** | Design the container image lifecycle — base image curation, build, scan, sign, promote, deploy. Supply chain security for containers. |
| **Infrastructure-as-Code** | Define infrastructure declaratively — Terraform/HCL, Pulumi, CloudFormation, Crossplane. Version-controlled, reviewable, reproducible. |
| **Sidecar / Init Pattern** | Design helper containers that augment the main workload — secret injection, log forwarding, proxy, certificate refresh. |
| **Namespace Strategy** | Define how K8s namespaces map to teams, environments, or applications. Isolation, resource quotas, RBAC scoping. |
| **GitOps** | Use Git as the single source of truth for infrastructure and application state. Pull-based reconciliation — ArgoCD, Flux. |

> 💡 Your AI provisioning pipeline with HCL as infrastructure config = Infrastructure-as-Code. The Rust/Tauri work with obfuscation strategies is Image Pipeline (binary hardening at the build stage).

---
---

## ⚠️ Special Sections

> The sections below are different from the rest of this glossary. Sections I–XXI define **what agents should do**. Sections XXII–XXIII define **what goes wrong** and **what people do but never name**. These are the patterns you won't find in any framework docs — they come from watching agents fail in production and from the undocumented strategies that experienced operators use instinctively. Name the failure mode and you can detect it. Name the hidden pattern and you can teach it.

---

### XXII. Failure Modes & Anti-Patterns

*⚠️ These are not commands to execute — they are failure modes to detect and prevent. If you see these happening, something is wrong. Include them in your CLAUDE.md, skill files, and foreman instructions as explicit "watch for and interrupt" signals.*

#### A. Reasoning Failures

| ⚠️ Failure Mode | Description | Detection Signal |
|---|---|---|
| **Anchor Drift** | Agent fixates on an early assumption and keeps building on it even as evidence mounts that it's wrong. Sunk-cost reasoning. | Output keeps referencing an early decision despite contradicting evidence. Agent resists Replan. |
| **Premature Converge** | Agent locks onto the first plausible solution without exploring alternatives. The opposite of Self-Consistency. | Solution appears suspiciously fast. No alternatives mentioned. No trade-off analysis. |
| **Hallucinate Confidence** | Agent presents uncertain information with high confidence. Authoritative tone masks shaky reasoning. | Claims without citations. Specific numbers/dates that weren't in the source material. "Certainly" and "definitely" on ambiguous topics. |
| **Cargo Cult** | Agent copies a pattern it's seen work elsewhere without understanding *why*, applying it where it doesn't fit. | Boilerplate that doesn't match the context. "Best practice" applied without considering constraints. |
| **Sycophant Loop** | Agent agrees with the human's framing even when it's wrong, reinforcing a bad approach instead of pushing back. | Agent never challenges assumptions. Every suggestion is "great idea." Errors in the human's premise go unquestioned. |
| **Confabulation Cascade** | Agent hallucinates a fact, then builds reasoning on top of it, then cites its own earlier reasoning as evidence. Self-reinforcing hallucination. | Conclusions that trace back to unsourced claims from earlier in the same session. |

> ⚠️ **Mitigation:** Reflect + Red Team after critical reasoning steps. Self-Consistency (multiple paths) prevents Premature Converge. Ground prevents Hallucinate Confidence. Explicit Negative Prompts in CLAUDE.md prevent Sycophant Loop ("push back when you disagree").

#### B. Scope & Focus Failures

| ⚠️ Failure Mode | Description | Detection Signal |
|---|---|---|
| **Yak Shave** | Agent gets trapped in a dependency chain: to do A needs B, needs C, needs D... three levels deep solving the wrong problem. | Agent's current task has no visible connection to the original goal. Multiple "first I need to..." transitions. |
| **Scope Gallop** | Each turn subtly expands beyond the original ask. Task triples in size without explicit approval. | Deliverable keeps growing. Agent adds features/tests/docs nobody asked for. "While I'm at it..." language. |
| **Gold Plate** | Agent over-engineers beyond what was asked — adds tests nobody requested, refactors adjacent code, writes docs for a one-off script. | Time/tokens spent is disproportionate to task complexity. Output has polish nobody needs. |
| **Infinite Clarify** | Agent keeps asking clarifying questions instead of making a reasonable assumption and proceeding. Paralysis by over-specification. | Multiple turns of questions before any work output. Questions about details that don't affect the approach. |
| **Rabbit Hole** | Agent goes deep into an interesting tangent that's technically related but not on the critical path. Intellectual curiosity overrides task focus. | Long, detailed output on a subtopic. Agent seems engaged but isn't making progress toward the goal. |

> ⚠️ **Mitigation:** Spec with clear acceptance criteria prevents Scope Gallop and Gold Plate. Estimate with token budgets catches Yak Shave. The foreman's Poll + Heartbeat detects Rabbit Hole. Constrain + Fence prevents Infinite Clarify ("make reasonable assumptions and note them").

#### C. Context & Memory Failures

| ⚠️ Failure Mode | Description | Detection Signal |
|---|---|---|
| **Ghost Context** | Information the agent *should* have but doesn't — it was in a previous session, different agent's context, or the human's head. | Agent asks about something that was already discussed. Agent re-derives information that was previously established. |
| **Context Poisoning** | Bad information enters the context (wrong file, outdated doc, hallucinated fact) and corrupts all downstream reasoning. | Conclusions that logically follow from the context but are factually wrong. Agent confidently builds on incorrect premises. |
| **Stale Plan** | Foreman keeps executing the original plan after the situation has changed. The plan was right when made; it's wrong now. | Tasks being executed that no longer make sense. Agent outputs that don't account for recent discoveries. |
| **Echo Chamber** | In multi-agent setups, agents reinforce each other's errors because they share context or were seeded with the same assumptions. | Multiple agents arrive at the same wrong conclusion. Disagreement is suspiciously absent. |
| **Context Thrash** | Agent repeatedly loads, evicts, and reloads the same context because it can't decide what's relevant. Burns tokens without progress. | High token usage with low output quality. Repeated references to the same files/concepts. |

> ⚠️ **Mitigation:** Snapshot prevents Ghost Context (capture state for future sessions). Validate against Ground Truth catches Context Poisoning. Replan with explicit trigger conditions prevents Stale Plan. Shadow Agent (XXIII) prevents Echo Chamber. Window management prevents Context Thrash.

#### D. Multi-Agent Failures

| ⚠️ Failure Mode | Description | Detection Signal |
|---|---|---|
| **Deadlock** | Two or more agents are each waiting for the other to finish before they can proceed. No progress. | Multiple agents show "blocked" status simultaneously. No task state changes over multiple Poll cycles. |
| **Thundering Herd** | Multiple agents simultaneously attempt the same action (API call, file write, resource acquisition), causing contention or failure. | Concurrent modification errors. Rate limit hits. Merge conflicts. |
| **Silent Failure** | Agent fails but doesn't report it — continues with partial results or quietly skips the failed step. | Output is subtly incomplete. Missing sections nobody noticed. Downstream agents working with partial data. |
| **Authority Confusion** | Multiple agents believe they own the same resource or decision. Conflicting edits, contradictory outputs. | Same file modified by multiple agents. Conflicting instructions given to downstream agents. |
| **Zombie Agent** | Agent appears alive (Heartbeat passes) but isn't making meaningful progress — spinning, looping, or producing garbage. | Heartbeat OK but no task state changes. Token usage high but no useful output. |

> ⚠️ **Mitigation:** Sequence with explicit dependencies prevents Deadlock. Barrier prevents Thundering Herd. Assert at pipeline checkpoints catches Silent Failure. Contract + clear ownership prevents Authority Confusion. Poll with progress checks (not just liveness) catches Zombie Agent.

---

### XXIII. Unnamed & Emerging Patterns

*💎 These are the strategies experienced operators use instinctively but rarely formalize. They don't appear in framework docs or architecture textbooks. Some are well-known practices without established agent terminology. Others are emerging patterns that will likely become standard in the next generation of agent tooling. Name them, and you can teach them to your agents and your team.*

#### A. Hidden Productivity Patterns

| 💎 Pattern | Description | When to Use |
|---|---|---|
| **Rubber Duck** | Explain the problem to the agent not because you need its answer, but because articulating the problem reveals the solution. The agent is a forcing function for your own thinking. | When you're stuck and can't see the path forward. The act of writing the prompt IS the work. |
| **Shotgun Debug** | Throw the entire error log, stack trace, and surrounding context at the agent with no decomposition. Just raw context dump + "figure it out." Works surprisingly often. | When the error is opaque and you don't know where to start. Let the agent's pattern matching work. |
| **Warm-Up Prompt** | Give the agent a low-stakes task in the domain before the real task — "summarize this codebase" before "refactor this module." Builds context and calibrates the agent's mental model. | Before complex tasks in unfamiliar codebases. The warm-up is cheap; the calibration is valuable. |
| **Inversion Prompt** | Instead of asking "how should I build X," ask "what are all the ways X could fail?" The failure analysis reveals the design requirements. | Architecture and design phases. The failure modes ARE the specification. |
| **Breadcrumb Trail** | Leave deliberate markers in your code/docs that future agents will find and follow — comments like `// AGENT: this connects to the auth service via OIDC` or `<!-- CONTEXT: this decision was made because of HIPAA §164.312 -->`. | Any codebase where agents will work repeatedly. Invest now, save context-loading costs forever. |
| **Throwaway Agent** | Spawn an agent specifically to explore a dead-end approach, knowing you'll discard the output. The value is confirming "that path doesn't work" so you can commit to the right one. | When two approaches seem equally viable and you need to eliminate one. Cheaper than debating. |

> 💎 **In Claude Code:** Rubber Duck = just start typing your problem as a prompt; you'll often solve it mid-sentence. Shotgun Debug = paste the full error + `! cat relevant_file.py` + "fix this." Breadcrumb Trail = comments in your code that Claude Code's agentic search will find.

#### B. Advanced Multi-Agent Strategies

| 💎 Pattern | Description | When to Use |
|---|---|---|
| **Shadow Agent** | Run a second agent on the same task independently with different context or model. Use divergence between outputs as a quality signal. | High-stakes tasks where correctness matters more than speed. The diff between two independent solutions reveals blind spots. |
| **Speculative Execute** | Start work on a likely-needed task before it's officially assigned, betting the foreman will need it. CPU branch prediction for agents. | When the dependency graph is predictable. If the bet pays off, you saved wall-clock time. If not, discard is cheap. |
| **Consensus Fork** | When agents disagree, don't pick a winner — fork the pipeline and pursue both approaches in parallel until one proves itself through testing or validation. | When the disagreement is about approach, not facts. Let reality pick the winner instead of debate. |
| **Context Handwarmer** | Pre-load an agent with relevant context before assigning its task, so when the task arrives, the agent is already "warm" and doesn't waste tokens on discovery. | When you know what tasks are coming and can prepare agents ahead of time. Batch the context loading. |
| **Progressive Disclosure** | Give the agent minimal context first, let it ask for what it needs, and inject on demand. The opposite of Prefill. Reduces noise. | Exploratory tasks where you don't know what context will be relevant. Let the agent's questions guide the context. |
| **Canary Prompt** | Before running a prompt at scale (e.g., `/batch` across 50 files), test it on 2-3 representative files first to verify the output quality and catch prompt bugs. | Before any batch operation. The prompt is code — test it before deploying. |

> 💎 **In Claude Code:** Shadow Agent = two `claude` instances in different terminals, same task, compare `/diff`. Speculative Execute = start the next task in a second terminal while the first is in `/plan` review. Canary Prompt = run your `/batch` task on one file first.

#### C. Cognitive & Metacognitive Patterns

| 💎 Pattern | Description | When to Use |
|---|---|---|
| **Token Budget** | Explicitly allocate a token budget to a task and treat it like money. Agent must complete within budget or request an extension with justification. | Long-running tasks, expensive models, cost-sensitive environments. Forces efficiency and prevents runaway sessions. |
| **Entropy Check** | Measure how "confused" an agent is by looking at reasoning quality, response length, confidence signals, and number of self-corrections. High entropy = struggling. | During the foreman's Poll cycle. High entropy is an early warning to intervene before the agent wastes tokens. |
| **Temporal Fence** | A constraint that changes over time — "before Friday this is a draft, after Friday it's locked." Time-aware guard rails that evolve with the project lifecycle. | Governance workflows, release management, compliance deadlines. The rules change based on where you are in the timeline. |
| **Negative Space** | Deliberately define what the agent should NOT explore, NOT touch, NOT change. The absence of action is itself a design decision. | Any task near production systems, sensitive data, or shared infrastructure. "Do not modify anything in `/prod`" is as important as the task itself. |
| **Perspective Shift** | Ask the agent to re-evaluate its own output from a different persona's viewpoint — "now review this as a security auditor" or "would a junior developer understand this?" | After draft completion. Cheap way to catch blind spots without spawning a separate review agent. |
| **Exit Criteria** | Define upfront exactly what "done" looks like AND what "good enough" looks like. Two thresholds — the agent aims for "done" but can stop at "good enough" if budget is tight. | Every task. Without Exit Criteria, agents either Gold Plate or deliver incomplete work. Spec's acceptance criteria should include both thresholds. |

> 💎 **In Claude Code:** Token Budget = `/cost` monitoring + `/effort low` for cheap phases. Negative Space = Negative Prompt in CLAUDE.md ("never modify files in `/legacy`"). Perspective Shift = "now review what you just wrote as if you're a penetration tester." Exit Criteria = explicit in your Spec before work begins.

---

*Agentic AI — Complete Command Reference · April 2026*
*Part I: code.claude.com, Anthropic docs · Part II: Universal agent patterns*
