# Technical PRD — User Watchlist & Favorites

| Field | Value |
|-------|--------|
| **Feature** | Add Movie to Favorites |
| **Document** | Tech PRD / Architecture Spec |
| **Owner** | Tech Lead / Architect |
| **Status** | Draft for demo |
| **Source PRD** | [`prd.md`](./prd.md) |
| **Epic** | **EPIC-50: User Watchlist & Favorites System** |

---

## 1. Overview

This document translates the business PRD into system design, APIs, data models, and infrastructure so engineering can implement the feature safely and consistently.

---

## 2. Architecture & Stack

| Layer | Decision |
|-------|----------|
| **Frontend** | React button component that toggles between an empty heart and a filled heart |
| **Backend API** | `POST /api/v1/favorites` — receives movie ID and stores it for the authenticated user |
| **Database** | Link `user_id` ↔ `movie_id` (new table or equivalent relation) |
| **Language / Framework** | Java with Spring Boot |
| **Hosting & Infrastructure** | Kubernetes (k8s) / Docker |
| **Performance rule** | Click must respond to the user in **under 200 ms** |

### Suggested data model

```text
favorites
─────────
id         UUID / BIGSERIAL  PK
user_id    UUID / BIGINT     FK → users
movie_id   UUID / BIGINT     FK → movies
created_at TIMESTAMP
UNIQUE (user_id, movie_id)
```

### API contract (initial)

| Method | Path | Auth | Body | Behavior |
|--------|------|------|------|----------|
| `POST` | `/api/v1/favorites` | Required (Bearer token) | `{ "movieId": "..." }` | Add favorite (or toggle — see story tasks) |
| `GET` | `/api/v1/favorites` | Required | — | List current user’s favorites (My List) |
| `DELETE` | `/api/v1/favorites/{movieId}` | Required | — | Remove favorite (if not using toggle-only POST) |

---

## 3. Governance & Compliance

### Security

- **Token management** — authenticated requests only; validate access tokens on every favorites call
- **Data encryption at rest** — favorites data stored with encryption-at-rest enabled on the datastore
- **Rate limiting & throttling** — protect favorites endpoints from abuse
- **CORS policy** — allow only approved frontend origins

### Compliance

| Question | Decision for this feature |
|----------|---------------------------|
| Regulatory compliance | Follow company data-handling and privacy policies for user preference data |
| **PCI DSS required?** | **No** — favorites do not process or store payment card data |
| Other company standards | Apply existing internal security baseline and privacy guidelines |

### Logging

| Topic | Requirement |
|-------|-------------|
| Logging standard | Structured application logs (request id, user id hashed/pseudonymized where required, movie id, outcome) |
| Logging retention | Follow company retention policy for application logs (e.g. 30–90 days unless audit needs longer) |

---

## 4. Epic

**EPIC-50: User Watchlist & Favorites System**

High-level capability covering save-to-favorites UX, My List page, API, persistence, and non-functional requirements above. Too large for a single day of work — broken into user stories next.

---

## 5. User Stories (derived)

| ID | Story | File |
|----|--------|------|
| US-01 | As a logged-in user, I want to click a heart icon on a movie card so I can save it to my favorites. | [`stories/US-01-save-to-favorites.md`](./stories/US-01-save-to-favorites.md) |
| US-02 | As a logged-in user, I want to view all my saved movies on a dedicated My List page. | [`stories/US-02-view-my-list.md`](./stories/US-02-view-my-list.md) |

---

## 6. Traditional vs AI note (for demo)

| Traditional | AI SDLC |
|-------------|---------|
| Architect writes this Tech PRD by hand over days | AI generates it from **architecture skills** + **governance skills** |
| Security/compliance reviewed case by case | Same rules applied automatically from packaged skills |
| Tech lead then splits stories into tasks | AI generates [`tasks/`](./tasks/) and routes by team scope |

Human reviewers still **approve** this document before work is assigned.
