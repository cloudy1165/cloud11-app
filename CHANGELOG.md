# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
- Prometheus `/metrics` endpoint (`prom-client`) — `http_requests_total`, `http_request_duration_seconds`, default process metrics
- Correlation/Request-ID middleware — `X-Request-Id` UUID header on every response, propagated through logs
- Rate limiting (`express-rate-limit`) — 100 req/min per IP, excludes `/health` and `/metrics`
- OpenAPI 3.0 spec + Swagger UI at `/api/docs`
- Software Bill of Materials (SBOM) via Trivy in CD pipeline
- CI workflow concurrency control — cancels stale runs on new push
- Coverage thresholds enforced in CI (≥80% statements, ≥70% branches)
- `jest.config.js` — dedicated Jest config with thresholds and HTML reporter
- `.nvmrc` — pins Node.js 20 for nvm users
- `.editorconfig` — consistent formatting across all editors
- `.vscode/extensions.json` + `.vscode/settings.json` — team-shared VS Code config
- `CHANGELOG.md` — this file

---

## [1.0.0] — 2026-08-09

### Added
- Node.js + Express REST API for Notes (CRUD: GET, POST, PUT, DELETE)
- `/health` endpoint with status, uptime, memory, and version info
- `/api/version` endpoint with runtime metadata
- Multi-stage `Dockerfile` with non-root user, HEALTHCHECK
- `docker-compose.yml` (production — pulls from GHCR)
- `docker-compose.dev.yml` (local dev — builds from source)
- GitHub Actions CI workflow (`ci.yml`): lint → test → coverage → Trivy filesystem scan
- GitHub Actions CD workflow (`cd.yml`): build → Trivy image scan → GHCR push → Slack notify
- GitHub Actions CodeQL workflow (`codeql.yml`): static security analysis on push + weekly
- Helmet.js HTTP security headers
- Structured JSON request logger middleware
- Dependabot: weekly npm + GitHub Actions dependency updates
- CODEOWNERS: automatic review routing per file/folder
- PR template: type-of-change checklist
- Issue templates: bug report + feature request (YAML forms)
- `SECURITY.md`: responsible disclosure policy, vulnerability response timeline
- `CONTRIBUTING.md`: GitHub Flow branching strategy, commit conventions
- `DEMO.md`: step-by-step live demo script with mentor Q&A
- Postman collection: all endpoints including error cases
- Husky + lint-staged: pre-commit ESLint hook
- 20 unit tests across 3 test suites, 94%+ coverage
- GitHub Actions status badges in README
- CI/CD pipeline badges (CI, CD, CodeQL, MIT license)

### Security
- All secrets stored in GitHub Actions Secrets (zero hardcoded credentials)
- GitHub Secret Scanning enabled
- Trivy scans both filesystem (CI) and Docker image (CD)
- `npm audit` at `--audit-level=high` in every CI run

---

[Unreleased]: https://github.com/cloudy1165/cloud11-app/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/cloudy1165/cloud11-app/releases/tag/v1.0.0
