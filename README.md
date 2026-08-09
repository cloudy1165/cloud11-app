# Automated CI/CD Pipeline with GitHub Actions — Cloud11

[![CI](https://github.com/cloudy1165/cloud11-app/actions/workflows/ci.yml/badge.svg)](https://github.com/cloudy1165/cloud11-app/actions/workflows/ci.yml)
[![CD](https://github.com/cloudy1165/cloud11-app/actions/workflows/cd.yml/badge.svg)](https://github.com/cloudy1165/cloud11-app/actions/workflows/cd.yml)
[![CodeQL](https://github.com/cloudy1165/cloud11-app/actions/workflows/codeql.yml/badge.svg)](https://github.com/cloudy1165/cloud11-app/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Group:** Cloud11  
**Team:** Krishna Singh · Sahil Bisht · Ruhaan Babbar · Saharsh Kumar · Nishant Sangwan  
**Project Type:** IBM Internship — DevOps  
**Last Updated:** August 2026

## Project Overview

This project demonstrates a fully automated CI/CD pipeline using **GitHub Actions** for a Node.js + Express sample application. The pipeline automatically builds, tests, scans, containerizes, and pushes code to a container registry on every push to `main`.

**Deployment:** Image is built, scanned, and pushed to GHCR. Local run via Docker Compose.

### Pipeline Flow
```
code push → lint → test → Docker build → Trivy scan → GHCR push
```

## Tech Stack

| Category | Choice |
|----------|--------|
| Runtime | Node.js 20 + Express |
| Container | Docker (multi-stage) |
| Registry | GitHub Container Registry (GHCR) |
| CI/CD | GitHub Actions |
| Security | Trivy, Dependabot, GitHub Secret Scanning |
| Monitoring | Structured logs + UptimeRobot |

## Quick Start

### Prerequisites
- Node.js 20+
- Docker Desktop
- Git

### Run Locally
```bash
# Clone the repo
git clone https://github.com/cloudy1165/cloud11-app.git
cd cloud11-app

# Install dependencies
npm install

# Run with Docker Compose
docker-compose up --build

# Or run directly
npm start
```

### Run Tests
```bash
npm test
```

### Run Linter
```bash
npm run lint
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check (status, uptime, memory, version) |
| GET | `/api/version` | Version info (app version, environment, Node.js) |
| GET | `/api/notes` | List all notes |
| GET | `/api/notes/:id` | Get single note |
| POST | `/api/notes` | Create note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |

## Pipeline Architecture

```mermaid
flowchart TD
    A([👨‍💻 git push]) --> B[GitHub]
    B --> C{GitHub Actions}

    C --> D[CI Workflow]
    D --> D1[ESLint Lint]
    D --> D2[Jest Tests + Coverage]
    D --> D3[npm audit]
    D --> D4[Trivy FS Scan]
    D --> D5[CodeQL Analysis]

    D1 & D2 & D3 & D4 & D5 --> E{All checks pass?}
    E -- No --> F([❌ PR Blocked])
    E -- Yes --> G([✅ PR can merge])

    G --> H[CD Workflow on main]
    H --> H1[Docker multi-stage build]
    H1 --> H2[Trivy image scan]
    H2 --> H3[Push to GHCR with SHA + latest tag]
    H3 --> H4[Slack notify on failure]

    H3 --> I[(ghcr.io/cloudy1165/cloud11-app)]
    I --> J[docker compose pull + up]
    J --> K([🌐 App running on :3000])

    K --> L[/health — status, uptime, memory]
    K --> M[/metrics — Prometheus]
    K --> N[/api/docs — Swagger UI]
    K --> O[/api/notes — CRUD]
```

## Branching Strategy

See [CONTRIBUTING.md](CONTRIBUTING.md) for full details.

- `main` — Protected, always deployable
- `feature/<name>` — Feature/fix branches
- All changes via PR with required reviews + CI checks

## Secrets Management

All sensitive values are stored in GitHub Actions Secrets:
- `SLACK_WEBHOOK_URL` — Pipeline failure notifications

## Rollback Procedure

To roll back to a previous image:
```bash
docker compose pull  # pulls latest (revert git, re-push)
docker compose up -d --force-recreate app
```

Or redeploy a specific tag:
```bash
docker compose up -d app:ghcr.io/cloudy1165/cloud11-app:<commit-sha>
```

## Monitoring

- Health endpoint: `/health`
- Structured JSON logging on all requests
- UptimeRobot monitoring on local/staging URL
- Slack alerts on pipeline failures

## Team Roles

| Member | Primary | Secondary |
|--------|---------|-----------|
| Krishna Singh | App development | Tests |
| Sahil Bisht | CI workflows | Branching strategy |
| Ruhaan Babbar | Docker + image scanning | GHCR |
| Saharsh Kumar | CD workflows | Environment setup |
| Nishant Sangwan | Monitoring + docs | Secrets management |

## Failure Scenarios Tested

We deliberately tested each pipeline failure path to verify the gates work:

| Scenario | How to Trigger | Expected Outcome | Verified |
|----------|---------------|-----------------|----------|
| Test fails | Break a test assertion | CI fails, PR blocked | ✅ |
| Lint error | Add unused variable | CI lint step fails | ✅ |
| POST without title | `POST /api/notes` with no body | 400 Bad Request | ✅ |
| Unknown route | `GET /api/nonexistent` | 404 Not Found | ✅ |
| Delete non-existent note | `DELETE /api/notes/9999` | 404 Not Found | ✅ |
| Missing `SLACK_WEBHOOK_URL` | Unset secret | Notify job skips gracefully | ✅ |

## Rollback Procedure

### Option A — Re-push the previous tag (recommended)
```bash
# Find the last good commit SHA from GitHub Actions run history
export GOOD_SHA=<previous-commit-sha>

# Pull and run that specific image
docker compose down
IMAGE=ghcr.io/cloudy1165/cloud11-app:${GOOD_SHA} docker compose up -d app
```

### Option B — Revert the commit and let CI/CD redeploy
```bash
git revert HEAD
git push origin main
# CD pipeline re-runs automatically with the reverted code
```

### Option C — Force-recreate with latest pulled image
```bash
docker compose pull
docker compose up -d --force-recreate app
```

## Local Pipeline Testing

You can simulate GitHub Actions locally using [`act`](https://github.com/nektos/act) — no push required:

```bash
# Install act (macOS)
brew install act

# Dry-run the CI workflow
act push --dryrun

# Run the CI workflow for real (uses Docker)
act push -W .github/workflows/ci.yml
```

This is useful to verify YAML syntax changes before committing.

## Individual Contributions

| Member | Contributions |
|--------|---------------|
| **Krishna Singh** | Sample app (`server.js`, `notes.js`), unit tests, test coverage expansion |
| **Sahil Bisht** | `ci.yml` workflow, branching strategy, `CONTRIBUTING.md`, ESLint config |
| **Ruhaan Babbar** | `Dockerfile` (multi-stage), `.dockerignore`, `docker-compose.yml`, GHCR integration |
| **Saharsh Kumar** | `cd.yml` workflow, GitHub Environments setup, Dependabot config, rollback docs |
| **Nishant Sangwan** | Request logger middleware, `SECURITY.md`, README, demo preparation, `DEMO.md` |

## Lessons Learned

- **Start with the health endpoint.** Every subsequent stage (smoke tests, Docker healthcheck, Kubernetes liveness probes) depends on it — wire it in on Day 1.
- **Tag images with the commit SHA, not just `latest`.** This makes rollback trivial — you always have a specific build to go back to.
- **Test failure paths, not just happy paths.** A pipeline that only ever succeeds gives false confidence. Deliberately breaking tests and scanning vulnerable dependencies taught us more than the happy-path runs.
- **Secrets management is not an afterthought.** Setting up `.env.example` and GitHub Secrets early prevented any risk of accidental credential commits.
- **Structured logging (JSON) is worth the extra 10 lines.** It makes log parsing and monitoring setup dramatically easier.
- **Docker multi-stage builds matter.** Our runtime image is significantly smaller than a naive single-stage build — less surface area for vulnerabilities.

## License

MIT
