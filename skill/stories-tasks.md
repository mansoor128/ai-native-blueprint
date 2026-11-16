---
name: stories-tasks
description: >-
  Creates user stories and developer tasks from a Technical PRD (and linked
  business PRD). Writes story files under stories/ and task files under tasks/,
  routes work by team scope (Backend, Frontend, DevOps, Security), and links
  stories ↔ tasks ↔ epic. Use when the user asks for user stories, story
  breakdown, tasks, task breakdown, sprint-ready work items, or to generate
  stories/ and tasks/ from a tech-prd.md.
disable-model-invocation: true
---

# Stories & Tasks from Tech PRD

Turn an approved (or draft) **Technical PRD** into **user stories** and **developer tasks** that are small enough to pick up, routed to the right team, and linked back to the epic and PRDs.

## When to use

- User asks to create stories, tasks, or both from a tech PRD
- Next SDLC step after `tech-prd.md` exists, before coding starts
- Regenerating or extending `stories/` and `tasks/` for a feature

## Inputs

| Input | Required | Notes |
|-------|----------|--------|
| Tech PRD | Yes | Architecture, API, data model, governance, epic, story hints |
| Business PRD | Prefer | Success criteria, UX wording, out of scope |
| Output dirs | Prefer | Default `documentation/stories/` and `documentation/tasks/` next to the tech PRD |

If the tech PRD is missing, stop and point the user at [`tech-prd.md`](./tech-prd.md) (create tech PRD first).

## Team scope (routing)

Assign every task to **exactly one** team. Use these scopes:

| Team | Owns | Typical subtasks |
|------|------|------------------|
| **Backend** | API routes, persistence, auth on endpoints, server tests | Handler, DB query/migration, unit/integration tests |
| **Frontend** | UI components, pages, client API calls, optimistic UX | Component, event handlers, route/nav, empty/loading/error states |
| **DevOps** | Deploy, config, infra for the feature | Manifests, env, CI hooks — only when tech PRD adds infra work |
| **Security** | Threat review, policy gaps beyond baseline | Only when tech PRD flags security work beyond default baseline |

Default split for a user-facing feature with API + UI: **one Backend task + one Frontend task per story**.

Do not put FE and BE work in the same task file.

## Workflow

Copy and track:

```
Stories & tasks progress:
- [ ] 1. Read tech PRD (+ business PRD); note epic, APIs, NFRs, out of scope
- [ ] 2. Confirm or derive story list (one capability / user outcome each)
- [ ] 3. Write each story file from the story template
- [ ] 4. For each story, split Backend / Frontend (and other teams if needed)
- [ ] 5. Write each task file from the task template (subtasks + notes)
- [ ] 6. Link stories ↔ tasks; update tech PRD story table if needed
- [ ] 7. Mark status Ready for task breakdown / Ready to pick up; human review
```

### Step 1 — Read sources

From the tech PRD pull:

- Epic ID and name
- Architecture & stack (FE, API, DB, hosting, performance)
- API contract and data model
- Security / compliance / logging constraints
- Any “User Stories (derived)” table already listed

From the business PRD pull success criteria and out-of-scope (do not create stories for out-of-scope items).

### Step 2 — Derive stories

Rules:

1. **One story = one user-facing capability** (e.g. “save via heart” vs “view My List”)
2. Use format: `As a **<actor>**, I want to **<action>** so that **<outcome>**.`
3. Prefer actors and outcomes from the business PRD; keep engineering detail in acceptance criteria and tasks
4. IDs: `US-01`, `US-02`, … (continue from existing max if folder already has stories)
5. Filename: `US-NN-<kebab-summary>.md` (e.g. `US-01-save-to-favorites.md`)
6. Priority default: **P0** for in-scope MVP behaviors from the PRD

If the tech PRD already lists stories, flesh those out — do not invent parallel duplicates.

### Step 3 — Acceptance criteria

Each story needs testable criteria that cover:

- Happy path UX
- Auth boundaries (e.g. prompt login, no silent failure)
- Empty / error states when the story includes a list or page
- Toggle/remove behavior when save is reversible
- Non-functionals called out in the tech PRD (e.g. &lt; 200 ms perceived)

Keep criteria user-observable; put implementation detail in tasks.

### Step 4 — Break into tasks

For each story:

1. Identify Backend work (API + DB + tests)
2. Identify Frontend work (UI + client calls + states)
3. Add DevOps/Security tasks only when the tech PRD introduces new infra or extra security scope
4. IDs: `TASK-01`, `TASK-02`, … globally unique across the feature (continue from existing max)
5. Filename: `TASK-NN-<kebab-summary>.md`
6. **Assigned to** / **Team** must match team scope above
7. Add **Depends on** when a task cannot start without another (e.g. list UI depends on list API)
8. Estimate default: `Sprint-ready` (optionally note junior/intern friendly when subtasks are small and concrete)

### Step 5 — Subtasks

Each task gets **3 focused subtasks** (adjust ±1 only if needed):

| Team | Typical 1 / 2 / 3 |
|------|-------------------|
| Backend | Route/handler → persistence/query → tests |
| Frontend | Component or page shell → wire API / events → UX states (optimistic, empty, error) |

Subtask IDs: `<task-number>.<n>` (e.g. `1.1`, `1.2`, `1.3`). Owner column = team name. Done column = `☐`.

### Step 6 — Cross-links

- Story metadata **Source** links to `../prd.md` and `../tech-prd.md`
- Story **Derived Tasks** table links to each task file
- Task **Parent story** links back to the story file
- Task technical notes cite tech PRD constraints (auth, rate limits, logging, perf, PCI)
- Update the tech PRD “User Stories (derived)” table file links if stories were newly created

## Output layout

Default (relative to documentation folder that holds the tech PRD):

```
documentation/
  prd.md
  tech-prd.md
  stories/
    US-01-….md
    US-02-….md
  tasks/
    TASK-01-….md
    TASK-02-….md
```

## Story template

```markdown
# US-NN — <Title>

| Field | Value |
|-------|--------|
| **Story ID** | US-NN |
| **Epic** | <EPIC-ID: Name> |
| **Source** | [`../prd.md`](../prd.md) · [`../tech-prd.md`](../tech-prd.md) |
| **Priority** | P0 |
| **Status** | Ready for task breakdown |

---

## User Story

> As a **<actor>**,  
> I want to **<action>**  
> so that **<outcome>**.

---

## Acceptance Criteria

1. …
2. …
3. …

---

## Derived Tasks (assigned to developers)

| Task | Title | Assignee team | File |
|------|--------|---------------|------|
| TASK-NN | <Title> | Backend | [`../tasks/TASK-NN-….md`](../tasks/TASK-NN-….md) |
| TASK-NN | <Title> | Frontend | [`../tasks/TASK-NN-….md`](../tasks/TASK-NN-….md) |
```

## Task template

```markdown
# TASK-NN — <Title> (<Team>)

| Field | Value |
|-------|--------|
| **Task ID** | TASK-NN |
| **Parent story** | [US-NN](../stories/US-NN-….md) |
| **Epic** | <EPIC-ID> |
| **Assigned to** | <Backend|Frontend|DevOps|Security> Developer |
| **Team** | <Backend|Frontend|DevOps|Security> |
| **Estimate** | Sprint-ready |
| **Status** | Ready to pick up |
| **Depends on** | <TASK-XX or omit row if none> |

---

## Description

<What to build, in 1–3 sentences, referencing the tech PRD API/UX.>

**Endpoint / Stack:** <as applicable>

---

## Subtasks

| ID | Subtask | Owner | Done |
|----|---------|--------|------|
| **N.1** | … | <Team> | ☐ |
| **N.2** | … | <Team> | ☐ |
| **N.3** | … | <Team> | ☐ |

---

## Technical notes

- <Auth, uniqueness, logging, perf, error handling from tech PRD>
- <Link to [`tech-prd.md`](../tech-prd.md) where useful>

---

## Demo talking point

(Optional — include for AI-SDLC / presentation demos.)

In **traditional SDLC**, a tech lead writes and assigns this task in planning.  
In **AI SDLC**, an agent generates this task from the Tech PRD and routes it by team scope — then a human still reviews before coding starts.
```

Omit **Depends on** and **Demo talking point** when not applicable.

## Quality bar

Before finishing:

- [ ] Every in-scope tech PRD / PRD capability has a story
- [ ] Out-of-scope items have no stories or tasks
- [ ] Each story has acceptance criteria and linked tasks
- [ ] Each task has one team, concrete subtasks, and parent story link
- [ ] Backend/Frontend split matches API vs UI work
- [ ] Dependencies declared where order matters
- [ ] IDs and filenames are unique and sequential
- [ ] Stack, endpoints, and NFRs match the tech PRD
- [ ] Human review still required before coding starts

## Worked example (reference)

From favorites tech PRD:

| Story | Tasks |
|-------|--------|
| US-01 Save via heart | TASK-01 Backend `POST /favorites` · TASK-02 Frontend heart button |
| US-02 View My List | TASK-03 Backend `GET`/`DELETE` · TASK-04 Frontend My List page |

Use as shape reference only — do not copy favorites content into unrelated features.

## Do not

- Create stories/tasks before a tech PRD exists (unless the user explicitly provides equivalent architecture input)
- Mix Backend and Frontend work in one task
- Invent product scope beyond the PRDs
- Skip acceptance criteria or subtasks
- Mark work as approved for development without human review
