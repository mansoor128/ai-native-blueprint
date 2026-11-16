---
name: tech-prd
description: >-
  Translates a business Product Requirements Document (PRD) into a Technical PRD
  covering architecture, stack, APIs, data model, security, compliance, logging,
  epic definition, and derived user stories. Use when the user asks to create a
  tech PRD, technical PRD, architecture spec, or tech-prd.md from a PRD, or when
  moving from product requirements into engineering design before stories/tasks.
disable-model-invocation: true
---

# Tech PRD from Business PRD

Turn a business PRD into a **Technical PRD / Architecture Spec** that engineering can implement and that downstream story/task skills can consume.

## When to use

- User provides or points at a `prd.md` (or equivalent business PRD)
- User asks for a tech PRD, architecture spec, or engineering design from product requirements
- Next SDLC step after Product hands off a PRD, before user stories and tasks

## Inputs

| Input | Required | Notes |
|-------|----------|--------|
| Business PRD path or content | Yes | Idea, goal, requirements, success criteria, out of scope |
| Existing stack / standards | Prefer | Language, framework, hosting, auth, logging, retention |
| Epic ID / name | Prefer | Reuse if PRD already names an epic; otherwise invent consistently |

If stack or governance defaults are missing, ask briefly — or apply **Default stack & governance** below and note assumptions in the Status / Overview.

## Workflow

Copy and track:

```
Tech PRD progress:
- [ ] 1. Read business PRD (idea, goal, requirements, success, out of scope)
- [ ] 2. Extract actors, entities, actions, and non-functionals
- [ ] 3. Map to architecture layers (FE, API, DB, hosting, perf)
- [ ] 4. Draft data model + API contract
- [ ] 5. Apply security, compliance, logging
- [ ] 6. Name/confirm Epic; derive user stories (table + links if files exist)
- [ ] 7. Write tech-prd.md from the template
- [ ] 8. Link Source PRD; flag assumptions for human approval
```

### Step 1 — Read the business PRD

Pull:

1. **Feature name** and any related epic
2. **Idea / goal** — problem and product outcome
3. **What the PRD says** — concrete product behaviors
4. **Success criteria** — especially UX and performance targets
5. **Out of scope** — do not design APIs or stories for these

### Step 2 — Extract engineering signals

From the PRD, derive:

| Signal | Examples |
|--------|----------|
| Actor | logged-in user, admin, guest |
| Primary entities | movie, favorite, user |
| Write actions | save, toggle, remove |
| Read actions | list My List, open dedicated page |
| UI affordances | heart icon on every card |
| Non-functionals | “feels instant”, discoverability, auth required |
| Explicit exclusions | no social share, no guest favorites, no PCI |

### Step 3 — Architecture decisions

Fill one row per layer. Prefer project/company defaults over inventing a new stack.

| Layer | Decide |
|-------|--------|
| Frontend | Component/page behavior that implements the PRD UX |
| Backend API | REST (or existing style) paths for write/list/delete |
| Database | Relation linking actor ↔ entity; uniqueness; timestamps |
| Language / Framework | Match existing services unless PRD requires otherwise |
| Hosting & Infrastructure | Match existing (e.g. Docker / Kubernetes) |
| Performance rule | Convert success criteria into a measurable budget (e.g. &lt; 200 ms perceived) |

### Step 4 — Data model and API

- Propose a minimal table/collection for new persisted state
- Define `UNIQUE` (or equivalent) constraints for idempotent/toggle behavior
- Document initial API contract: method, path, auth, body, behavior
- Include list/read endpoints when the PRD mentions a dedicated view page
- Include remove/delete or document toggle-only POST when save is reversible

### Step 5 — Governance & compliance

Always cover:

**Security**

- Auth required on mutating and user-specific reads (unless PRD allows guests)
- Encryption at rest for stored preference/user data
- Rate limiting / throttling on new endpoints
- CORS limited to approved frontend origins

**Compliance**

- Map to company privacy / data-handling policy
- Answer **PCI DSS required?** — Yes only if payment card data is processed/stored; otherwise **No** with a one-line reason
- Note other applicable internal baselines

**Logging**

- Structured logs: request id, pseudonymized/hashed user id where required, entity ids, outcome
- Retention: follow company policy (state the range if known, e.g. 30–90 days)

### Step 6 — Epic and stories

- One **Epic** for the capability (too large for a single day of work)
- Split into **user stories** that map 1:1 to PRD behaviors (e.g. save action vs view list)
- Story wording: `As a … I want … so that …`
- Link story files if they already exist; otherwise list IDs and titles only (do not invent full story docs unless asked)

### Step 7 — Write the document

Output path: same folder as the source PRD, filename `tech-prd.md`, unless the user specifies otherwise.

Link **Source PRD** back to the business PRD. Mark Status as needing **human approval** before assignment.

## Default stack & governance

Use when the repo/PRD does not specify otherwise. Override when the project already has standards.

| Concern | Default |
|---------|---------|
| Backend | Java with Spring Boot |
| Frontend | React |
| API style | REST under `/api/v1/...` |
| Auth | Bearer token; required on user-specific endpoints |
| Persistence | Relational table with UUID/BIGINT PKs and `created_at` |
| Hosting | Kubernetes / Docker |
| Perceived latency target | Under 200 ms when PRD stresses “fast / instant” |
| PCI DSS | No unless card data is in scope |
| Logging | Structured application logs; company retention policy |

## Output template

Write the tech PRD in this shape (adapt tables to the feature; keep section order):

```markdown
# Technical PRD — <Capability Name>

| Field | Value |
|-------|--------|
| **Feature** | <from business PRD> |
| **Document** | Tech PRD / Architecture Spec |
| **Owner** | Tech Lead / Architect |
| **Status** | Draft — pending human approval |
| **Source PRD** | [`prd.md`](./prd.md) |
| **Epic** | **<EPIC-ID: Name>** |

---

## 1. Overview

This document translates the business PRD into system design, APIs, data models,
and infrastructure so engineering can implement the feature safely and consistently.

---

## 2. Architecture & Stack

| Layer | Decision |
|-------|----------|
| **Frontend** | <UI behavior> |
| **Backend API** | <primary write endpoint + brief behavior> |
| **Database** | <entity relation> |
| **Language / Framework** | <stack> |
| **Hosting & Infrastructure** | <hosting> |
| **Performance rule** | <measurable target from success criteria> |

### Suggested data model

\`\`\`text
<table_name>
─────────
id         UUID / BIGSERIAL  PK
<actor_id> UUID / BIGINT     FK → …
<entity_id> UUID / BIGINT    FK → …
created_at TIMESTAMP
UNIQUE (<actor_id>, <entity_id>)
\`\`\`

### API contract (initial)

| Method | Path | Auth | Body | Behavior |
|--------|------|------|------|----------|
| `POST` | `/api/v1/...` | Required | `{ ... }` | … |
| `GET` | `/api/v1/...` | Required | — | … |
| `DELETE` | `/api/v1/.../{id}` | Required | — | … |

---

## 3. Governance & Compliance

### Security

- **Token management** — …
- **Data encryption at rest** — …
- **Rate limiting & throttling** — …
- **CORS policy** — …

### Compliance

| Question | Decision for this feature |
|----------|---------------------------|
| Regulatory compliance | … |
| **PCI DSS required?** | **Yes/No** — <reason> |
| Other company standards | … |

### Logging

| Topic | Requirement |
|-------|-------------|
| Logging standard | … |
| Logging retention | … |

---

## 4. Epic

**<EPIC-ID: Name>**

High-level capability covering <UX>, <API>, <persistence>, and non-functionals above.
Too large for a single day of work — broken into user stories next.

---

## 5. User Stories (derived)

| ID | Story | File |
|----|--------|------|
| US-01 | As a …, I want … so that …. | [`stories/US-01-….md`](./stories/…) |
| US-02 | As a …, I want … so that …. | [`stories/US-02-….md`](./stories/…) |

---

## 6. Traditional vs AI note (optional, for demos)

| Traditional | AI SDLC |
|-------------|---------|
| Architect writes this Tech PRD by hand over days | AI generates it from architecture + governance skills |
| Security/compliance reviewed case by case | Same rules applied from packaged skills |
| Tech lead then splits stories into tasks | AI generates tasks and routes by team scope |

Human reviewers still **approve** this document before work is assigned.
```

Omit section 6 unless the audience is an AI-SDLC / presentation demo.

## Quality bar

Before finishing:

- [ ] Every in-scope PRD behavior maps to UI, API, or both
- [ ] Out-of-scope items are not designed
- [ ] Auth boundaries match actors in the PRD
- [ ] Performance target is concrete when the PRD implies speed
- [ ] PCI DSS answer is explicit
- [ ] Epic + at least one story exist; stories are split by user-facing capability
- [ ] Source PRD is linked; assumptions called out
- [ ] Document is ready for **human approval** (do not treat as auto-approved)

## Worked example (reference)

**Business PRD signal:** heart on movie card → save to My List; dedicated My List page; logged-in only; feel instant.

**Tech PRD outcomes:**

- FE: React heart toggle on movie cards + My List page
- API: `POST/GET/DELETE /api/v1/favorites` with Bearer auth
- DB: `favorites(user_id, movie_id)` with `UNIQUE (user_id, movie_id)`
- Stack default: Java / Spring Boot / k8s / Docker
- Perf: &lt; 200 ms perceived response
- PCI: No — no payment card data
- Epic: EPIC-50 User Watchlist & Favorites
- Stories: US-01 save via heart; US-02 view My List

Use this as a shape reference, not as hard-coded content for unrelated PRDs.

## Do not

- Replace the business PRD — produce a separate tech PRD
- Invent product scope beyond the PRD
- Skip security, compliance, or logging sections
- Generate full story/task file trees unless the user asks
- Claim the tech PRD is final without human review
