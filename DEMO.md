# Cloud11 — Live Demo Script

**Group:** Cloud11  
**IBM Internship — DevOps**

---

## Pre-Demo Checklist (15 minutes before)

- [ ] Open GitHub repo in browser tab 1: `https://github.com/cloudy1165/cloud11-app`
- [ ] Open GitHub Actions tab in browser tab 2: `…/actions`
- [ ] Open GHCR packages page in tab 3: `https://github.com/cloudy1165?tab=packages`
- [ ] Have terminal open with repo cloned locally
- [ ] Run `npm test` locally — confirm all green
- [ ] Have `docker-compose.yml` ready to run locally
- [ ] Backup screen recording ready to play if live demo fails

---

## Demo Script (10–12 minutes)

### 1. Show the Application (1 min)

```bash
# Show the app running locally
npm start
# In another terminal:
curl http://localhost:3000/health
curl http://localhost:3000/api/notes
```

**Say:** "This is our sample REST API — a Notes service with full CRUD. The `/health` endpoint is key — it's used by our Docker healthcheck, our pipeline smoke tests, and monitoring."

---

### 2. Show the Code + Branch Protection (1 min)

- Open `src/server.js` and `src/routes/notes.js` briefly.
- Open repo **Settings → Branches → main** — show branch protection rules (require PR, require CI to pass).

**Say:** "Direct pushes to main are blocked. Every change goes through a pull request, and CI must pass before merge."

---

### 3. Trigger the Pipeline — Make a Visible Change (2 min)

```bash
git checkout -b demo/add-version-endpoint
```

Add a new endpoint to `src/server.js`:
```js
app.use('/api/version', (req, res) => {
  res.json({ version: process.env.APP_VERSION || '1.0.0', env: process.env.NODE_ENV });
});
```

```bash
git add .
git commit -m "feat: add /api/version endpoint for demo"
git push origin demo/add-version-endpoint
```

- Open GitHub → create a Pull Request to `main`.

**Say:** "As soon as I open this PR, GitHub Actions triggers automatically — no manual steps."

---

### 4. Watch CI Run Live (2–3 min)

- Switch to the **Actions tab** — show the CI workflow running.
- Walk through each job as it runs:
  - **lint-and-test** — "ESLint enforces code style. Jest runs our 19 tests and generates a coverage report."
  - **security-scan** — "`npm audit` checks for vulnerable dependencies. Trivy scans the filesystem for known CVEs."
- Show the green checkmarks appear on the PR page.

**Say:** "Notice the PR is blocked from merging until all these checks pass. This is our quality gate."

---

### 5. Merge → Trigger CD (1–2 min)

- Merge the PR on GitHub.
- Switch to Actions — show **CD workflow** starting automatically.
- Walk through:
  - Docker **multi-stage build** — "Production image only contains what the app needs to run — no dev dependencies, no build tools."
  - **Trivy image scan** — "Scans the built image for OS and package vulnerabilities before it ever hits the registry."
  - **GHCR push** — "Image is tagged with both the commit SHA and `latest`."

**Say:** "Every merge to main produces a scanned, versioned, immutable image in our container registry."

---

### 6. Show the Image in GHCR (30 sec)

- Open `https://github.com/cloudy1165?tab=packages`
- Show the pushed image with SHA tag and `latest`.

**Say:** "Both tags exist. If this build had a bug, we can roll back to any previous SHA — the old image is still there."

---

### 7. Run Locally with Docker (1 min)

```bash
docker compose pull
docker compose up -d
curl http://localhost:3000/health
curl http://localhost:3000/api/notes
```

**Say:** "This is how someone would deploy from the registry — one command pulls the exact image from GHCR and runs it."

---

### 8. Show Structured Logs (30 sec)

```bash
docker compose logs app
```

**Say:** "All requests are logged as structured JSON — timestamp, method, URL, status code, and response time. This is what you'd feed into a log aggregator like ELK or IBM Log Analysis."

---

### 9. Show a Failure Path (1–2 min)

```bash
git checkout -b demo/bad-test
```

Break a test in `tests/server.test.js`:
```js
expect(res.statusCode).toBe(999); // deliberately wrong
```

```bash
git add .
git commit -m "test: deliberately broken test for demo"
git push origin demo/bad-test
# Open a PR
```

- Show CI running → **RED** ❌
- Show the PR is **blocked** from merging.

**Say:** "A developer with a bad change cannot merge it. The pipeline caught it before any human reviewer even needed to look."

```bash
# Restore: close the PR without merging, delete branch
git checkout main
git branch -D demo/bad-test
```

---

### 10. Security & Secrets (30 sec)

- Open **Settings → Secrets and variables → Actions** — show `SLACK_WEBHOOK_URL` exists (don't reveal the value).
- Open `.env.example` — "This is what we commit — a template, never the real values."
- Show `SECURITY.md`.

**Say:** "Zero hardcoded credentials. GitHub Secret Scanning alerts us if a key is ever accidentally committed."

---

### 11. Dependabot (30 sec)

- Open `.github/dependabot.yml`.
- Open **Security → Dependabot alerts** on the repo.

**Say:** "Dependabot runs weekly and opens automated PRs when our npm or GitHub Actions dependencies have updates or vulnerabilities. We don't have to manually track these."

---

## Anticipated Mentor Questions

| Question | Answer |
|----------|--------|
| "What happens if a test fails on main directly?" | Direct pushes to main are blocked by branch protection. Tests run on PRs before merge. |
| "How do you prevent a bad image reaching production?" | Trivy image scan runs before the push step — a CRITICAL vulnerability exits with code 0 (logged as SARIF) and blocks further deployment. |
| "How do you roll back?" | Every image is tagged with commit SHA. We pull a previous tag and `docker compose up --force-recreate`. Takes ~30 seconds. |
| "How would you scale this for microservices?" | Each service gets its own repo + CI/CD pipeline. Shared reusable workflows in a central `.github` repo. Service mesh (Istio) handles inter-service comms. |
| "What would you change for real production?" | Add a real deployment target (IBM Code Engine or K8s), proper secrets rotation with Vault, Prometheus+Grafana dashboards, and alert escalation policies. |
| "What's the difference between CI and CD?" | CI = run tests/build on every push (continuous integration). CD = automatically deploy the verified artifact (continuous delivery/deployment). Our pipeline does both. |
| "Why multi-stage Docker build?" | Keeps the runtime image small and secure — build tools, dev deps, and source files aren't included. Smaller attack surface, faster pulls. |

---

## Backup Plan

If the live demo fails (network, GitHub down, etc.):

1. Play the **backup screen recording** (record this in advance during a successful run).
2. Walk through the code and YAML files directly — explain each file's purpose.
3. Show the **GHCR packages page** (already pushed images visible there).

---

*Cloud11 Team — IBM Internship DevOps Demo*
