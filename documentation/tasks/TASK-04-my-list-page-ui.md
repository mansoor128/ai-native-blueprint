# TASK-04 — My List Page UI (Frontend)

| Field | Value |
|-------|--------|
| **Task ID** | TASK-04 |
| **Parent story** | [US-02](../stories/US-02-view-my-list.md) |
| **Epic** | EPIC-50 |
| **Assigned to** | Frontend Developer |
| **Team** | Frontend |
| **Estimate** | Sprint-ready |
| **Status** | Ready to pick up |
| **Depends on** | TASK-03 (My List API) |

---

## Description

Build the dedicated **My List** page where users see all movies they saved via the heart icon.

---

## Subtasks

| ID | Subtask | Owner | Done |
|----|---------|--------|------|
| **4.1** | Add a My List route/page and navigation entry | Frontend | ☐ |
| **4.2** | Fetch and render favorites from `GET /api/v1/favorites` | Frontend | ☐ |
| **4.3** | Empty state + ability to remove a movie from the list | Frontend | ☐ |

---

## Technical notes

- Match existing design guidelines for movie cards where possible.
- Handle loading and error states clearly.
- Require login; redirect or prompt if unauthenticated.
