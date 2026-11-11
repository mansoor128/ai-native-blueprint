# Development to Production — Traditional vs AI SDLC

Once tasks are assigned ([`tasks/`](./tasks/)), **development finally starts**. This page is the second half of the demo: coding → review → infra → staging → QA → production.

**Feature in progress:** Add Movie to Favorites ([`prd.md`](./prd.md) · [`tech-prd.md`](./tech-prd.md))  
**App code (started):** [`../app/`](../app/)

---

## Traditional SDLC: Development to Production

Even after tasks are assigned, the work is far from done.

### 1. Development

Developers write the code: backend APIs and frontend components. When a task is complete, they push the code to Git and create a Pull Request (PR).

### 2. Code Review

A senior developer reviews the PR and either:

- **Requests changes** — PR goes back to the developer for fixes and another review round, or  
- **Approves** — code is merged and ready for deployment.

### 3. Infrastructure Provisioning (for new services)

If the feature introduces a fresh service, DevOps gathers requirements from the developer:

- CPU and memory  
- Minimum number of pods  
- Expected request volume  

DevOps then provisions databases, queues (SQS), and other dependencies. This usually involves a lot of **back and forth**, because requirements are rarely complete the first time.

### 4. Staging Deployment & QA

Once infrastructure is ready, the app is deployed to staging and a URL is shared with QA. The QA engineer **manually** verifies each step of the feature.

### 5. The Bug Cycle

If QA finds an issue, they create a bug and send it back to the developer. The cycle restarts: fix → PR → review → merge → redeploy to staging → re-test.

### 6. Production Release

When everything passes, the release gets final approval and is pushed to production.

### Traditional result — what slows each stage

| Stage | Who does it | What slows it down |
|-------|-------------|--------------------|
| Coding | Developer | Manual implementation of APIs and UI |
| PR review | Senior developer | Waiting for reviewer availability, repeated change requests |
| Infra provisioning | DevOps | Back and forth to gather CPU, memory, pod, and traffic details |
| Staging & QA | QA engineer | Manual verification of every step |
| Bug fixes | Developer and QA | Each bug restarts the code, review, deploy, and test loop |
| Production release | Approvers | Waiting for final sign-off |

Each hand-off adds waiting time; each rejection restarts a loop. Together this takes **days or weeks** before a small feature reaches production.

---

## AI SDLC: Development to Production

Once a task is assigned, the developer’s AI agents use **pre-defined skills** to build the feature, following company standards from the first line of code.

### 1. Development

The developer’s agents use pre-defined skills to write backend APIs and frontend components. When complete, the code is pushed and a PR is created.

### 2. Automated Code Review

A DevOps-built review agent checks:

- **Code quality** — standard PR review  
- **Security** — code and dependency scan  
- **Company best practices** — engineering standards  
- **Architecture** — alignment with the Technical PRD  

Failures return to the developer with detailed findings. Passes can proceed to merge.

### 3. Automated Infrastructure Provisioning (for new services)

No DevOps back-and-forth. The agent:

- Reads CPU, memory, min pods, and expected load from the **Technical PRD**  
- Provisions databases, queues (SQS), and dependencies  
- Adds monitoring and alerts  
- Follows DevOps-defined guidelines  

### 4. Staging Deployment

The agent deploys to staging without manual hand-offs.

### 5. Automated QA & Sanity Checks

A QA agent runs functional tests and sanity checks against staging. Failures return to the developer’s agents; each loop takes **minutes** instead of days.

### 6. Production Release

If all checks pass, the code is pushed to production.

### Side-by-side result

| Stage | Traditional SDLC | AI SDLC |
|-------|------------------|---------|
| Coding | Developer writes everything manually | Developer’s agents build it using pre-defined skills |
| PR review | Senior developer reviews when available | DevOps-built agent reviews instantly (quality, security, architecture) |
| Infra provisioning | DevOps gathers details through back and forth | Agent reads the Tech PRD and provisions it, with alerts |
| Staging & QA | QA verifies each step manually | QA agent runs tests and sanity checks automatically |
| Bug cycle | Each bug restarts a days-long loop | Findings return to agents; loop runs in minutes |
| Production release | Waits for manual sign-off | Pushed automatically once all checks pass |

Humans are still involved — DevOps, architects, and QA **define skills, guidelines, and checks once**; agents apply them on every feature. A change that took days or weeks can reach production in **hours**.

---

## Demo: development has started

| Task | Team | App path |
|------|------|----------|
| [TASK-01](./tasks/TASK-01-api-endpoint.md) | Backend | `app/backend` — `POST /api/v1/favorites` + toggle |
| [TASK-02](./tasks/TASK-02-heart-button-ui.md) | Frontend | `app/frontend` — heart button on movie cards |
| [TASK-03](./tasks/TASK-03-my-list-api.md) | Backend | `app/backend` — `GET` / `DELETE` favorites |
| [TASK-04](./tasks/TASK-04-my-list-page-ui.md) | Frontend | `app/frontend` — My List page |
