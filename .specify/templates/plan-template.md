# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., TypeScript (Taro), Node.js or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., Taro, React, Zustand or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., local storage, cloud sync backend or N/A]  
**Testing**: [e.g., Jest, React Testing Library or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., WeChat mini program, Web, iOS/Android via Taro or NEEDS CLARIFICATION]
**Project Type**: [single/web/mobile - determines source structure]  
**Performance Goals**: [e.g., app launch < 2s on target devices, main list scroll at 60 fps or NEEDS CLARIFICATION]  
**Constraints**: [e.g., <200ms p95 for adding a transaction, minimal bundle size growth or NEEDS CLARIFICATION]  
**Scale/Scope**: [e.g., daily personal use, hundreds of transactions per month or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Code Quality: Plan identifies areas of potential complexity and how they will
  stay readable, maintainable, and well-structured.
- Testing: Plan specifies which parts will be covered by unit, integration, and
  end-to-end tests, especially for critical flows.
- UX Consistency: Plan describes how new UI fits existing patterns, terminology,
  and navigation.
- Performance: Plan calls out performance-sensitive flows and any expected
  impact or mitigation.

Any planned deviations MUST be explicitly documented in the plan with rationale
and follow-up tasks.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
