# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | ✅ Yes    |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, **please do NOT open a public GitHub issue**.

Instead, contact the team privately:

- **Email:** cloud11-security@example.com  
  *(replace with your actual team email)*
- **GitHub:** Open a [private security advisory](https://github.com/cloudy1165/cloud11-app/security/advisories/new)

We will acknowledge the report within **48 hours** and aim to provide a fix or workaround within **7 days** for critical issues.

## Security Practices

This project follows these security practices:

### Dependency Management
- Dependencies are scanned weekly via **Dependabot** (see `.github/dependabot.yml`).
- `npm audit` runs on every CI pipeline at `--audit-level=high`.

### Container Security
- Docker images are scanned for vulnerabilities using **Trivy** on every CI/CD run.
- The container runs as a non-root user (`nodejs:nodejs`, UID 1001).
- Only production dependencies are included in the runtime image.

### Secrets Management
- No secrets are hardcoded in the codebase.
- All sensitive values (e.g., `SLACK_WEBHOOK_URL`) are stored in **GitHub Actions Secrets**.
- GitHub Secret Scanning is enabled on this repository.
- See `.env.example` for required environment variable templates.

### Code Quality
- ESLint enforces coding standards and prevents common mistakes.
- All changes require a pull request with at least 1 reviewer approval.
- CI checks (lint + tests) must pass before merge.

## Vulnerability Disclosure Timeline

| Step | Target |
|------|--------|
| Acknowledgement | 48 hours |
| Severity triage | 72 hours |
| Fix for Critical/High | 7 days |
| Fix for Medium | 30 days |
| Fix for Low | Next release |

## Known Non-Issues

- The `/health` endpoint is intentionally unauthenticated — it is designed to be public for uptime monitoring.
- The in-memory notes store is intentional for this demo; no persistent data is at risk.
