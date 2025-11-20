---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests for critical flows (data persistence, main dashboards,
transaction creation/editing, authentication if present) are RECOMMENDED and
SHOULD be added when risk is non-trivial. When the feature spec marks tests as
mandatory, corresponding test tasks MUST be added.

**Organization**: Tasks are grouped by user story to enable independent
implementation and testing of each story while preserving UX and performance
requirements.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

<!-- 
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.
  
  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/
  - Constitution principles for code quality, testing, UX consistency, and performance
  
  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment
  
  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure aligned with
constitution principles

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting, formatting, and basic test tooling

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story
can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Setup database schema and migrations framework
- [ ] T005 [P] Implement authentication/authorization framework
- [ ] T006 [P] Setup API routing and middleware structure
- [ ] T007 Create base models/entities that all stories depend on
- [ ] T008 Configure error handling, logging, and basic performance monitoring
- [ ] T009 Setup environment configuration management

**Checkpoint**: Foundation ready - user story implementation can now begin in
parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1 (if required by spec or high risk)

> Write these tests FIRST, ensure they FAIL before implementation.

- [ ] T010 [P] [US1] Contract/end-to-end test for primary user journey
- [ ] T011 [P] [US1] Integration test for main data and UI flow

### Implementation for User Story 1

- [ ] T012 [P] [US1] Create/update models in src/models/[entity].*
- [ ] T013 [P] [US1] Implement services in src/services/[service].*
- [ ] T014 [US1] Implement UI/interaction in src/[location]/[file].*
- [ ] T015 [US1] Add validation, error handling, and logging
- [ ] T016 [US1] Verify UX consistency (navigation, copy, visuals)
- [ ] T017 [US1] Check performance for this story against defined budgets

**Checkpoint**: At this point, User Story 1 should be fully functional, tested
(as required), and aligned with UX/performance principles.

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 (if required by spec or high risk)

- [ ] T018 [P] [US2] Contract/end-to-end test for primary user journey
- [ ] T019 [P] [US2] Integration test for main data and UI flow

### Implementation for User Story 2

- [ ] T020 [P] [US2] Create/update models in src/models/[entity].*
- [ ] T021 [US2] Implement services in src/services/[service].*
- [ ] T022 [US2] Implement UI/interaction in src/[location]/[file].*
- [ ] T023 [US2] Integrate with User Story 1 components (if needed)
- [ ] T024 [US2] Verify UX consistency and performance impact

**Checkpoint**: At this point, User Stories 1 AND 2 should both work
independently.

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 (if required by spec or high risk)

- [ ] T025 [P] [US3] Contract/end-to-end test for primary user journey
- [ ] T026 [P] [US3] Integration test for main data and UI flow

### Implementation for User Story 3

- [ ] T027 [P] [US3] Create/update models in src/models/[entity].*
- [ ] T028 [US3] Implement services in src/services/[service].*
- [ ] T029 [US3] Implement UI/interaction in src/[location]/[file].*
- [ ] T030 [US3] Verify UX consistency and performance impact

**Checkpoint**: All user stories should now be independently functional and
respect core principles.

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring to improve maintainability
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX [P] Additional unit/integration tests in tests/
- [ ] TXXX Security and privacy hardening
- [ ] TXXX Run quickstart.md validation and UX review

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user
  stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No
  dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate
  with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate
  with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) SHOULD be written and FAIL before implementation
- Models before services
- Services before endpoints/UI
- Core implementation before integration
- Story complete (including tests and UX/performance checks) before moving to
  next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if
  team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team
  members

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently, including UX and
   performance checks
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests (when present) fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break
  independence or violate UX/performance principles
