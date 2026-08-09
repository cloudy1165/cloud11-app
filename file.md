# Automated CI/CD Pipeline with GitHub Actions — End-to-End Project Plan

**Group:** Cloud11  
**Team:** Krishna Singh · Sahil Bisht · Ruhaan Babbar · Saharsh Kumar · Nishant Sangwan  
**Project Type:** IBM Internship — DevOps  
**Last Updated:** August 2026

---

## 1. Project Overview

The goal of this project is to design, build, and demonstrate a fully automated CI/CD pipeline using **GitHub Actions** for a sample application. The pipeline will automatically build, test, scan, containerize, and deploy code on every push, with a manual approval gate for production.

By the end of the project, the team will demonstrate a complete end-to-end flow: code push → linting → testing → Docker image build → vulnerability scanning → registry push → automatic staging deployment → production deployment after approval → monitoring.

---

## 2. Objectives & Success Criteria

| Objective                    | Success Criteria                                      |
|-----------------------------|-------------------------------------------------------|
| Automate build & test       | Every push/PR triggers build + unit tests             |
| Enforce code quality        | Linting + static analysis blocks bad code             |
| Containerize the app        | App runs identically via Docker locally and in cloud  |
| Automate deployment         | Merges to `main` auto-deploy to staging; prod requires approval |
| Security                    | No secrets in code; dependency + image scanning in pipeline |
| Observability               | Basic logs and metrics available for the deployed app |
| Documentation               | New developer can understand the pipeline in <15 min  |
| Demonstrability             | Live end-to-end demo in front of mentors              |

---

## 3. Recommended Tech Stack (Locked in Week 1)

| Category              | Tool / Choice                          | Reason |
|-----------------------|----------------------------------------|--------|
| Sample Application    | **Node.js + Express**                  | Fastest to build, excellent GitHub Actions support |
| Database              | PostgreSQL (or SQLite for simplicity)  | Lightweight and easy to containerize |
| Containerization      | Docker (multi-stage)                   | Industry standard |
| Registry              | GitHub Container Registry (GHCR)       | Native GitHub integration |
| Deployment Target     | **IBM Code Engine** (primary)          | Simple, modern, and impressive |
| Alternative (if needed) | Docker Compose on VM or IBM Kubernetes | Only if mentor specifically requires K8s |
| IaC (optional)        | Terraform                              | Shows infrastructure-as-code knowledge |
| Security              | Trivy + Dependabot + GitHub Secret Scanning | Free and powerful |
| Monitoring            | Basic structured logging + UptimeRobot | Keep it lightweight |

> **Decision:** Finalize and document the tech stack by end of Week 1.

---

## 4. Team Roles

| Member              | Primary Ownership                          | Secondary Focus                  |
|---------------------|--------------------------------------------|----------------------------------|
| Krishna Singh       | Sample application development             | Unit & integration tests         |
| Sahil Bisht         | GitHub Actions CI workflows                | Branching strategy & repo hygiene |
| Ruhaan Babbar       | Docker + image building & scanning         | GHCR integration                 |
| Saharsh Kumar       | CD workflows + deployment automation       | Environment setup & IaC          |
| Nishant Sangwan     | Monitoring, logging, documentation         | Secrets management & demo prep   |

**Rule:** Everyone must understand the full pipeline for the viva/demo.

---

## 5. High-Level Architecture

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

---

## 6. Phase-by-Phase Plan

### Phase 0 — Kickoff (Week 1, Days 1–2)
- Confirm requirements with IBM mentor (cloud platform, expected complexity, evaluation format).
- Finalize and document tech stack.
- Create GitHub organization + repository.
- Set up branch protection on `main` (require PR + status checks).
- Create shared communication channel and task board (GitHub Projects).

**Deliverable:** One-page project charter.

### Phase 1 — Environment Setup (Week 1, Days 3–5)
- All members set up local environment (Docker, Node.js, Git).
- Enable GitHub secret scanning and push protection.
- Create `.gitignore` and `.env.example`.

**Deliverable:** Repo ready with branch protection active.

### Phase 2 — Sample Application + Branching Strategy (Week 2)
- Build a small REST API with `/health` endpoint + 2–3 functional endpoints.
- Write unit tests (aim for good coverage).
- Implement simplified GitHub Flow.
- Create `CONTRIBUTING.md`.

**Deliverable:** Working app with tests + documented branching rules.

### Phase 3 — Continuous Integration (Week 3)
- Create `.github/workflows/ci.yml`
- Add: checkout → setup Node → install → lint → test → coverage
- Add dependency scanning (`npm audit`)
- Make CI a required status check

**Deliverable:** Every PR/push runs lint + test + security scan.

### Phase 4 — Containerization + Image Pipeline (Week 4)
- Write multi-stage `Dockerfile`
- Add `.dockerignore`
- Extend workflow to build, scan (Trivy), and push to GHCR on `main`
- Tag images with commit SHA + `latest`

**Deliverable:** Every merge to `main` produces a scanned image in GHCR.

### Phase 5 — Deployment Target & CD Pipeline (Week 5)
- Set up **IBM Code Engine** (or fallback) with staging + production environments.
- Create `.github/workflows/cd.yml`
- Implement automatic staging deployment
- Add manual approval gate for production using GitHub Environments
- Add smoke tests after staging deploy

**Deliverable:** Merge to `main` → auto-deploy to staging → approval → production.

### Phase 6 — Secrets, Security & Rollback (Week 6)
- Move all secrets to GitHub Actions Secrets
- Enable Dependabot
- Document and test rollback procedure

**Deliverable:** Zero hardcoded secrets + documented rollback process.

### Phase 7 — Monitoring + Pipeline Stress Testing (Week 7)
- Add structured JSON logging
- Set up basic monitoring (UptimeRobot or simple dashboard)
- Deliberately test failure scenarios (bad test, vulnerable dependency, failed health check)

**Deliverable:** Failure scenarios documented with results.

### Phase 8 — Documentation + Demo Preparation (Week 8)
- Polish `README.md` (see recommended structure below)
- Prepare live demo script + backup recording
- Conduct full dry run

**Deliverable:** Complete documentation + rehearsed demo.

---

## 7. Suggested Timeline (8 Weeks)

| Week | Focus                              | Priority          |
|------|------------------------------------|-------------------|
| 1    | Kickoff + Setup + Tech Stack       | Must Have         |
| 2    | App + Branching + Basic CI         | Must Have         |
| 3    | Full CI + Security Scanning        | Must Have         |
| 4    | Docker + Image Build & Push        | Must Have         |
| 5    | CD Pipeline + Approval Gate        | Must Have         |
| 6    | Secrets + Rollback                 | Must Have         |
| 7    | Monitoring + Failure Testing       | High              |
| 8    | Documentation + Demo               | Must Have         |

---

## 8. Must-Have vs Nice-to-Have

| Category              | Must Have                              | Nice to Have                     |
|-----------------------|----------------------------------------|----------------------------------|
| Pipeline              | CI + Docker + CD + Approval Gate       | Reusable workflows               |
| Security              | Trivy + Secrets + Dependabot           | CodeQL                           |
| Deployment            | Staging + Production with approval     | Terraform                        |
| Observability         | Structured logs + basic monitoring     | Prometheus + Grafana             |
| Demo                  | Live happy path + one failure path     | Slack notifications              |

---

## 9. Recommended README Structure

1. Project Overview + Architecture Diagram
2. Quick Start (local + Docker)
3. Branching Strategy & PR Process
4. Pipeline Stages Explained (with screenshots)
5. Secrets Management
6. Rollback Procedure
7. Monitoring & Alerts
8. Lessons Learned
9. Individual Contributions

---

## 10. Risk Management

| Risk                              | Mitigation                                      |
|-----------------------------------|-------------------------------------------------|
| Cloud access delays               | Start with Docker Compose fallback              |
| Workflow YAML errors              | Use `act` tool to test workflows locally        |
| Secrets accidentally committed    | Enable secret scanning on Day 1                 |
| One member falling behind         | Pair on CI/CD workflows                         |
| Demo fails live                   | Prepare backup screen recording                 |

---

## 11. Final Deliverables Checklist

- [ ] GitHub repo with branch protection
- [ ] Working sample app with tests
- [ ] Complete CI workflow (lint + test + security)
- [ ] Dockerfile + multi-stage build
- [ ] CD workflow with staging + production + approval gate
- [ ] All secrets properly managed
- [ ] Documented rollback procedure
- [ ] Basic monitoring + failure testing results
- [ ] High-quality README
- [ ] Rehearsed live demo + backup recording

---

**Tip:** Send this plan (or a shortened version) to your IBM mentor after the first meeting to confirm scope and deployment expectations.

---

*Prepared by Cloud11 Team*
