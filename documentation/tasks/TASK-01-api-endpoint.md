# TASK-01 — Build the API Endpoint (Backend)

| Field | Value |
|-------|--------|
| **Task ID** | TASK-01 |
| **Parent story** | [US-01](../stories/US-01-save-to-favorites.md) |
| **Epic** | EPIC-50 |
| **Assigned to** | Backend Developer |
| **Team** | Backend |
| **Estimate** | Sprint-ready (junior / intern friendly) |
| **Status** | In progress — see `app/backend` |

---

## Implementation (started)

- `app/backend/.../web/FavoriteController.java` — `POST /api/v1/favorites`
- `app/backend/.../service/FavoriteService.java` — toggle add/remove
- `app/backend/.../FavoriteServiceTest.java` — double-click removes favorite

## Description

Implement the favorites write path so a logged-in user can add (and toggle off) a movie via the API defined in the Tech PRD.

**Endpoint:** `POST /api/v1/favorites`  
**Stack:** Java · Spring Boot · PostgreSQL · Docker / k8s

---

## Subtasks

| ID | Subtask | Owner | Done |
|----|---------|--------|------|
| **1.1** | Write the route handler for `POST /api/v1/favorites` | Backend | ☐ |
| **1.2** | Write a database query to insert `user_id` and `movie_id` into PostgreSQL | Backend | ☐ |
| **1.3** | Write a unit test to verify that clicking twice removes the favorite (toggle behavior) | Backend | ☐ |

---

## Technical notes

- Require valid auth token; reject unauthenticated requests.
- Enforce unique `(user_id, movie_id)`; second POST toggles/removes.
- Respect rate limiting and structured logging from [`tech-prd.md`](../tech-prd.md).
- Target server-side response budget that supports **&lt; 200 ms** perceived UX.

---

## Demo talking point

In **traditional SDLC**, a tech lead writes and assigns this task in planning.  
In **AI SDLC**, an agent generates this task from the Tech PRD and routes it to the Backend team using documented team scope — then a human still reviews before coding starts.
