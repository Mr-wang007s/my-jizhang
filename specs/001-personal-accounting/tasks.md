# Tasks: Personal Accounting System

**Input**: Design documents from `/specs/001-personal-accounting/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/api-contracts.md, research.md, quickstart.md

**Tests**: Tests for critical flows (transaction CRUD, balance calculations, trend aggregation) are MANDATORY per constitution principles. Test coverage target: 80% for services, 100% for calculations.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story while preserving UX and performance requirements.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

Taro mini-program project structure:
- **Source**: `src/` (components, pages, services, store, utils)
- **Tests**: `__tests__/` (outside src for Jest)
- **Mocks**: `__mocks__/` (Taro API mocks)
- **Config**: `config/` (Taro build configuration)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure aligned with constitution principles

- [x] T001 Initialize Taro 4.x project with TypeScript and React template
- [x] T002 [P] Install core dependencies: zustand, dayjs, tailwindcss, postcss, autoprefixer
- [x] T003 [P] Install dev dependencies: jest, @testing-library/react, @testing-library/jest-dom, @tarojs/test-utils-react, ts-jest, @types/jest
- [x] T004 [P] Configure TailwindCSS in tailwind.config.js with custom colors (income: #34D399, expense: #EF4444, primary: #3B82F6)
- [x] T005 [P] Configure Taro build in config/index.ts with mini-program optimizations and TailwindCSS integration
- [x] T006 [P] Configure Jest in jest.config.js with ts-jest, jsdom environment, and module name mapping
- [x] T007 [P] Create Taro API mocks in __mocks__/taro.ts for testing (storage, cloud, navigation)
- [x] T008 [P] Setup project structure: create directories src/components, src/pages, src/services, src/store, src/utils, src/types, src/assets/icons, __tests__/services, __tests__/utils, __tests__/components
- [x] T009 Create global styles in src/app.scss with Tailwind imports
- [x] T010 [P] Configure WeChat mini-program project in project.config.json with environment ID placeholder
- [x] T011 [P] Create TypeScript configuration in tsconfig.json with strict mode enabled
- [x] T012 [P] Setup ESLint and Prettier configurations for code quality
- [x] T013 Add npm scripts to package.json: dev:weapp, build:weapp, dev:h5, build:h5, test, test:watch, test:coverage, lint

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T014 Define TypeScript types in src/types/index.ts: Transaction, Category, CreateTransactionInput, UpdateTransactionInput, CreateCategoryInput, UpdateCategoryInput, MonthlyBalance, CategoryBreakdown, TimeSeries
- [x] T015 [P] Create utility function for CNY currency formatting in src/utils/currency.ts using Intl.NumberFormat
- [x] T016 [P] Create date utility functions in src/utils/date.ts with dayjs wrappers for formatting, range calculations, month operations
- [x] T017 [P] Create validation utility functions in src/utils/validation.ts for amount, date, category validation
- [x] T018 [P] Write unit tests for currency formatting in __tests__/utils/currency.test.ts
- [x] T019 [P] Write unit tests for date utilities in __tests__/utils/date.test.ts
- [x] T020 [P] Write unit tests for validation utilities in __tests__/utils/validation.test.ts
- [x] T021 Initialize Zustand store in src/store/index.ts with persist middleware and Taro storage adapter
- [x] T022 Define store state interface: transactions, categories, balance, loading
- [x] T023 Define store actions: setTransactions, addTransaction, updateTransaction, deleteTransaction, setCategories, setLoading
- [x] T024 Configure app entry point in src/app.ts with WeChat Cloud initialization (conditional on TARO_ENV)
- [x] T025 Configure app pages and tab bar in src/app.config.ts: pages (index, transactions, add-transaction, trends, settings), tabBar with 4 tabs
- [x] T026 Create placeholder tab bar icons in src/assets/icons/ (home, list, chart, settings - both normal and active states)
- [x] T027 Create storage adapter abstraction for platform independence (WeChat Cloud DB vs local storage)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Record Income and Expenses (Priority: P1) 🎯 MVP

**Goal**: Enable users to create, view, edit, and delete transactions with amount, type, category, date, and optional note. Transactions display in chronological order with visual distinction between income and expense.

**Independent Test**: Create a new transaction (income or expense), save it, and verify it appears in the transaction list with correct formatting and order.

### Tests for User Story 1

> Write these tests FIRST, ensure they FAIL before implementation.

- [ ] T028 [P] [US1] Write integration test for TransactionService.create in __tests__/services/transaction.service.test.ts
- [ ] T029 [P] [US1] Write integration test for TransactionService.list with pagination in __tests__/services/transaction.service.test.ts
- [ ] T030 [P] [US1] Write integration test for TransactionService.update in __tests__/services/transaction.service.test.ts
- [ ] T031 [P] [US1] Write integration test for TransactionService.delete in __tests__/services/transaction.service.test.ts
- [ ] T032 [P] [US1] Write integration test for CategoryService.initializeDefaults in __tests__/services/category.service.test.ts
- [ ] T033 [P] [US1] Write integration test for CategoryService.list in __tests__/services/category.service.test.ts

### Implementation for User Story 1

#### Services Layer

- [ ] T034 [P] [US1] Implement CategoryService.initializeDefaults in src/services/category.service.ts with 12 default categories (工资, 奖金, 投资收益, 餐饮, 交通, 购物, 水电费, 娱乐, 医疗, 教育, 住房, 其他)
- [ ] T035 [P] [US1] Implement CategoryService.list in src/services/category.service.ts with type filtering and ordering
- [ ] T036 [P] [US1] Implement CategoryService.getById in src/services/category.service.ts
- [ ] T037 [US1] Implement TransactionService.create in src/services/transaction.service.ts with validation (positive amount, valid date range, category exists, 2 decimal places)
- [ ] T038 [US1] Implement TransactionService.list in src/services/transaction.service.ts with filters (type, categoryId, date range), sorting, pagination
- [ ] T039 [US1] Implement TransactionService.update in src/services/transaction.service.ts with validation
- [ ] T040 [US1] Implement TransactionService.delete in src/services/transaction.service.ts
- [ ] T041 [US1] Implement TransactionService.getById in src/services/transaction.service.ts

#### UI Components

- [ ] T042 [P] [US1] Create CategorySelector component in src/components/CategorySelector/index.tsx with icon, color display, and type filtering
- [ ] T043 [P] [US1] Create TransactionList component in src/components/TransactionList/index.tsx with virtualization for performance, visual distinction (green/red), CNY formatting
- [ ] T044 [US1] Create add-transaction page in src/pages/add-transaction/index.tsx with form (amount input, type selector, category selector, date picker, note textarea)
- [ ] T045 [US1] Add form validation to add-transaction page: amount > 0, max 2 decimals, date within allowed range, category required
- [ ] T046 [US1] Add error handling and success toast to add-transaction page
- [ ] T047 [US1] Create transactions list page in src/pages/transactions/index.tsx displaying TransactionList component with pull-to-refresh
- [ ] T048 [US1] Add edit transaction functionality: navigate to add-transaction page with pre-filled data, update on save
- [ ] T049 [US1] Add delete transaction functionality with confirmation dialog
- [ ] T050 [US1] Add filter controls to transactions page (type, category, date range)

#### Integration & Testing

- [ ] T051 [US1] Integrate TransactionService with Zustand store actions
- [ ] T052 [US1] Integrate CategoryService with Zustand store, initialize defaults on first app launch
- [ ] T053 [US1] Write component test for CategorySelector in __tests__/components/CategorySelector.test.tsx
- [ ] T054 [US1] Write component test for TransactionList in __tests__/components/TransactionList.test.tsx
- [ ] T055 [US1] Write component test for add-transaction page in __tests__/components/AddTransaction.test.tsx (validation, submission)
- [ ] T056 [US1] Verify UX consistency: Chinese terminology (账单, 分类, 收支), TailwindCSS color scheme, 44px tap targets, WCAG AA contrast
- [ ] T057 [US1] Performance check: transaction list with 1000+ items loads in < 2s, scroll at 60fps with virtualization

**Checkpoint**: User Story 1 is fully functional - users can create, view, edit, delete transactions with proper validation and performance.

---

## Phase 4: User Story 4 - View Balance Summary (Priority: P2)

**Goal**: Display total balance (all-time), current month income, current month expenses, and monthly balance on home dashboard with zero-state prompts.

**Independent Test**: Create test transactions spanning multiple months, verify home dashboard shows correct total balance and current month figures.

### Tests for User Story 4

- [ ] T058 [P] [US4] Write unit test for balance calculation logic in __tests__/services/balance.service.test.ts
- [ ] T059 [P] [US4] Write unit test for monthly balance calculation in __tests__/services/balance.service.test.ts
- [ ] T060 [P] [US4] Write integration test for BalanceService.getTotalBalance in __tests__/services/balance.service.test.ts

### Implementation for User Story 4

#### Services Layer

- [ ] T061 [P] [US4] Implement BalanceService.getTotalBalance in src/services/balance.service.ts (sum all income - all expenses)
- [ ] T062 [P] [US4] Implement BalanceService.getMonthlyBalance in src/services/balance.service.ts (current month income, expense, balance)
- [ ] T063 [P] [US4] Implement BalanceService.getCurrentMonthBalance in src/services/balance.service.ts (convenience method)
- [ ] T064 [US4] Add caching strategy to BalanceService with 1-minute TTL, invalidate on transaction CRUD

#### UI Components

- [ ] T065 [P] [US4] Create BalanceCard component in src/components/BalanceCard/index.tsx displaying balance with CNY formatting, visual indicators (green/red)
- [ ] T066 [US4] Create home page (index) in src/pages/index/index.tsx with BalanceCard for total balance, monthly income, monthly expense, monthly balance
- [ ] T067 [US4] Add zero-state UI to home page when no transactions exist (helpful prompts to start recording)
- [ ] T068 [US4] Add pull-to-refresh to home page to reload balance data

#### Integration & Testing

- [ ] T069 [US4] Integrate BalanceService with Zustand store
- [ ] T070 [US4] Update store to trigger balance recalculation on transaction add/update/delete
- [ ] T071 [US4] Write component test for BalanceCard in __tests__/components/BalanceCard.test.tsx
- [ ] T072 [US4] Write component test for home page in __tests__/components/Index.test.tsx (balance display, zero state)
- [ ] T073 [US4] Verify UX consistency: Balance terminology clear, color coding consistent, layout matches design
- [ ] T074 [US4] Performance check: balance calculations complete in < 200ms for 1000+ transactions

**Checkpoint**: User Story 4 is functional - home dashboard displays accurate balance summary with proper formatting and performance.

---

## Phase 5: User Story 2 - View Spending Trends (Priority: P2)

**Goal**: Visualize spending patterns with category breakdown (pie chart) and income vs. expense trends over time (line/bar charts) for selected date ranges.

**Independent Test**: Pre-populate transactions for multiple months, verify trends page shows accurate category breakdown and time series charts.

### Tests for User Story 2

- [ ] T075 [P] [US2] Write unit test for category breakdown aggregation logic in __tests__/services/trend.service.test.ts
- [ ] T076 [P] [US2] Write unit test for time series aggregation logic in __tests__/services/trend.service.test.ts
- [ ] T077 [P] [US2] Write integration test for TrendService.getCategoryBreakdown in __tests__/services/trend.service.test.ts
- [ ] T078 [P] [US2] Write integration test for TrendService.getTimeSeries in __tests__/services/trend.service.test.ts

### Implementation for User Story 2

#### Services Layer

- [ ] T079 [P] [US2] Implement TrendService.getCategoryBreakdown in src/services/trend.service.ts (aggregate by category with totals, percentages, transaction counts)
- [ ] T080 [P] [US2] Implement TrendService.getTimeSeries in src/services/trend.service.ts (aggregate by time period: day, week, month, year)
- [ ] T081 [P] [US2] Implement TrendService.getTopCategories in src/services/trend.service.ts (top N categories by spending/income)
- [ ] T082 [US2] Add caching strategy to TrendService for expensive aggregations

#### ECharts Integration

- [ ] T083 [US2] Download echarts-for-weixin from GitHub and integrate ec-canvas component into src/components/ec-canvas/
- [ ] T084 [US2] Create custom ECharts build at https://echarts.apache.org/builder.html with only line, bar, pie charts (target < 400KB)
- [ ] T085 [US2] Replace ec-canvas/echarts.js with custom build
- [ ] T086 [US2] Fix Taro compatibility issues in ec-canvas (optional chaining for addEventListener)

#### UI Components

- [ ] T087 [P] [US2] Create TrendChart component in src/components/TrendChart/index.tsx wrapping ec-canvas with responsive sizing
- [ ] T088 [US2] Create trends page in src/pages/trends/index.tsx with date range selector (current month, last 3 months, last 6 months, current year, custom)
- [ ] T089 [US2] Add category breakdown pie chart to trends page showing expense distribution
- [ ] T090 [US2] Add income vs. expense line/bar chart to trends page showing monthly trends
- [ ] T091 [US2] Add drill-down functionality: tapping category in chart shows transaction list filtered by that category
- [ ] T092 [US2] Add loading states and error handling for chart rendering

#### Integration & Testing

- [ ] T093 [US2] Integrate TrendService with Zustand store
- [ ] T094 [US2] Write component test for TrendChart in __tests__/components/TrendChart.test.tsx
- [ ] T095 [US2] Write component test for trends page in __tests__/components/Trends.test.tsx (chart rendering, date range filtering)
- [ ] T096 [US2] Verify UX consistency: chart colors match design system, Chinese labels, accessible tap targets
- [ ] T097 [US2] Performance check: trend charts render in < 3s for 12 months of data, bundle size < 400KB for ECharts

**Checkpoint**: User Story 2 is functional - users can visualize spending patterns with interactive charts and date range filtering.

---

## Phase 6: User Story 3 - Manage Transaction Categories (Priority: P3)

**Goal**: Allow users to create custom categories with name, icon, color, and type. Support editing category names and deleting categories with transaction reassignment.

**Independent Test**: Create a custom category, use it in a transaction, verify it appears in category list and trend analysis. Edit and delete categories with proper validation.

### Tests for User Story 3

- [ ] T098 [P] [US3] Write integration test for CategoryService.create in __tests__/services/category.service.test.ts (validation, uniqueness)
- [ ] T099 [P] [US3] Write integration test for CategoryService.update in __tests__/services/category.service.test.ts
- [ ] T100 [P] [US3] Write integration test for CategoryService.delete in __tests__/services/category.service.test.ts (with transaction reassignment)

### Implementation for User Story 3

#### Services Layer

- [ ] T101 [P] [US3] Implement CategoryService.create in src/services/category.service.ts with validation (unique name, max 20 chars, valid color hex)
- [ ] T102 [P] [US3] Implement CategoryService.update in src/services/category.service.ts with validation (cannot change isDefault or type)
- [ ] T103 [US3] Implement CategoryService.delete in src/services/category.service.ts with transaction reassignment logic (prompt for target category)
- [ ] T104 [US3] Add validation to prevent deleting default categories (isDefault = true)

#### UI Components

- [ ] T105 [P] [US3] Create category management page in src/pages/settings/categories/index.tsx listing all categories with edit/delete actions
- [ ] T106 [US3] Create add/edit category form in src/pages/settings/categories/form/index.tsx with name input, icon picker (emoji), color picker, type selector
- [ ] T107 [US3] Add form validation to category form: name required, max 20 chars, unique name, valid hex color
- [ ] T108 [US3] Implement delete category flow with confirmation dialog and reassignment category selector
- [ ] T109 [US3] Add visual distinction for default vs. custom categories in category list
- [ ] T110 [US3] Link category management from settings page

#### Integration & Testing

- [ ] T111 [US3] Integrate CategoryService CRUD with Zustand store
- [ ] T112 [US3] Update CategorySelector component to show custom categories alongside defaults
- [ ] T113 [US3] Update trend charts to include custom categories in aggregations
- [ ] T114 [US3] Write component test for category form in __tests__/components/CategoryForm.test.tsx
- [ ] T115 [US3] Write component test for category list in __tests__/components/CategoryList.test.tsx
- [ ] T116 [US3] Verify UX consistency: category management follows app design patterns, clear error messages
- [ ] T117 [US3] Performance check: category list loads instantly, CRUD operations < 200ms

**Checkpoint**: User Story 3 is functional - users can create, edit, delete custom categories with proper validation and transaction reassignment.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final production readiness

- [ ] T118 [P] Add app loading screen and splash page for WeChat mini-program
- [ ] T119 [P] Implement global error boundary for React component errors
- [ ] T120 [P] Add error logging and reporting mechanism (console for dev, cloud logging for production)
- [ ] T121 [P] Optimize bundle size: enable Taro code splitting, lazy load ECharts, minimize vendor chunks
- [ ] T122 [P] Add performance monitoring: log database query times, chart render times, page load times
- [ ] T123 Setup WeChat Cloud Database indexes on transactions collection: date (desc), categoryId, type
- [ ] T124 Add data export functionality to settings page (export transactions to CSV with Chinese headers)
- [ ] T125 Add app settings page in src/pages/settings/index.tsx with links to category management, data export, about
- [ ] T126 Create about page in src/pages/settings/about/index.tsx with app version, developer info, privacy policy
- [ ] T127 Add pull-to-refresh to all list pages for data synchronization
- [ ] T128 Implement offline support: queue transactions when offline, sync when online (if using WeChat Cloud DB)
- [ ] T129 Add onboarding guide for first-time users explaining how to record transactions
- [ ] T130 Run full test suite and ensure 80%+ coverage: npm run test:coverage
- [ ] T131 Run linter and fix all issues: npm run lint
- [ ] T132 Manual UX review: verify all Chinese terminology, consistent navigation, accessible tap targets, WCAG AA contrast
- [ ] T133 Manual performance review: test with 1000+ transactions, verify all budgets met (app launch < 2s, list scroll 60fps, charts < 3s, CRUD < 200ms)
- [ ] T134 Test on WeChat DevTools simulator and real device (iOS/Android)
- [ ] T135 Build production WeChat mini-program: npm run build:weapp
- [ ] T136 Upload to WeChat for review with test account and usage instructions
- [ ] T137 [P] Update README.md with project overview, setup instructions, tech stack
- [ ] T138 [P] Document deployment process in docs/DEPLOYMENT.md
- [ ] T139 [P] Create developer guide in docs/DEVELOPMENT.md with contribution guidelines

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 (P1): Can start after Foundational - No dependencies on other stories
  - US4 (P2): Can start after Foundational - Depends on TransactionService from US1 for balance calculations
  - US2 (P2): Can start after Foundational - Depends on TransactionService and CategoryService from US1 for trend aggregations
  - US3 (P3): Can start after Foundational - Depends on CategoryService from US1, integrates with US1 and US2
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Foundation only - Independently testable ✅
  - Deliverable: Create, view, edit, delete transactions with categories
  
- **User Story 4 (P2)**: Foundation + US1 services (TransactionService)
  - Independently testable by creating test transactions ✅
  - Deliverable: Balance summary dashboard
  
- **User Story 2 (P2)**: Foundation + US1 services (TransactionService, CategoryService)
  - Independently testable with pre-populated transactions ✅
  - Deliverable: Trend visualization with charts
  
- **User Story 3 (P3)**: Foundation + US1 services (CategoryService) + integrates with US1 UI and US2 charts
  - Independently testable by creating custom categories ✅
  - Deliverable: Custom category management

### Within Each User Story

1. Tests FIRST (write tests that FAIL)
2. Services (data access layer)
3. Components (UI components)
4. Pages (integrate components)
5. Integration (wire to store, connect to other stories if needed)
6. UX/Performance validation

### Parallel Opportunities

**Setup Phase**:
- T002-T007, T012 (dependencies installation and configs) can run in parallel
- T008 (directory creation) must precede file creation

**Foundational Phase**:
- T015-T017 (utils) can run in parallel
- T018-T020 (util tests) can run in parallel after utils
- T026 (icons) can run in parallel

**User Story 1**:
- T028-T033 (tests) can run in parallel
- T034-T036 (CategoryService) can run in parallel
- T037-T041 (TransactionService) must run sequentially (depends on validation)
- T042-T043 (components) can run in parallel after services

**User Story 4**:
- T058-T060 (tests) can run in parallel
- T061-T063 (BalanceService methods) can run in parallel

**User Story 2**:
- T075-T078 (tests) can run in parallel
- T079-T081 (TrendService methods) can run in parallel
- T087 (TrendChart component) can run in parallel with services

**User Story 3**:
- T098-T100 (tests) can run in parallel
- T101-T103 (CategoryService CRUD) can run in parallel

**Polish Phase**:
- T118-T122, T137-T139 (documentation and monitoring) can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 4)

**Recommended MVP Scope**:
1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Record transactions - P1)
4. Complete Phase 4: User Story 4 (View balance - P2)
5. **STOP and VALIDATE**: Test both stories independently
   - Can create/edit/delete transactions ✅
   - Balance summary displays correctly ✅
   - Performance budgets met ✅
   - UX consistency verified ✅
6. Deploy/demo MVP to WeChat mini-program

**MVP Value**: Users can track income/expenses and see their financial status - core value proposition delivered.

### Incremental Delivery

**Release 1 (MVP)**: Setup + Foundational + US1 + US4
- Core accounting functionality
- ~60% of total value

**Release 2**: Add US2 (Trends)
- Adds analytical insights
- ~85% of total value

**Release 3**: Add US3 (Custom categories)
- Adds personalization
- 100% of planned value

**Release 4**: Polish phase
- Production-ready quality
- Export, offline support, performance optimizations

### Parallel Team Strategy

With 2-3 developers:

**Week 1**:
- All: Complete Setup + Foundational together

**Week 2-3**:
- Developer A: User Story 1 (transactions)
- Developer B: User Story 4 (balance) - can start services in parallel, integrates after US1 services done

**Week 4**:
- Developer A: User Story 2 (trends)
- Developer B: User Story 3 (categories)

**Week 5**:
- All: Polish phase together

---

## Task Summary

**Total Tasks**: 139

**By Phase**:
- Setup: 13 tasks
- Foundational: 14 tasks
- User Story 1 (P1): 30 tasks
- User Story 4 (P2): 17 tasks
- User Story 2 (P2): 23 tasks
- User Story 3 (P3): 20 tasks
- Polish: 22 tasks

**By Story**:
- US1 (Record transactions): 30 tasks
- US2 (View trends): 23 tasks
- US3 (Manage categories): 20 tasks
- US4 (View balance): 17 tasks
- Infrastructure: 27 tasks
- Polish: 22 tasks

**Parallel Opportunities**: 47 tasks marked [P] can run in parallel within their phase

**Test Coverage**: 24 test tasks ensuring 80%+ coverage for services, 100% for calculations

**MVP Scope**: 74 tasks (Setup + Foundational + US1 + US4) = ~53% of total tasks, delivers core value

---

## Format Validation

✅ All tasks follow checklist format: `- [ ] [ID] [P?] [Story] Description with file path`
✅ All tasks have sequential IDs (T001-T139)
✅ All user story tasks have [US1], [US2], [US3], or [US4] labels
✅ All parallelizable tasks have [P] marker
✅ All tasks include specific file paths or clear action items
✅ Tests are included for all user stories per constitution requirements
✅ Each user story has independent test criteria
✅ Dependencies and execution order clearly documented

**Tasks are immediately executable** - each task is specific enough for implementation without additional context.
