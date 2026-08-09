# Automated CI/CD Pipeline with GitHub Actions — End-to-End Project Plan

**Group:** Cloud11
**Team:** Krishna Singh · Sahil Bisht · Ruhaan Babbar · Saharsh Kumar · Nishant Sangwan
**Project Type:** IBM Internship — DevOps

---

## 1. Project Overview

The goal of this project is to design, build, and demonstrate a fully automated CI/CD (Continuous Integration / Continuous Deployment) pipeline using **GitHub Actions** for a sample application. The pipeline should automatically build, test, scan, containerize, and deploy code every time a change is pushed — with zero manual intervention beyond a code review/approval gate for production.

By the end of this project, you should be able to demonstrate: a developer pushes code → GitHub Actions automatically lints, tests, builds a Docker image, scans it for vulnerabilities, pushes it to a registry, and deploys it to a live environment (staging automatically, production on approval) — with monitoring and rollback in place.

---

## 2. Objectives & Success Criteria

| Objective | Success Criteria |
|---|---|
| Automate build & test | Every push/PR triggers automated build + unit tests |
| Enforce code quality | Linting + static analysis blocks bad code from merging |
| Containerize the app | App runs identically in Docker locally and in the cloud |
| Automate deployment | Merges to `main` auto-deploy to staging; prod requires approval |
| Security | No secrets in code; dependency & image vulnerability scanning in pipeline |
| Observability | Logs and basic metrics available for the deployed app |
| Documentation | A new developer can clone the repo and understand the pipeline in <15 min |
| Demonstrability | Live end-to-end demo: commit → auto-deploy, in front of mentors |

---

## 3. Suggested Team Roles

With 5 members, splitting ownership avoids overlap while keeping everyone across the whole pipeline (everyone should still understand every stage for the viva/demo).

| Member | Primary Ownership | Secondary |
|---|---|---|
| Krishna Singh | Sample application development (the app being deployed) | Test writing |
| Sahil Bisht | GitHub Actions CI workflows (build, test, lint) | Branching strategy/repo hygiene |
| Ruhaan Babbar | Docker/containerization + image registry | Security scanning integration |
| Saharsh Kumar | CD workflows (deployment automation, environments) | Cloud infra setup |
| Nishant Sangwan | Monitoring, logging, documentation | Secrets management, demo prep |

Rotate pairing across stages so everyone can speak to the full pipeline during evaluation — mentors often ask "explain the whole flow," not just your own piece.

---

## 4. Tech Stack & Tools

| Category | Tool/Choice | Notes |
|---|---|---|
| Source Control | GitHub | Already implied by project title |
| CI/CD Engine | GitHub Actions | Core requirement |
| Sample App | Node.js/Express, Python/Flask, or Java/Spring Boot | Pick something your team is comfortable with; Node/Express is fastest to stand up |
| Containerization | Docker | Standard for portability |
| Container Registry | GitHub Container Registry (GHCR) or Docker Hub | GHCR integrates natively with GitHub Actions auth |
| Deployment Target | IBM Cloud Kubernetes Service / OpenShift, **or** AWS/Azure free tier, **or** a simple VM with Docker Compose | See Section 10 for tradeoffs — pick based on what your mentor expects |
| IaC (optional but impressive) | Terraform | Provisions infra as code instead of manual clicks |
| Static Analysis / Linting | ESLint/Pylint + SonarCloud (free for public repos) | Code quality gate |
| Security Scanning | Trivy (image scan) + `npm audit`/`pip-audit` (dependency scan) + GitHub Dependabot | All free, all scriptable in Actions |
| Testing | Jest/Mocha (Node), PyTest (Python), or JUnit (Java) | Unit + integration tests |
| Monitoring | Prometheus + Grafana (self-hosted) or cloud-native (IBM Cloud Monitoring) | Basic dashboards |
| Logging | ELK/EFK stack or simple centralized logging via cloud provider | Keep it simple unless mentor wants more |
| Secrets Management | GitHub Actions Secrets (minimum) + optionally HashiCorp Vault | Never hardcode credentials |
| Notifications | Slack/Discord webhook from Actions | Nice touch for demo — "pipeline failed" alerts |

---

## 5. High-Level Architecture

```
Developer → git push → GitHub Repo
                            │
                            ▼
                  ┌─────────────────────┐
                  │   GitHub Actions     │
                  │  (triggered on push) │
                  └─────────┬───────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
   Lint & Static       Unit/Integration     Security Scan
     Analysis               Tests          (deps + secrets)
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
                    Build Docker Image
                            │
                            ▼
                  Scan Image (Trivy)
                            │
                            ▼
              Push Image to Registry (GHCR)
                            │
                            ▼
              Deploy to STAGING (automatic)
                            │
                            ▼
                Smoke Tests on Staging
                            │
                            ▼
         Manual Approval Gate (GitHub Environments)
                            │
                            ▼
              Deploy to PRODUCTION
                            │
                            ▼
              Monitoring / Logging / Alerts
```

---

## 6. Phase-by-Phase Plan

### Phase 0 — Kickoff & Requirement Gathering (Week 1, Days 1–2)
1. Meet as a team, read the IBM project brief carefully (or request it if not yet received).
2. Confirm with your IBM mentor:
   - Is there a mandated cloud platform (IBM Cloud specifically) or is choice open?
   - What language/stack should the sample app use, if any preference?
   - Is Kubernetes/OpenShift expected, or is a simpler deployment (VM/Docker Compose) acceptable?
   - What's the evaluation format — live demo, report, code walkthrough, or all three?
3. Document assumptions and constraints in a shared doc (Google Doc or Confluence).
4. Set up team communication channel (Slack/Discord/Teams) and a shared task board (Trello/GitHub Projects/Jira).
5. Agree on working hours/sync cadence (e.g., 2 standups/week).

**Deliverable:** One-page project charter (goals, scope, constraints, roles) — good to send back to your mentor to confirm alignment before building anything.

---

### Phase 1 — Environment & Tooling Setup (Week 1, Days 3–5)
1. Create the GitHub organization/repository for "Cloud11" (or use an existing personal repo transferred to the team).
2. Add all 5 members as collaborators with appropriate permissions.
3. Set repository settings:
   - Enable branch protection on `main`.
   - Require pull request reviews before merge (at least 1 approval).
   - Require status checks (CI) to pass before merge.
4. Every team member installs locally:
   - Git
   - Docker Desktop (or Docker Engine on Linux)
   - Node.js/Python/Java (whatever your app stack is)
   - VS Code (or preferred IDE) with relevant extensions (Docker, GitHub Actions, ESLint, etc.)
5. Create accounts (if needed) for:
   - IBM Cloud (free tier — most IBM internships provide access)
   - Docker Hub or verify GHCR access (comes free with GitHub)
   - SonarCloud (free for public repos, sign in with GitHub)
6. Set up `.gitignore` appropriate to your stack (node_modules, .env, __pycache__, etc.).

**Deliverable:** Repo created, all members can clone/push, branch protection active.

---

### Phase 2 — Sample Application Development (Week 2)
You need *something* to deploy — this shouldn't be complex, since the pipeline is the actual deliverable, not the app.

1. Decide on a simple app (recommended: a small REST API with a health-check endpoint and 1–2 real endpoints, e.g., a "notes" or "todo" API, or the "grocery price" idea you've explored before if you want to reuse familiar domain logic).
2. Scaffold the app:
   - `/health` endpoint returning `200 OK` (critical — used later for smoke tests & Kubernetes liveness probes).
   - 2–3 functional endpoints (CRUD on some resource).
   - A minimal in-memory or lightweight DB (SQLite/Postgres) — don't over-engineer.
3. Write unit tests for at least the core logic (aim for meaningful coverage, not 100%).
4. Write a `README.md` documenting how to run the app locally.
5. Push initial app code to a feature branch, open a PR, get it reviewed and merged to `main`.

**Deliverable:** Working app, runnable locally with `npm start` / `python app.py` / equivalent, with passing local tests.

---

### Phase 3 — Git Branching Strategy (Week 2, parallel with Phase 2)
Agree on and document a branching model — this matters for how your CI/CD triggers are designed.

**Recommended: simplified GitHub Flow**
- `main` — always deployable; protected.
- `feature/<name>` — one branch per feature/fix, merged via PR.
- `develop` (optional) — if you want a staging integration branch before `main`.

Rules:
1. No direct pushes to `main`.
2. All changes via PR with at least 1 approval + passing CI checks.
3. Use conventional commit messages (`feat:`, `fix:`, `chore:`, `docs:`) — this also lets you auto-generate changelogs later if you want to go further.
4. Delete feature branches after merge.

**Deliverable:** `CONTRIBUTING.md` documenting the branching rules for the team.

---

### Phase 4 — Continuous Integration (CI) Pipeline (Week 3)
This is the first real GitHub Actions workflow. Build incrementally — don't write the whole thing at once.

**Step 4.1 — Basic workflow skeleton**
Create `.github/workflows/ci.yml`:
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Run tests
        run: npm test -- --coverage
```
(Swap the setup step for `setup-python` or `setup-java` depending on your stack.)

**Step 4.2 — Add caching** to speed up repeated runs (dependency caching, shown above via `cache: 'npm'`).

**Step 4.3 — Add code coverage reporting** (upload to Codecov or just print coverage summary).

**Step 4.4 — Add static analysis** (SonarCloud scan step, or ESLint/Pylint as a separate job).

**Step 4.5 — Add dependency vulnerability scan**:
```yaml
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run npm audit
        run: npm audit --audit-level=high
```

**Step 4.6 — Make CI a required status check** in branch protection settings so PRs can't merge if it fails.

**Deliverable:** Every push/PR triggers lint + test + security scan automatically; visible green/red checks on PRs.

---

### Phase 5 — Containerization (Week 4, Days 1–3)
1. Write a `Dockerfile` for the app (multi-stage build recommended for smaller images):
```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Runtime stage
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app .
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "server.js"]
```
2. Add a `.dockerignore` (node_modules, .git, .env, etc.).
3. Build and run locally to verify:
   ```
   docker build -t cloud11-app:local .
   docker run -p 3000:3000 cloud11-app:local
   ```
4. Test the `/health` endpoint against the running container.
5. (Optional but recommended) Write a `docker-compose.yml` if your app needs a database — lets the whole team spin up the full stack with one command.

**Deliverable:** App runs identically via Docker on every team member's machine.

---

### Phase 6 — Build & Publish Docker Image in CI (Week 4, Days 4–5)
Extend the GitHub Actions workflow to build and push the image on merges to `main`.

```yaml
  build-and-push:
    needs: [build-and-test, security-scan]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build image
        run: docker build -t ghcr.io/${{ github.repository }}:${{ github.sha }} -t ghcr.io/${{ github.repository }}:latest .

      - name: Scan image with Trivy
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ghcr.io/${{ github.repository }}:${{ github.sha }}
          severity: 'CRITICAL,HIGH'
          exit-code: '1'

      - name: Push image
        run: docker push ghcr.io/${{ github.repository }} --all-tags
```

Key points to note (and be ready to explain in your viva):
- `needs:` ensures the image is only built if tests/security pass first.
- Tagging with both `latest` and the commit SHA lets you roll back to any specific build.
- Trivy scan gates the pipeline — a critical vulnerability blocks the push.

**Deliverable:** Every merge to `main` produces a scanned, versioned image in GHCR.

---

### Phase 7 — Deployment Target Setup (Week 5)
Choose your deployment target based on what's realistic for your team and mentor's expectations (see Section 10 for a full comparison). Two common paths:

**Path A — Kubernetes (IBM Cloud Kubernetes Service / OpenShift / Minikube for practice)**
1. Provision a cluster (IBM Cloud free tier, or Minikube locally if cloud access is limited).
2. Write Kubernetes manifests: `deployment.yaml`, `service.yaml`, optionally `ingress.yaml`.
3. Store `kubeconfig` securely as a GitHub Actions secret.
4. Add a deploy job using `kubectl` or `helm`.

**Path B — Simple VM / Cloud Run / App Runner (lower complexity, still legitimate)**
1. Provision a small VM (IBM Cloud Virtual Server, or free tier on any provider) or use a managed container service (IBM Code Engine, AWS App Runner, Azure Container Apps).
2. Set up SSH access or the provider's CLI-based deploy mechanism.
3. Store credentials as GitHub Actions secrets.

**Either path — set up two environments:**
- **Staging** — auto-deploys on every merge to `main`.
- **Production** — deploys only after manual approval (GitHub Environments feature has built-in approval gates).

**Deliverable:** A reachable staging URL where the app runs.

---

### Phase 8 — Continuous Deployment (CD) Pipeline (Week 6)
Extend your workflow (or create `.github/workflows/cd.yml`) to deploy automatically.

Example using Kubernetes:
```yaml
  deploy-staging:
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - name: Set up kubectl
        uses: azure/setup-kubectl@v3
      - name: Configure kubeconfig
        run: echo "${{ secrets.KUBE_CONFIG_STAGING }}" | base64 -d > kubeconfig
      - name: Deploy to staging
        run: kubectl --kubeconfig=kubeconfig set image deployment/cloud11-app app=ghcr.io/${{ github.repository }}:${{ github.sha }}

  smoke-test-staging:
    needs: deploy-staging
    runs-on: ubuntu-latest
    steps:
      - name: Hit health endpoint
        run: |
          sleep 15
          curl -f https://staging.your-app-url.com/health || exit 1

  deploy-production:
    needs: smoke-test-staging
    runs-on: ubuntu-latest
    environment: production  # configure this environment in GitHub to require manual approval
    steps:
      - uses: actions/checkout@v4
      - name: Configure kubeconfig
        run: echo "${{ secrets.KUBE_CONFIG_PROD }}" | base64 -d > kubeconfig
      - name: Deploy to production
        run: kubectl --kubeconfig=kubeconfig set image deployment/cloud11-app app=ghcr.io/${{ github.repository }}:${{ github.sha }}
```

1. In GitHub repo settings → Environments, create `staging` and `production`.
2. For `production`, add a **required reviewer** — this is your manual approval gate, and it's a genuinely important DevOps concept to demonstrate (continuous *delivery* vs continuous *deployment*).
3. Add a rollback step or document the rollback procedure (`kubectl rollout undo` or redeploying the previous image tag).

**Deliverable:** Merge to `main` → auto-deploys to staging → smoke test passes → waits for approval → deploys to production.

---

### Phase 9 — Secrets & Configuration Management (Week 6, parallel)
1. Audit the codebase — confirm zero hardcoded credentials, API keys, or connection strings.
2. Move all sensitive values to GitHub Actions Secrets (repo or environment-level).
3. Use `.env.example` in the repo (never the real `.env`) to document required variables.
4. If using Kubernetes, use `Secrets` and `ConfigMaps` rather than embedding values in manifests.
5. Enable GitHub secret scanning + push protection (repo settings → Security).
6. Enable Dependabot alerts and security updates.

**Deliverable:** A short "Security Practices" section in your documentation listing what's protected and how.

---

### Phase 10 — Monitoring, Logging & Alerting (Week 7, Days 1–3)
1. Add structured logging to the app (JSON logs, not just `console.log` text).
2. Expose a `/metrics` endpoint if using Prometheus (many frameworks have middleware for this).
3. Set up basic monitoring:
   - If on Kubernetes: deploy Prometheus + Grafana via Helm chart, or use IBM Cloud Monitoring (Sysdig-based) if using IBM Cloud.
   - If on a simpler VM: even a basic uptime check (UptimeRobot, free tier) + log aggregation is enough.
4. Create one Grafana dashboard (or equivalent) showing: request count, error rate, response time, container health.
5. Add a Slack/Discord webhook notification step in your Actions workflow for pipeline failures:
```yaml
      - name: Notify on failure
        if: failure()
        uses: slackapi/slack-github-action@v1
        with:
          payload: '{"text":"❌ Pipeline failed on ${{ github.repository }} at commit ${{ github.sha }}"}'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

**Deliverable:** One dashboard, one alert channel — enough to show observability, not a full SRE setup.

---

### Phase 11 — End-to-End Testing of the Whole Pipeline (Week 7, Days 4–5)
1. As a team, deliberately test failure paths:
   - Push code that fails a test → confirm pipeline stops, PR is blocked.
   - Push code with a known-vulnerable dependency → confirm security scan catches it.
   - Push a bad Dockerfile → confirm build step fails cleanly.
   - Deploy to staging, deliberately break the health check → confirm smoke test fails and blocks production deploy.
2. Test the approval gate — confirm production deploy actually pauses for reviewer sign-off.
3. Test rollback — deploy a broken version to production intentionally (in a controlled way) and practice rolling back.
4. Time the full pipeline (commit → production) and record it — good data point for your report.

**Deliverable:** A short table of "failure scenarios tested" with outcomes — this is exactly what evaluators like to see, since it proves you understand *why* each pipeline stage exists, not just that you copy-pasted YAML.

---

### Phase 12 — Documentation (Week 8, Days 1–3)
Write this as you go, don't leave it all to the end. Your final `README.md` / wiki should include:
1. **Project overview** — what the app does, what the pipeline does.
2. **Architecture diagram** (the one from Section 5, refined).
3. **How to run locally** (app + Docker).
4. **Branching strategy** and PR process.
5. **Pipeline stages explained** — one paragraph per stage (CI → build → scan → deploy staging → smoke test → approval → deploy prod → monitor).
6. **How secrets are managed.**
7. **How to roll back a bad deployment.**
8. **Known limitations / what you'd do with more time** (evaluators respect honest scoping).
9. **Individual contribution summary** per team member (often required for internship evaluation).

**Deliverable:** Polished `README.md` + optionally a 1-page architecture PDF.

---

### Phase 13 — Demo Preparation & Presentation (Week 8, Days 4–5)
1. Prepare a **live demo script**: make a small visible code change → push → narrate each pipeline stage as it runs in the GitHub Actions tab → show the change live on staging → approve → show it live on production.
2. Prepare a fallback (screen recording of a successful run) in case of live network/demo issues — always have a backup.
3. Prepare slides (if required) covering: problem statement, architecture, tools used, challenges faced, what you learned.
4. Assign speaking parts — each member should be ready to explain at least one phase in depth.
5. Anticipate mentor questions:
   - "What happens if a test fails on `main` directly?"
   - "How do you prevent a bad image from reaching production?"
   - "How would you scale this for multiple microservices?"
   - "What would you change for a real production system?"
6. Do a full dry run at least once, ideally two days before the actual presentation.

**Deliverable:** Rehearsed demo, backup recording, slide deck.

---

## 7. Suggested Timeline (8-Week Version)

| Week | Focus |
|---|---|
| 1 | Kickoff, requirements, environment setup |
| 2 | Sample app development + branching strategy |
| 3 | CI pipeline (build, test, lint, security scan) |
| 4 | Containerization + image build/publish in CI |
| 5 | Deployment target setup (cluster/VM/environments) |
| 6 | CD pipeline + secrets management |
| 7 | Monitoring/logging + full pipeline stress-testing |
| 8 | Documentation + demo prep + presentation |

Adjust based on your actual internship duration — if it's shorter, compress Phases 9–10 (monitoring can be minimal) and prioritize Phases 4, 6, and 8, since CI, CD, and documentation are the core deliverables an evaluator will check first.

---

## 8. Deployment Target Comparison (for deciding Phase 7)

| Option | Pros | Cons | Best if... |
|---|---|---|---|
| IBM Cloud Kubernetes/OpenShift | Matches "IBM" branding of internship, industry-realistic | Steeper learning curve, quota/setup overhead | Mentor expects IBM Cloud specifically |
| IBM Code Engine / AWS App Runner / Azure Container Apps | Much simpler than full K8s, still "real" cloud deploy | Less impressive on paper than K8s | Team is short on time or new to containers |
| Minikube/Kind (local K8s) | Free, no cloud account needed, same manifests as real K8s | Can't demo a "live public URL" | Cloud access is limited/delayed |
| Plain VM + Docker Compose + SSH deploy | Simplest to set up and explain | Less "cloud-native," fewer bonus points | Time is very limited and app is simple |

Confirm with your mentor early — this decision affects Phases 7 and 8 significantly, so don't guess.

---

## 9. Risk Management

| Risk | Mitigation |
|---|---|
| Cloud account/access delays | Start local (Minikube/Docker Compose) so pipeline logic isn't blocked |
| Secrets accidentally committed | Enable GitHub secret scanning from day 1; use `.env.example` |
| Team members blocked on each other | Keep app simple; parallelize CI/CD work on feature branches against a stable mock app early |
| Pipeline works once, breaks later ("worked on my machine") | Test failure scenarios deliberately (Phase 11), don't just test the happy path |
| Running out of time before demo | Timebox Phases 9–10 (monitoring) if needed; CI + CD + docs are the non-negotiable core |

---

## 10. Final Deliverables Checklist

- [ ] GitHub repo with branch protection and PR workflow
- [ ] Working sample application with unit tests
- [ ] `ci.yml` — lint, test, security scan on every push/PR
- [ ] Dockerfile + working container
- [ ] `cd.yml` (or extended workflow) — build, scan, push image, deploy to staging automatically, deploy to production on approval
- [ ] Staging and Production environments configured in GitHub with approval gate on production
- [ ] Secrets properly managed (none hardcoded)
- [ ] Basic monitoring dashboard + failure alert (Slack/Discord)
- [ ] Documented rollback procedure
- [ ] Full README/documentation
- [ ] Rehearsed live demo + backup recording
- [ ] Individual contribution summary

---

*Tip: send this plan (or a trimmed version of it) to your IBM mentor after your first sync — confirming scope and deployment target early (Section 8) will save you from redoing Phase 7/8 work later.*
