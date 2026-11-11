# US-01 — Save Movie to Favorites

| Field | Value |
|-------|--------|
| **Story ID** | US-01 |
| **Epic** | EPIC-50: User Watchlist & Favorites System |
| **Source** | [`../prd.md`](../prd.md) · [`../tech-prd.md`](../tech-prd.md) |
| **Priority** | P0 |
| **Status** | Ready for task breakdown |

---

## User Story

> As a **logged-in user**,  
> I want to **click a heart icon on a movie card**  
> so that **I can save it to my favorites**.

---

## Acceptance Criteria

1. Heart (or bookmark) icon is visible on every movie card.
2. Clicking the icon saves the movie to the user’s favorites (authenticated).
3. Heart state updates immediately to filled/red (optimistic UI).
4. Clicking again removes the favorite (toggle behavior), covered by backend tests.
5. Unauthenticated users are prompted to log in (no silent failure).
6. End-to-end feel meets the **&lt; 200 ms** perceived response target from the Tech PRD.

---

## Derived Tasks (assigned to developers)

| Task | Title | Assignee team | File |
|------|--------|---------------|------|
| TASK-01 | Build the API Endpoint (Backend) | Backend | [`../tasks/TASK-01-api-endpoint.md`](../tasks/TASK-01-api-endpoint.md) |
| TASK-02 | Build the Heart Button UI (Frontend) | Frontend | [`../tasks/TASK-02-heart-button-ui.md`](../tasks/TASK-02-heart-button-ui.md) |
