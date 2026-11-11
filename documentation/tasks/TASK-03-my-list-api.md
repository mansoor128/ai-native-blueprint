# TASK-03 — My List API (Backend)

| Field | Value |
|-------|--------|
| **Task ID** | TASK-03 |
| **Parent story** | [US-02](../stories/US-02-view-my-list.md) |
| **Epic** | EPIC-50 |
| **Assigned to** | Backend Developer |
| **Team** | Backend |
| **Estimate** | Sprint-ready |
| **Status** | Ready to pick up |
| **Depends on** | TASK-01 (favorites persistence) |

---

## Description

Expose a read (and optional remove) API so the My List page can load and manage the current user’s saved movies.

---

## Subtasks

| ID | Subtask | Owner | Done |
|----|---------|--------|------|
| **3.1** | Implement `GET /api/v1/favorites` returning the authenticated user’s movies | Backend | ☐ |
| **3.2** | Implement remove via `DELETE /api/v1/favorites/{movieId}` or toggle semantics consistent with TASK-01 | Backend | ☐ |
| **3.3** | Add unit/integration tests for empty list, populated list, and unauthorized access | Backend | ☐ |

---

## Technical notes

- Same security baseline as TASK-01 (auth, rate limits, structured logs).
- Join/fetch enough movie metadata for the UI (title, poster, etc.) as defined by existing movie APIs.
- PCI DSS still **not** applicable (no card data).
