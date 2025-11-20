<!--
Sync Impact Report
- Version change: template (unversioned) → 1.1.0 (first concrete edition)
- Modified principles:
  - Template principle placeholders → Code Quality as a First-Class Concern
  - Template principle placeholders → Testing as a Safety Net, Not an Afterthought
  - Template principle placeholders → Consistent, Accessible, and Predictable UX
  - Template principle placeholders → Performance with Explicit Budgets and Monitoring
  - Template principle placeholders → Pragmatic Governance and Continuous Improvement
- Added sections:
  - Quality, UX, and Performance Requirements
  - Development Workflow and Quality Gates
- Removed sections:
  - None
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/tasks-template.md
  - ✅ .specify/templates/agent-file-template.md
  - ✅ .specify/templates/checklist-template.md (reviewed, no changes required)
- Deferred TODOs:
  - TODO(RATIFICATION_DATE): Original ratification date unknown – set when historical decision date is established.
  - TODO(CONSTITUTION_VERSION_OLD): Previous version unknown – template did not specify; treat 1.1.0 as initial ratified version.
-->
# My Jizhang Constitution

## Core Principles

### Code Quality as a First-Class Concern

All production code MUST be:
- Readable and maintainable, with clear naming and minimal duplication.
- Structured with small, single-responsibility modules and components.
- Protected by static analysis (linters, type checks where applicable) with zero
  new high-severity findings allowed in main branches.
- Reviewed by at least one other contributor for logic, style, and
  maintainability before merge.

Rationale: High-quality code reduces defects, accelerates onboarding, and makes
future changes safer and cheaper.

### Testing as a Safety Net, Not an Afterthought

Testing discipline MUST satisfy all of the following:
- Every bug fix and feature affecting logic MUST include or update automated
  tests that would fail without the change.
- Critical paths (data persistence, calculations, billing/summary views,
  authentication, and configuration) MUST have automated test coverage
  (unit and/or integration).
- Test suites MUST be runnable via a single documented command and MUST pass
  before merging to main branches.
- Flaky tests MUST be treated as defects and addressed before relying on their
  signal.

Rationale: Tests provide confidence to refactor, ship frequently, and prevent
regressions in core flows.

### Consistent, Accessible, and Predictable UX

User experience across the app MUST follow these rules:
- Core interactions (adding transactions, editing, deleting, viewing summaries)
  MUST behave consistently across platforms and screens.
- Visual hierarchy, spacing, and typography SHOULD follow a shared design
  language; deviations MUST be deliberate and documented.
- All user-facing copy MUST be clear, concise, and consistent in terminology
  (e.g., "账单", "分类" used uniformly).
- UX changes affecting flows or navigation MUST be validated with at least one
  end-to-end test or scriptable scenario.
- Accessibility considerations (contrast, tap targets, keyboard navigation
  where relevant) MUST be respected for all new UI.

Rationale: Consistent UX reduces user confusion, support burden, and cognitive
load, leading to higher retention and satisfaction.

### Performance with Explicit Budgets and Monitoring

Performance is a product feature and MUST be engineered deliberately:
- Key flows (app launch, opening main dashboard, adding a transaction) MUST
  complete within agreed budgets on target devices.
- New features MUST declare expected performance impact when touching critical
  paths and SHOULD include measurements when risk is non-trivial.
- Obvious performance regressions (measurable increases in load time,
  jank/frame drops, or excessive network calls) MUST be investigated and
  resolved before release.
- Logging and basic metrics SHOULD be added where feasible to observe
  performance over time.

Rationale: Responsive performance is essential for daily-use finance tools and
prevents user drop-off.

### Pragmatic Governance and Continuous Improvement

The team MUST:
- Treat this constitution as the single source of truth for quality, testing,
  UX, and performance expectations.
- Prefer incremental, reversible changes over large, risky rewrites.
- Regularly reflect on incidents (bugs, UX complaints, performance issues) and
  update practices or tests to prevent repeats.
- Document non-obvious decisions that materially impact architecture, UX, or
  performance in feature specs or ADR-like notes.

Rationale: Clear governance and continuous improvement keep the project
adaptable while maintaining high standards.

## Quality, UX, and Performance Requirements

This section captures cross-cutting constraints that all features MUST obey.

- Code changes MUST not introduce new linter errors of configured severities.
- All user-visible changes MUST be accompanied by screenshots or recorded flows
  in the relevant spec/plan when practical.
- Performance-sensitive areas MUST avoid unnecessary allocations, over-rendering,
  and redundant network calls.
- Data handling MUST respect user privacy expectations; sensitive values MUST
  not be logged in plain text.
- Any new external dependency MUST be justified in the plan (purpose, impact,
  and removal strategy).

## Development Workflow and Quality Gates

The development workflow MUST enforce the principles above via explicit gates:

1. Specification
   - Feature specs MUST define user journeys, acceptance criteria, and any
     explicit UX and performance expectations.

2. Planning
   - Plans MUST identify testing strategy (unit, integration, end-to-end) and
     any performance risks.

3. Implementation
   - Code MUST follow the code-quality principle and adhere to established
     project structure and style.
   - Tests for critical paths MUST be implemented alongside the feature.

4. Review & Verification
   - Reviews MUST check adherence to principles: code quality, testing, UX
     consistency, and performance budgets.
   - CI pipelines MUST run tests and static checks; failures MUST block merge.

5. Release
   - Before release, any known deviations from this constitution MUST be
     documented with rationale and mitigation plan.

## Governance

This constitution supersedes ad-hoc practices. Changes to governance follow
these rules:

- Amendments
  - Any contributor may propose amendments via pull request referencing this
    file.
  - Material changes to principles (adding, removing, or redefining) REQUIRE
    review and approval from at least one maintainer.

- Versioning Policy
  - MAJOR: Backward-incompatible changes to principles or removal of a
    principle.
  - MINOR: Addition of new principles, sections, or significant expansion of
    guidance, as well as changes that introduce new mandatory gates.
  - PATCH: Clarifications, typo fixes, and non-behavioral wording changes.

- Compliance Reviews
  - Periodic reviews (at least once per quarter or before major releases)
    SHOULD assess adherence to this constitution.
  - Violations discovered post-merge MUST result in follow-up tasks to restore
    compliance.

**Version**: 1.1.0 | **Ratified**: TODO(RATIFICATION_DATE): Original ratification date unknown – set when historical decision date is established. | **Last Amended**: 2025-11-20
