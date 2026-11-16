---
name: development
description: >-
  Builds and runs local full-stack apps under app/ with Java Spring Boot,
  React, MySQL, Liquibase, OpenTelemetry, versioned /api/v1 routes, and
  alpine non-root Docker images via docker-compose. Use when developing
  features, scaffolding backend/frontend, writing Dockerfiles,
  docker-compose.yml, local deploy, env wiring, DB schema, or connection pools.
disable-model-invocation: true
---

# Development (local app)

Implement and run features under `app/` using this stack and local deploy path.

## Stack (required)

| Layer | Choice |
|-------|--------|
| Backend | Java 17+ · Spring Boot |
| Frontend | React (Vite or equivalent) |
| Database | **MySQL** |
| Schema | **Liquibase** (not Hibernate `ddl-auto` for durable schema) |
| API paths | Versioned: `/api/v1/...` |
| Observability | **OpenTelemetry** (traces; metrics optional) |
| Local deploy | `docker-compose.yml` in `app/` |
| Images | **Alpine / minimal** base; process runs as UID **1000** (never root) |

Reference layout (see existing `app/`):

```
app/
  docker-compose.yml
  README.md
  backend/          # Spring Boot
  frontend/         # React
```

## When to use

- Implement backend/frontend from stories or tasks
- Add or change local Docker / compose / env
- Add Liquibase migrations, pool settings, or OTel
- Scaffold or harden Dockerfiles for backend/frontend

## Env from shell

Prefer **environment variables** already in the shell / compose `environment:` over hard-coded secrets.

1. Read common vars if set (`printenv` / `$VAR`), including:
   - `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_ROOT_PASSWORD`
   - `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`
   - `SPRING_DATASOURCE_HIKARI_MINIMUM_IDLE`, `SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE`
   - `OTEL_SERVICE_NAME`, `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_RESOURCE_ATTRIBUTES`
   - `CORS_ALLOWED_ORIGINS` / app-specific CORS var
   - `SERVER_PORT` (default `8080`)
2. In Spring, bind with `${ENV:default}` — never commit real passwords.
3. In compose, pass through from the host when present:

```yaml
environment:
  SPRING_DATASOURCE_PASSWORD: ${MYSQL_PASSWORD:-favorites}
  OTEL_EXPORTER_OTLP_ENDPOINT: ${OTEL_EXPORTER_OTLP_ENDPOINT:-http://otel-collector:4318}
```

Defaults are for **local demo only**.

## Local deploy

From `app/`:

```bash
docker compose up --build
```

Typical URLs:

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8080 |
| MySQL | localhost:3306 |

Partial local run:

```bash
docker compose up -d db
# backend: cd backend && mvn spring-boot:run
# frontend: cd frontend && npm install && npm run dev
```

Document ports and commands in `app/README.md` when changing them.

## docker-compose.yml

Include at least: `db` (MySQL), `backend`, `frontend`. Optional: OTLP collector for local traces.

Requirements:

- MySQL image: prefer `mysql:8-oracle` or official minimal tag; alpine-compatible where available
- Healthcheck on `db`; `backend` `depends_on` with `condition: service_healthy`
- Backend env: JDBC URL to `db`, user/password from shell/defaults, OTel endpoint, CORS
- Frontend publishes UI port (e.g. `3000:80`); proxies `/api/` to backend when using nginx
- Named volume for MySQL data
- No root-required bind mounts for app code in production-like services

Example shape:

```yaml
services:
  db:
    image: mysql:8.4
    environment:
      MYSQL_DATABASE: ${MYSQL_DATABASE:-favorites}
      MYSQL_USER: ${MYSQL_USER:-favorites}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD:-favorites}
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-rootfavorites}
    ports:
      - "3306:3306"
    volumes:
      - app_mysql:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "127.0.0.1", "-uroot", "-p${MYSQL_ROOT_PASSWORD:-rootfavorites}"]
      interval: 5s
      timeout: 5s
      retries: 20

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/${MYSQL_DATABASE:-favorites}
      SPRING_DATASOURCE_USERNAME: ${MYSQL_USER:-favorites}
      SPRING_DATASOURCE_PASSWORD: ${MYSQL_PASSWORD:-favorites}
      SPRING_DATASOURCE_HIKARI_MINIMUM_IDLE: ${SPRING_DATASOURCE_HIKARI_MINIMUM_IDLE:-2}
      SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE: ${SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE:-10}
      OTEL_SERVICE_NAME: ${OTEL_SERVICE_NAME:-favorites-api}
      OTEL_EXPORTER_OTLP_ENDPOINT: ${OTEL_EXPORTER_OTLP_ENDPOINT:-http://host.docker.internal:4318}
      CORS_ALLOWED_ORIGINS: ${CORS_ALLOWED_ORIGINS:-http://localhost:3000,http://127.0.0.1:3000}
    depends_on:
      db:
        condition: service_healthy

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  app_mysql:
```

## Backend (Spring Boot)

### API versioning

- Controllers: `@RequestMapping("/api/v1/<resource>")`
- No unversioned public API routes
- Frontend calls the same `/api/v1/...` paths

### MySQL + pool

```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:mysql://localhost:3306/favorites}
    username: ${SPRING_DATASOURCE_USERNAME:favorites}
    password: ${SPRING_DATASOURCE_PASSWORD:favorites}
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      minimum-idle: ${SPRING_DATASOURCE_HIKARI_MINIMUM_IDLE:2}
      maximum-pool-size: ${SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE:10}
  jpa:
    hibernate:
      ddl-auto: validate
    open-in-view: false
  liquibase:
    change-log: classpath:db/changelog/db.changelog-master.yaml
```

Always define **both** min (`minimum-idle`) and max (`maximum-pool-size`) connections.

### Liquibase

- Master changelog under `src/main/resources/db/changelog/`
- One changeSet per schema change; never rely on `ddl-auto: update` for MySQL deploy
- Include in `pom.xml`: `liquibase-core`, MySQL connector (runtime)

### OpenTelemetry

- Integrate OTel for Spring Boot (Micrometer Tracing + OTLP exporter, or OpenTelemetry Java agent in Docker `ENTRYPOINT`)
- Service name from `OTEL_SERVICE_NAME`
- Export to `OTEL_EXPORTER_OTLP_ENDPOINT` when set; degrade gracefully for local runs without a collector
- Propagate trace context on HTTP server/client spans

### Dependencies (minimum)

- `spring-boot-starter-web`, `data-jpa`, `validation`
- `mysql-connector-j`
- `liquibase-core`
- OTel / Micrometer tracing OTLP stack aligned with Boot 3.x
- Tests: `spring-boot-starter-test`

## Frontend (React)

- React app calling `/api/v1/...`
- Dev: Vite proxy `/api` → backend, or absolute URL from env
- Prod image: static build served by **nginx:alpine**; `location /api/` proxies to `http://backend:8080/api/`

## Dockerfiles (alpine / minimal, non-root)

### Rules

1. Prefer **alpine** (or distroless/jre-alpine) bases
2. Multi-stage builds; final image = runtime only
3. Create user **UID/GID 1000**; `USER 1000` (or named user with uid 1000)
4. **Never** run the app process as root
5. Writable dirs the app needs must be owned by UID 1000

### Backend example

```dockerfile
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /workspace
COPY pom.xml .
COPY src ./src
RUN apk add --no-cache maven && mvn -q -DskipTests package

FROM eclipse-temurin:17-jre-alpine
RUN addgroup -g 1000 app && adduser -D -u 1000 -G app app
WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar
RUN chown -R app:app /app
USER 1000
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Frontend example

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
RUN addgroup -g 1000 app && adduser -D -u 1000 -G app app \
 && chown -R app:app /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html \
 && sed -i 's/listen       80;/listen 8080;/' /etc/nginx/conf.d/default.conf || true
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
USER 1000
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

If nginx cannot bind low ports as non-root, listen on **8080** (or another high port) and map `3000:8080` in compose. Keep alpine + UID 1000.

## Workflow

```
Development progress:
- [ ] 1. Read story/task + tech PRD constraints
- [ ] 2. Read shell/compose env; wire ${ENV:default}
- [ ] 3. Backend: /api/v1 controller, service, repo
- [ ] 4. Liquibase changeSet for schema; Hikari min/max set
- [ ] 5. OpenTelemetry wired (agent or Micrometer OTLP)
- [ ] 6. Frontend: React UI calling /api/v1
- [ ] 7. Dockerfiles alpine + USER 1000; compose up works
- [ ] 8. Update app/README.md run instructions if needed
```

## Quality bar

- [ ] Stack matches table (Spring Boot, React, MySQL, Liquibase, OTel, `/api/v1`)
- [ ] Env readable from shell/compose; secrets not hard-coded
- [ ] Hikari **minimum-idle** and **maximum-pool-size** both set
- [ ] Schema via Liquibase; JPA validate (not update) for MySQL profile
- [ ] Final images alpine/minimal and non-root UID 1000
- [ ] `docker compose up --build` from `app/` brings up db + api + ui

## Do not

- Use PostgreSQL/H2 as the **documented** durable DB for new work (MySQL is required)
- Ship Hibernate `ddl-auto: update` as the schema strategy for compose/MySQL
- Expose unversioned APIs
- Run containers as root
- Use fat non-alpine bases when an alpine/minimal option exists
