---
name: devops
description: >-
  Defines CI/CD and Kubernetes standards: GitHub Actions (checkout, Sonar,
  Trivy, build, push ECR, update k8s image for Argo CD), New Relic in Docker,
  k8s manifests with AWS Secrets and ConfigMaps, jeeny.me ingress DNS, HPA,
  probes, PDB, rolling updates, and logging. Use when working on DevOps,
  CI/CD, GitHub Actions, ECR, Argo CD, k8s/, Ingress, HPA, or deploy manifests.
disable-model-invocation: true
---

# DevOps skill

Standards for CI/CD, Docker observability, and Kubernetes deploy.  
Reference this repo: `.github/workflows/`, `k8s/`, `app/*/Dockerfile`.

---

## When to use

- Adding or changing GitHub Actions / CI/CD
- Building images, pushing to ECR, or wiring Argo CD
- Creating or updating files under `k8s/`
- Adding New Relic to Docker images
- Setting Ingress DNS, HPA, probes, PDB, or rolling updates
- Deciding where application logs go

---

## Minimum CI/CD (GitHub Actions)

**Pipeline tool:** GitHub Actions (see `.github/workflows/build-push-ecr.yml`).

**Minimum job flow (in order):**

1. **Checkout** the repository (`actions/checkout`)
2. **Sonar scan** — quality / coverage gate (fail the pipeline on gate failure)
3. **Trivy scan** — filesystem + image CVE scan (fail on CRITICAL/HIGH per policy)
4. **Build** Docker images (backend + frontend)
5. **Push** images to **Amazon ECR** (tag with short git SHA + optional `latest`)
6. **Update** image tag in `k8s/*-deployment.yaml` (or Kustomize `images:` newTag) **in the repo**
7. **Commit / push** that manifest change so **Argo CD** detects Git drift and deploys

**Also required:**

- Authenticate to AWS (OIDC preferred; access keys only if needed)
- Login to ECR before push
- Ensure ECR repos exist (or create once with scan-on-push)
- Trigger on push to deploy branches (`main`, env branches) when `app/**` or workflow changes; support `workflow_dispatch`
- Do **not** deploy with `kubectl apply` from CI when Argo CD owns the cluster — Git is the source of truth

**Secrets / variables (examples):**

- Secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` (or OIDC role), Sonar token
- Variables: `AWS_REGION` (default `eu-west-1`), backend/frontend ECR repository names

---

## Docker + New Relic

**Update Dockerfiles** (still alpine/minimal + non-root UID 1000 per development skill) to include the **New Relic** APM agent.

**Backend (Java / Spring Boot):**

- Add New Relic Java agent to the image (download in build stage or copy agent files)
- Start with `-javaagent:/newrelic/newrelic.jar` (or equivalent)
- Pass env into the container / Dockerfile `ENV`:
  - `NEW_RELIC_AGENT_ENABLED` — `true` / `false`
  - `NEW_RELIC_APP_NAME` — service name (e.g. `favorites-api`)
  - `NEW_RELIC_LICENSE_KEY` — from **Kubernetes Secret / AWS Secrets** only (never bake into image)

**Frontend:**

- Use New Relic Browser agent when applicable, or skip JVM agent
- Still set clear app naming via env/config where used

**Rule:** feature flags and app name via env; license key never committed.

---

## Kubernetes manifests (`k8s/`)

Keep manifests in the **`k8s/`** folder (namespace, ConfigMaps, Secret refs, Deployments, Services, Ingress, Kustomization). Apply via Argo CD from Git.

### ConfigMap — public / non-secret env

Use **ConfigMap** for values that are safe to show in Git, for example:

- Database **name**
- Database **server / JDBC host link** (hostname only, not password)
- Spring profile, `SERVER_PORT`
- CORS allowed origins
- `NEW_RELIC_APP_NAME`, `NEW_RELIC_AGENT_ENABLED`
- Frontend nginx config snippets

Wire into pods with `envFrom.configMapRef` or explicit `configMapKeyRef`.

### Secrets — AWS Secrets Manager

- **Do not** put real passwords in Git `Secret` manifests for production
- Use **AWS Secrets Manager** (External Secrets / CSI / Secrets Store) to sync into a K8s Secret
- Secret data examples: DB password, New Relic license key, API keys
- Demo `k8s/secret.yaml` placeholders are local-only — replace with AWS-backed secrets before real clusters

### Typical files

- `namespace.yaml`
- `configmap.yaml` — public env + nginx config
- `secret.yaml` — only as ExternalSecret reference or demo placeholder
- `backend-deployment.yaml` / `frontend-deployment.yaml` — image from ECR; CI updates tag
- `backend-service.yaml` / `frontend-service.yaml` — ClusterIP
- `ingress.yaml` — DNS + paths
- `kustomization.yaml` — lists resources; `images.newTag` updated by CI
- Optional: `hpa.yaml`, `pdb.yaml`

---

## Ingress, DNS, and paths

**Domain:** `jeeny.me`

**Preferred hosts:**

- Backend API → **`api.jeeny.me`**
- Frontend web → **`web.jeeny.me`**

**Paths:**

- On `api.jeeny.me`: `/api` (or `/api/v1`) → backend Service `:8080`
- On `web.jeeny.me`: `/` → frontend Service (UI)
- Do not put unrelated apps on these hosts without an explicit path plan

**TLS:** HTTPS on 443 with cluster/ALB certificate (ACM on EKS/ALB when used).

**Note:** Older demo ingress may use a single host (`favorites.example.com`) with `/api` + `/`. Prefer the split `api.` / `web.` jeeny.me hosts above for real deploy.

---

## HPA (minimum)

- **Minimum replicas (HPA minReplicas):** `2`
- **maxReplicas:** set from expected load (e.g. `6`–`10` unless tech PRD says otherwise)
- Scale on CPU (and memory if needed); target ~60–70% CPU
- Frontend and backend each get their own HPA

---

## Health checks (minimum intervals)

Align with existing `k8s` probe style; do not probe more aggressively than:

| Probe | Minimum `periodSeconds` | Notes |
|-------|-------------------------|--------|
| Readiness | **10s** | Backend may need higher `initialDelaySeconds` (e.g. 20s) for JVM |
| Liveness | **20s** | Avoid tight loops; backend initial delay often ≥ 40s |

- Prefer HTTP probes on a real health path when available (`/actuator/health`); TCP only if no HTTP health yet
- Frontend: HTTP `GET /` is fine

---

## Pod Disruption Budget (PDB)

- For every Deployment with **≥ 2** replicas, add a PDB
- Prefer **`minAvailable: 1`** (or `maxUnavailable: 1` when replica count is higher)
- Goal: voluntary disruptions (node drain, upgrades) never take the whole service down

---

## Rolling update strategy

Use `RollingUpdate` with:

- **`maxUnavailable: 25%`**
- **`maxSurge: 25%`**

For small replica counts (2), this behaves like cautious partial rollout.  
Do not use `Recreate` for API/UI services unless a one-off migration requires it.

---

## Logging — where logs go

**Application / container logs → Elasticsearch (preferred).**

- Ship with Fluent Bit / Filebeat (or cluster log stack) to **Elasticsearch / OpenSearch**
- Keep structured JSON logs (request id, service, level, message)
- Better search and app debugging for Spring Boot / nginx logs

**CloudWatch:**

- Use for **AWS / cluster infrastructure** signals (EKS control plane, node metrics, ALB access logs) when on AWS
- Not the primary long-term store for app log search if Elasticsearch is available

**Summary:** app logs → Elasticsearch; AWS infra logs → CloudWatch as needed.

---

## Workflow checklist

```
DevOps progress:
- [ ] GitHub Action: checkout → Sonar → Trivy → build → ECR push
- [ ] CI updates k8s image tag; Argo CD deploys from Git
- [ ] Dockerfile: New Relic agent + NEW_RELIC_AGENT_ENABLED + NEW_RELIC_APP_NAME
- [ ] ConfigMap = public env (DB name, DB host); secrets from AWS Secrets Manager
- [ ] Ingress: api.jeeny.me + web.jeeny.me
- [ ] HPA min 2; readiness ≥ 10s; liveness ≥ 20s period
- [ ] PDB present; rolling update 25% / 25%
- [ ] App logs to Elasticsearch; CloudWatch for infra if needed
```

---

## Do not

- Skip Sonar or Trivy on the main deploy pipeline
- Push images without updating Git manifests Argo CD watches
- Commit real DB passwords or New Relic license keys
- Put secrets in ConfigMaps
- Run below 2 replicas in deployed environments without an explicit exception
- Rely on CloudWatch alone for application log search when Elasticsearch is the standard
