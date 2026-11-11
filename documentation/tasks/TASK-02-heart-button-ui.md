# TASK-02 — Build the Heart Button UI (Frontend)

| Field | Value |
|-------|--------|
| **Task ID** | TASK-02 |
| **Parent story** | [US-01](../stories/US-01-save-to-favorites.md) |
| **Epic** | EPIC-50 |
| **Assigned to** | Frontend Developer |
| **Team** | Frontend |
| **Estimate** | Sprint-ready (junior / intern friendly) |
| **Status** | In progress — see `app/frontend` |

---

## Implementation (started)

- `app/frontend/src/components/HeartButton.jsx` — SVG heart + optimistic UI
- `app/frontend/src/components/MovieCard.jsx` — heart on every card
- `app/frontend/src/api.js` — calls `POST /api/v1/favorites`

## Description

Add a heart control on every movie card that calls the favorites API and updates the UI immediately.

**Stack:** React · SVG heart icon · calls `POST /api/v1/favorites`

---

## Subtasks

| ID | Subtask | Owner | Done |
|----|---------|--------|------|
| **2.1** | Create the React button component with an SVG heart icon | Frontend | ☐ |
| **2.2** | Add an `onClick` event listener that calls the backend API | Frontend | ☐ |
| **2.3** | Make the heart icon turn red immediately when clicked (optimistic UI update) | Frontend | ☐ |

---

## Technical notes

- Place the control on every movie card per the business PRD.
- Optimistic UI: filled/red heart before the network round-trip completes; roll back on error.
- Include auth token on the API call; handle 401 (prompt login).
- Keep interaction simple so the user stays engaged while browsing.

---

## Demo talking point

Until TASK-01 and TASK-02 exist and are assigned, **development has not even started** — this is the end of the planning pipeline the audience just walked through.
