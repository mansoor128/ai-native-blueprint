# AI-Native Blueprint — Traditional vs AI SDLC Demo

Walkthrough of how the same feature (**Add Movie to Favorites**) moves from idea to production.

| Phase | Where to look |
|-------|----------------|
| Planning (PRD → stories → tasks) | [`documentation/`](./documentation/) |
| Development → production narrative | [`documentation/development-to-production.md`](./documentation/development-to-production.md) |
| App code (development started) | [`app/`](./app/) |
| CI → ECR + Kubernetes | [`documentation/devops.md`](./documentation/devops.md) · [`k8s/`](./k8s/) · [`.github/workflows/`](./.github/workflows/) |

## Branches (demo story)

| Branch | Story beat |
|--------|------------|
| `01-tech-prd` | Documentation only — planning artifacts |
| `02-development` | Developer has started building the app |
| `03-devops` | GitHub Actions → ECR + K8s Deployment/Service/Ingress/ConfigMap |

## Run the app

See [`app/README.md`](./app/README.md).
