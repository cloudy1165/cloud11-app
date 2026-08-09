# Automated CI/CD Pipeline with GitHub Actions — Cloud11

**Group:** Cloud11  
**Team:** Krishna Singh · Sahil Bisht · Ruhaan Babbar · Saharsh Kumar · Nishant Sangwan  
**Project Type:** IBM Internship — DevOps  
**Last Updated:** August 2026

## Project Overview

This project demonstrates a fully automated CI/CD pipeline using **GitHub Actions** for a Node.js + Express sample application. The pipeline automatically builds, tests, scans, containerizes, and deploys code on every push — with a manual approval gate for production.

### Live Demo Flow
```
code push → lint → test → Docker build → Trivy scan → GHCR push
    → auto-deploy staging → smoke test → approval gate → production
```

## Tech Stack

| Category | Choice |
|----------|--------|
| Runtime | Node.js 20 + Express |
| Database | PostgreSQL 16 (SQLite fallback for local) |
| Container | Docker (multi-stage) |
| Registry | GitHub Container Registry (GHCR) |
| Deployment | IBM Code Engine (primary), Kubernetes fallback |
| CI/CD | GitHub Actions |
| Security | Trivy, Dependabot, GitHub Secret Scanning |
| Monitoring | Structured logs + UptimeRobot |

## Quick Start

### Prerequisites
- Node.js 20+
- Docker Desktop
- PostgreSQL (optional, for local DB)
- Git

### Run Locally
```bash
# Clone the repo
git clone https://github.com/cloudy1165/cloud11-app.git
cd cloud11-app

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Run with Docker Compose (recommended)
docker-compose up --build

# Or run directly (requires PostgreSQL)
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
| GET | `/health` | Health check |
| GET | `/api/notes` | List all notes |
| GET | `/api/notes/:id` | Get single note |
| POST | `/api/notes` | Create note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |

## Pipeline Architecture

```
Developer → git push → GitHub
                             │
                             ▼
                   GitHub Actions (CI)
                 ┌───────────┼───────────┐
                 ▼           ▼           ▼
            Lint + Test  Security Scan  Build Docker
                 │           │           │
                 └───────────┼───────────┘
                             ▼
                     Trivy Image Scan
                             │
                             ▼
                   Push to GHCR (with SHA tag)
                             │
                             ▼
                  Deploy to STAGING (automatic)
                             │
                             ▼
                       Smoke Tests
                             │
                             ▼
          Manual Approval Gate (GitHub Environments)
                             │
                             ▼
                Deploy to PRODUCTION
                             │
                             ▼
                    Monitoring + Alerts
```

## Branching Strategy

See [CONTRIBUTING.md](CONTRIBUTING.md) for full details.

- `main` — Protected, always deployable
- `feature/<name>` — Feature/fix branches
- All changes via PR with required reviews + CI checks

## Secrets Management

All sensitive values are stored in GitHub Actions Secrets:
- `KUBE_CONFIG_STAGING` — Base64-encoded kubeconfig for staging
- `KUBE_CONFIG_PROD` — Base64-encoded kubeconfig for production
- `SLACK_WEBHOOK_URL` — Pipeline failure notifications

## Rollback Procedure

To roll back a bad deployment:

```bash
# List recent deployments
kubectl rollout history deployment/cloud11-app -n production

# Rollback to previous version
kubectl rollout undo deployment/cloud11-app -n production

# Verify rollback
kubectl rollout status deployment/cloud11-app -n production --timeout=120s
```

## Monitoring

- Health endpoint: `/health`
- Structured JSON logging on all requests
- UptimeRobot monitoring on staging + production URLs
- Slack alerts on pipeline failures

## Team Roles

| Member | Primary | Secondary |
|--------|---------|-----------|
| Krishna Singh | App development | Tests |
| Sahil Bisht | CI workflows | Branching strategy |
| Ruhaan Babbar | Docker + image scanning | GHCR |
| Saharsh Kumar | CD workflows | Environment setup |
| Nishant Sangwan | Monitoring + docs | Secrets management |

## License

MIT
