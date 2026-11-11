# US-02 — View My List

| Field | Value |
|-------|--------|
| **Story ID** | US-02 |
| **Epic** | EPIC-50: User Watchlist & Favorites System |
| **Source** | [`../prd.md`](../prd.md) · [`../tech-prd.md`](../tech-prd.md) |
| **Priority** | P0 |
| **Status** | Ready for task breakdown |

---

## User Story

> As a **logged-in user**,  
> I want to **view all my saved movies on a dedicated My List page**  
> so that **I can find movies I saved earlier without searching again**.

---

## Acceptance Criteria

1. Authenticated user can open a **My List** page from the main navigation.
2. Page lists all movies currently in the user’s favorites.
3. Empty state is clear when the user has no favorites yet.
4. User can remove a movie from My List (consistent with toggle/remove API).
5. Data is loaded via authenticated `GET /api/v1/favorites` (or equivalent).

---

## Derived Tasks (assigned to developers)

| Task | Title | Assignee team | File |
|------|--------|---------------|------|
| TASK-03 | My List API (Backend) | Backend | [`../tasks/TASK-03-my-list-api.md`](../tasks/TASK-03-my-list-api.md) |
| TASK-04 | My List Page UI (Frontend) | Frontend | [`../tasks/TASK-04-my-list-page-ui.md`](../tasks/TASK-04-my-list-page-ui.md) |
