# Contributing to Cloud11 CI/CD Project

Thank you for contributing to the Cloud11 CI/CD Pipeline project. This document outlines our team's workflow and standards.

## Branching Strategy

We use a simplified **GitHub Flow**:

- `main` — Always deployable; protected with branch rules.
- `feature/<name>` — One branch per feature/fix; merged via PR.
- `develop` (optional) — Staging integration branch before `main`.

### Rules
1. No direct pushes to `main`.
2. All changes via PR with at least 1 approval + passing CI checks.
3. Use conventional commit messages:
   - `feat:` — New feature
   - `fix:` — Bug fix
   - `docs:` — Documentation changes
   - `chore:` — Tooling, dependencies, build changes
4. Delete feature branches after merge.

## Pull Request Process

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feat/add-new-endpoint
   ```
2. Make changes and commit with conventional messages:
   ```bash
   git add .
   git commit -m "feat: add /api/notes POST endpoint"
   ```
3. Push and open a PR:
   ```bash
   git push origin feat/add-new-endpoint
   ```
4. Ensure CI checks pass.
5. Request review from at least one team member.
6. After approval, merge and delete the branch.

## Code Standards

- Use 2-space indentation.
- Use meaningful variable and function names.
- Write tests for all new endpoints.
- Keep functions small and focused.
- Update documentation when adding features.

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Example:**
```
feat(api): add note update endpoint

- Add PUT /api/notes/:id handler
- Update validation for completed field
- Add test coverage for update flow

Closes #3
```

## Getting Help

- Check existing issues and documentation first.
- Ask in the team Slack/Discord channel.
- Tag the relevant owner (see README.md for roles).
