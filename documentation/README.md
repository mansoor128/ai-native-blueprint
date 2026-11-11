# Traditional SDLC vs AI SDLC — Demo Walkthrough

This folder shows how the same feature moves through a **Software Development Life Cycle**, first the traditional way, then the AI-driven way.

**Feature used throughout:** Add Movie to Favorites

---

## Traditional Software Development Life Cycle (SDLC)

A structured waterfall-to-agile pipeline:

| Stage | Artifact | Owner |
|-------|----------|--------|
| 1. Idea & PRD | [`prd.md`](./prd.md) | Product Management |
| 2. Tech PRD / Architecture | [`tech-prd.md`](./tech-prd.md) | Tech Lead / Architect |
| 3. Epics | EPIC-50 (in Tech PRD) | Product + Engineering |
| 4. User Stories | [`stories/`](./stories/) | Product / BA |
| 5. Tasks & Subtasks | [`tasks/`](./tasks/) | Tech Lead → Developers |

At every layer, teams apply company policies, security standards, compliance rules, design guidelines, and tech stack constraints. This takes **multiple highly skilled people and several days**, even before development can start.

---

## AI-Driven SDLC (AI SDLC)

The same feature — but knowledge that architects and senior engineers normally apply by hand is packaged once as **reusable skills**. AI agents then use those skills every time they create a PRD, story, or task.

| Concern | How AI applies it |
|---------|-------------------|
| Architecture & stack | Pre-defined architecture skills → frontend, API contract, DB, hosting |
| Governance & compliance | Governance skills → security, PCI DSS applicability, logging, CORS |
| Task breakdown | Generated from the Tech PRD using documented team scopes |
| Task assignment | Agents route work to backend, frontend, DevOps, security — no triage meeting |

---

## Side-by-Side Result

| Stage | Traditional SDLC | AI SDLC |
|-------|------------------|---------|
| Technical PRD | Architects write it manually, over days | AI generates it from pre-built architecture skills |
| Security & compliance | Reviewed case by case | Applied automatically from governance skills |
| Task breakdown | Tech leads split stories into tasks | AI creates the tasks from the PRD |
| Task assignment | Managers assign work in planning meetings | AI agents route tasks using documented team scopes |
| Time to start development | Days to weeks | Hours |

**Human expertise is still essential** — it moves from repeating the same work on every feature to building and maintaining the skills once. Architects and reviewers still approve the output; development starts much sooner.

---

## Demo Path (open in order)

1. [`prd.md`](./prd.md) — Business intent  
2. [`tech-prd.md`](./tech-prd.md) — Architecture, stack, security, compliance  
3. [`stories/`](./stories/) — What the user experiences  
4. [`tasks/`](./tasks/) — What gets assigned to developers  

Until the task stage is complete, **development has not even started**.
