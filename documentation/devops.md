# DevOps — CI to ECR and Kubernetes

This is the demo beat after development: **build the images, push to AWS ECR, deploy with Kubernetes**.

| Artifact | Path |
|----------|------|
| GitHub Actions workflow | [`.github/workflows/build-push-ecr.yml`](../.github/workflows/build-push-ecr.yml) |
| K8s manifests | [`k8s/`](../k8s/) |

## Traditional vs AI (short)

| Stage | Traditional | AI SDLC |
|-------|-------------|---------|
| Image build & ECR push | Manual or hand-written pipelines | Workflow generated from DevOps skills / Tech PRD |
| CPU, memory, pods | Gathered via back-and-forth | Taken from Tech PRD into Deployment resources |
| Config / Ingress | Written case by case | Templated from governance + platform skills |

## Workflow steps (what the YAML does)

1. **Checkout** the repository  
2. **Configure AWS** credentials  
3. **Login** to Amazon ECR  
4. **Build** backend + frontend Docker images  
5. **Push** images tagged with git SHA and `latest`  

## Cluster apply

```bash
# Replace ACCOUNT_ID in Deployment images (or kustomize images:)
kubectl apply -k k8s/
```

See [`k8s/README.md`](../k8s/README.md) for secrets, variables, and resource list.
