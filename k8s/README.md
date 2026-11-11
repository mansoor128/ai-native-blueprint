# Kubernetes manifests — Favorites (EPIC-50)

Deploy the images built by [`.github/workflows/build-push-ecr.yml`](../.github/workflows/build-push-ecr.yml).

## Resources

| Kind | Name | Purpose |
|------|------|---------|
| Namespace | `favorites` | Isolation |
| ConfigMap | `favorites-backend-config` | Spring / CORS / DB host |
| ConfigMap | `favorites-frontend-nginx` | Nginx proxies `/api` → backend |
| Secret | `favorites-backend-secret` | DB password (demo placeholder) |
| Deployment | `favorites-backend` | API pods (2 replicas) |
| Deployment | `favorites-frontend` | UI pods (2 replicas) |
| Service | `favorites-backend` | ClusterIP `:8080` |
| Service | `favorites-frontend` | ClusterIP `:80` |
| Ingress | `favorites` | `favorites.example.com` → UI + `/api` |

## Apply

1. Replace `ACCOUNT_ID` in the Deployment image fields (or set via Kustomize).
2. Point Ingress `host` at your DNS name.
3. Create GitHub secrets for CI (see workflow README below).

```bash
# After updating ACCOUNT_ID / tags
kubectl apply -k k8s/
```

## GitHub Actions → ECR

Required repository **secrets**:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

Optional repository **variables**:

- `AWS_REGION` (default `eu-west-1`)
- `BACKEND_ECR_REPOSITORY` (default `ai-native-favorites-backend`)
- `FRONTEND_ECR_REPOSITORY` (default `ai-native-favorites-frontend`)

On push to `03-devops` / `main` (paths under `app/`), or via **workflow_dispatch**, the workflow:

1. Checks out the repo  
2. Logs into AWS ECR  
3. Builds backend + frontend Docker images  
4. Pushes `:sha` and `:latest` tags  
