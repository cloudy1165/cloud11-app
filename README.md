# Automated CI/CD Pipeline with GitHub Actions — Cloud11

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
                   Push to GHCR (SHA + latest tag)
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

## License

MIT
