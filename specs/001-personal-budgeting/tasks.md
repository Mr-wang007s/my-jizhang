---
description: "Task list for personal budgeting feature implementation"
---

# Tasks: 个人记账与消费趋势统计

**Input**: Design documents from `/specs/001-personal-budgeting/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests are included for critical flows as specified in the constitution requirements for code quality and UX consistency.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story while preserving UX and performance requirements.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md, this project uses a single Taro application structure:
- `src/` - Source code at repository root
- `tests/` - Test files at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure aligned with constitution principles

- [X] T001 Create project structure per implementation plan (src/pages/, src/components/, src/services/, src/storage/, src/styles/)
- [X] T002 Initialize Taro + TypeScript project with React, Tailwind CSS, and SQLite dependencies
- [X] T003 [P] Configure ESLint, Prettier, and Jest + React Testing Library for testing
- [X] T004 [P] Setup Tailwind CSS configuration in src/styles/tailwind.config.js
- [X] T005 [P] Create .gitignore with Node.js, build artifacts, and environment files

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Setup SQLite database schema and migrations for Transaction, Category, and Metadata tables in src/storage/schema.ts
- [X] T007 [P] Create database connection wrapper and query builder utilities in src/storage/database.ts
- [X] T008 [P] Implement Category repository with CRUD operations in src/storage/repositories/category.repository.ts
- [X] T009 [P] Seed initial categories (工资, 餐饮, 交通, etc.) in src/storage/seed-data.ts
- [X] T010 [P] Create base error handling utilities in src/utils/error-handler.ts
- [X] T011 [P] Setup date/time utility functions for ISO 8601 formatting in src/utils/date-utils.ts
- [X] T012 [P] Create shared UI components: Button, Input, DatePicker in src/components/common/
- [X] T013 [P] Create shared layout component with navigation in src/components/layout/MainLayout.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 快速记录日常收支 (Priority: P1) 🎯 MVP

**Goal**: 用户可以快速记录收入和支出，并在列表中看到新增的记录

**Independent Test**: 打开应用 → 记录一笔支出 → 在列表顶部看到该记录（验证金额、类型、日期、分类一致）

### Tests for User Story 1

> Write these tests FIRST, ensure they FAIL before implementation.

- [ ] T014 [P] [US1] Write unit test for Transaction model validation in tests/unit/models/transaction.test.ts
- [ ] T015 [P] [US1] Write unit test for TransactionService.createTransaction in tests/unit/services/transaction-service.test.ts
- [ ] T016 [P] [US1] Write integration test for transaction creation flow in tests/integration/transaction-creation.test.ts

### Implementation for User Story 1

- [ ] T017 [P] [US1] Create Transaction entity interface in src/models/Transaction.ts
- [ ] T018 [P] [US1] Implement Transaction repository with create and list methods in src/storage/repositories/transaction.repository.ts
- [ ] T019 [US1] Implement TransactionService with createTransaction and listTransactions methods in src/services/transaction.service.ts
- [ ] T020 [US1] Create transaction form component with amount, type, date, category, note fields in src/components/transaction/TransactionForm.tsx
- [ ] T021 [US1] Create transaction list item component in src/components/transaction/TransactionItem.tsx
- [ ] T022 [US1] Create transaction list component with date descending sort in src/components/transaction/TransactionList.tsx
- [ ] T023 [US1] Implement home page with "记一笔" button and recent transaction list in src/pages/index/index.tsx
- [ ] T024 [US1] Implement transaction creation page with form and validation in src/pages/transaction/create.tsx
- [ ] T025 [US1] Add form validation (amount >= 0, required fields) and error messages in src/utils/validation.ts
- [ ] T026 [US1] Add success feedback after transaction creation and navigation to list
- [ ] T027 [US1] Verify UX consistency (button styles, form layout, navigation flow)
- [ ] T028 [US1] Check performance: transaction creation should complete within 500ms

**Checkpoint**: At this point, User Story 1 should be fully functional, tested, and aligned with UX/performance principles. User can record a transaction and see it in the list.

---

## Phase 4: User Story 2 - 查看账单列表与汇总 (Priority: P2)

**Goal**: 用户可以按时间范围筛选账单，并查看总收入、总支出和结余

**Independent Test**: 打开账单页面 → 选择"本月"时间范围 → 看到本月记录和汇总 → 切换到自定义范围 → 看到更新后的数据

### Tests for User Story 2

- [ ] T029 [P] [US2] Write unit test for AnalyticsService.getSummary in tests/unit/services/analytics-service.test.ts
- [ ] T030 [P] [US2] Write integration test for time range filtering in tests/integration/bill-filtering.test.ts

### Implementation for User Story 2

- [ ] T031 [P] [US2] Add time range filter methods to Transaction repository in src/storage/repositories/transaction.repository.ts
- [ ] T032 [US2] Implement AnalyticsService with getSummary method in src/services/analytics.service.ts
- [ ] T033 [US2] Create time range selector component (本月, 近30天, 自定义) in src/components/filters/TimeRangeSelector.tsx
- [ ] T034 [US2] Create income/expense type filter component in src/components/filters/TypeFilter.tsx
- [ ] T035 [US2] Create summary card component showing total income, expense, balance in src/components/analytics/SummaryCard.tsx
- [ ] T036 [US2] Implement bills page with filters and transaction list in src/pages/bills/index.tsx
- [ ] T037 [US2] Connect filters to transaction list and summary updates
- [ ] T038 [US2] Add empty state display when no records in selected time range
- [ ] T039 [US2] Verify UX consistency (filter UI, summary layout, list behavior)
- [ ] T040 [US2] Check performance: list refresh with 1000 records should complete within 2 seconds (SC-002)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. User can filter transactions and see summaries.

---

## Phase 5: User Story 3 - 查看消费趋势统计 (Priority: P3)

**Goal**: 用户可以查看按月的支出趋势和按分类的支出分布

**Independent Test**: 打开趋势页面 → 看到近3个月的支出趋势图 → 切换到分类分布视图 → 看到各分类占比

### Tests for User Story 3

- [ ] T041 [P] [US3] Write unit test for AnalyticsService.getExpenseTrendByMonth in tests/unit/services/analytics-service.test.ts
- [ ] T042 [P] [US3] Write unit test for AnalyticsService.getExpenseDistributionByCategory in tests/unit/services/analytics-service.test.ts

### Implementation for User Story 3

- [ ] T043 [P] [US3] Add monthly aggregation query to Transaction repository in src/storage/repositories/transaction.repository.ts
- [ ] T044 [P] [US3] Add category distribution query to Transaction repository in src/storage/repositories/transaction.repository.ts
- [ ] T045 [US3] Implement getExpenseTrendByMonth in AnalyticsService in src/services/analytics.service.ts
- [ ] T046 [US3] Implement getExpenseDistributionByCategory in AnalyticsService in src/services/analytics.service.ts
- [ ] T047 [US3] Create monthly trend chart component (line or bar chart) in src/components/charts/MonthlyTrendChart.tsx
- [ ] T048 [US3] Create category distribution chart component (pie or bar chart) in src/components/charts/CategoryDistributionChart.tsx
- [ ] T049 [US3] Implement analytics page with trend and distribution views in src/pages/analytics/index.tsx
- [ ] T050 [US3] Add view switcher between trend and distribution
- [ ] T051 [US3] Add empty state display when insufficient data for trends
- [ ] T052 [US3] Verify UX consistency (chart colors, legend, navigation)
- [ ] T053 [US3] Check performance: trend calculation for 1000 records should complete within 2 seconds

**Checkpoint**: All user stories should now be independently functional and respect core principles. User can view consumption trends and patterns.

---

## Phase 6: Additional Functionality - 编辑和删除记账

**Goal**: 用户可以编辑和删除已有的记账记录

**Independent Test**: 打开账单列表 → 点击某条记录 → 编辑金额或分类 → 保存 → 看到列表和汇总更新 → 删除记录 → 确认记录消失

### Tests for Edit/Delete

- [ ] T054 [P] Write unit test for TransactionService.updateTransaction in tests/unit/services/transaction-service.test.ts
- [ ] T055 [P] Write unit test for TransactionService.deleteTransaction in tests/unit/services/transaction-service.test.ts

### Implementation for Edit/Delete

- [ ] T056 [P] Add update and delete methods to Transaction repository in src/storage/repositories/transaction.repository.ts
- [ ] T057 Implement updateTransaction and deleteTransaction in TransactionService in src/services/transaction.service.ts
- [ ] T058 Create transaction detail page with edit and delete actions in src/pages/transaction/detail.tsx
- [ ] T059 Create transaction edit page reusing TransactionForm component in src/pages/transaction/edit.tsx
- [ ] T060 Add confirmation dialog for delete action in src/components/common/ConfirmDialog.tsx
- [ ] T061 Update transaction list to link to detail page
- [ ] T062 Ensure list and summary refresh after edit/delete operations
- [ ] T063 Verify UX consistency (edit flow, delete confirmation, feedback)

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T064 [P] Add loading states and spinners for async operations in src/components/common/Loading.tsx
- [ ] T065 [P] Add error boundaries for graceful error handling in src/components/common/ErrorBoundary.tsx
- [ ] T066 [P] Implement toast notifications for user feedback in src/components/common/Toast.tsx
- [ ] T067 [P] Add indexes to Transaction table (date, type, category_id) for query performance
- [ ] T068 [P] Add input sanitization and XSS protection in form components
- [ ] T069 Code cleanup and refactoring to improve maintainability
- [ ] T070 [P] Add edge case handling: zero amounts, extreme values, no data states
- [ ] T071 [P] Performance optimization: implement query result caching in services
- [ ] T072 [P] Add accessibility attributes (ARIA labels, keyboard navigation)
- [ ] T073 Run quickstart.md validation: test all user flows from guide
- [ ] T074 [P] Update CODEBUDDY.md with final tech stack and structure
- [ ] T075 Final UX review: consistent terminology, navigation, visual styles

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Uses Transaction repository from US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Uses Transaction repository from US1 but should be independently testable
- **Edit/Delete (Phase 6)**: Can start after User Story 1 (depends on Transaction model and service)

### Within Each User Story

- Tests SHOULD be written and FAIL before implementation
- Models/Repositories before services
- Services before UI components
- Components before pages
- Core implementation before integration
- Story complete (including tests and UX/performance checks) before moving to next priority

### Parallel Opportunities

**Setup Phase**:
- T003 (linting/testing), T004 (Tailwind), T005 (gitignore) can run in parallel

**Foundational Phase**:
- T007-T013 can run in parallel after T006 (schema) completes

**User Story 1**:
- T014, T015, T016 (tests) can run in parallel
- T017, T018 (model/repository) can run in parallel after tests
- T020, T021, T022 (components) can run in parallel after T019 (service)

**User Story 2**:
- T029, T030 (tests) can run in parallel
- T033, T034, T035 (components) can run in parallel after T032 (service)

**User Story 3**:
- T041, T042 (tests) can run in parallel
- T043, T044 (queries) can run in parallel
- T047, T048 (charts) can run in parallel after T045-T046 (services)

**Edit/Delete**:
- T054, T055 (tests) can run in parallel
- T056 (repository) before T057 (service)

**Polish Phase**:
- T064-T068, T070-T072, T074 can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently (can record transaction, see in list, within 30 seconds per SC-001)
5. Demo/validate with users

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Demo (MVP: basic recording)
3. Add User Story 2 → Test independently → Demo (can now filter and see summaries)
4. Add User Story 3 → Test independently → Demo (can now see trends)
5. Add Edit/Delete → Test independently → Demo (full CRUD capability)
6. Add Polish → Final validation → Release

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (record transactions)
   - Developer B: User Story 2 (filtering and summaries) - can start in parallel
   - Developer C: User Story 3 (trends and charts) - can start in parallel
3. Stories complete and integrate independently
4. Team combines for Edit/Delete and Polish phases

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD approach per constitution)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Performance targets: SC-001 (30s to record), SC-002 (2s for list refresh with 1000 records)
- Test coverage targets: SC-004 (all main paths tested before release)
- User satisfaction target: SC-005 (80% users find it simple and clear)
