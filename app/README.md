# Favorites App — Development Started

Implements **EPIC-50: User Watchlist & Favorites** from the Tech PRD.

| Piece | Stack | Maps to |
|-------|--------|---------|
| `backend/` | Java 17 · Spring Boot · PostgreSQL | TASK-01, TASK-03 |
| `frontend/` | React · Vite | TASK-02, TASK-04 |

## Run everything with Docker

From the `app/` folder:

```bash
docker compose up --build
```

That starts:

| Service | URL |
|---------|-----|
| **UI (frontend)** | http://localhost:3000 |
| **API (backend)** | http://localhost:8080 |
| **Postgres** | `localhost:5432` |

Stop with `Ctrl+C`, or in the background use `docker compose up --build -d` and later `docker compose down`.

## Local run (without full Docker stack)

```bash
# Optional DB only
docker compose up -d db

# Backend (H2 in-memory by default — no DB required)
cd backend && mvn spring-boot:run

# Frontend
cd frontend && npm install && npm run dev
```

- API: http://localhost:8080  
- UI: http://localhost:5173  

For the demo narrative (traditional vs AI path to production), see [`../documentation/development-to-production.md`](../documentation/development-to-production.md).
