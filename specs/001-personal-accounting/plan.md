# Implementation Plan: Personal Accounting System

**Branch**: `001-personal-accounting` | **Date**: 2025-11-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-personal-accounting/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a personal accounting system using Taro (latest version) with TailwindCSS for UI styling and SQLite for local data persistence. The system enables users to record income and expenses, categorize transactions, and visualize spending trends. Core features include transaction management, balance summaries, and trend analysis with support for Chinese Yuan (CNY) currency formatting.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript with Taro 4.x  
**Primary Dependencies**: Taro, React, TailwindCSS, Zustand (state management), dayjs (date handling), ECharts (charts)  
**Storage**: WeChat Cloud Database (primary) or local storage with `wx.setStorage` (10MB limit)  
**Testing**: Jest + @testing-library/react + @tarojs/test-utils-react  
**Target Platform**: WeChat Mini-Program (primary), H5 web (secondary)
**Project Type**: Mini-program / Cross-platform mobile  
**Performance Goals**: App launch < 2s, transaction list scroll at 60fps, trend chart render < 3s for 12 months data  
**Constraints**: <200ms for transaction CRUD operations, <400KB for chart library bundle  
**Scale/Scope**: Single-user daily use, support 1000+ transactions without performance degradation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ **Code Quality**: 
  - Complexity areas: SQLite schema design, trend aggregation logic, date/time handling
  - Mitigation: Single-responsibility modules (separate data access, business logic, UI), TypeScript strict mode, clear naming conventions
  - Structure: Taro components follow atomic design (atoms/molecules/organisms), services layer abstracts DB operations

- ✅ **Testing**: 
  - Unit tests: Transaction validation, balance calculations, date range filters, category management logic
  - Integration tests: SQLite CRUD operations, transaction-category relationships, data migration scenarios
  - E2E tests: Critical flows - add transaction, view balance summary, generate trend chart, edit/delete transaction
  - Coverage target: 80% for services layer, 100% for calculation logic

- ✅ **UX Consistency**: 
  - Chinese terminology: "账单" (transactions), "分类" (categories), "收支" (income/expense), "趋势" (trends)
  - TailwindCSS ensures consistent spacing, typography, and color scheme
  - Navigation: Bottom tab bar (Home/Transactions/Trends/Settings), standard back navigation
  - Visual distinction: Green for income, red for expenses (culturally appropriate for Chinese users)
  - Accessibility: Minimum 44px tap targets, sufficient color contrast (WCAG AA)

- ✅ **Performance**: 
  - Sensitive flows: Transaction list rendering (virtualization for 1000+ items), trend chart generation (aggregation queries), app launch (lazy-load non-critical data)
  - Mitigation: SQLite indexes on date and category columns, React.memo for list items, debounced search/filter, chart library with canvas rendering
  - Monitoring: Basic performance logging for database query times, render times for critical components

**No deviations from constitution principles identified.**

---

### Post-Design Re-evaluation

After completing Phase 0 (research) and Phase 1 (design), re-checking constitution compliance:

- ✅ **Code Quality** (Validated):
  - Data model defined with clear entities and relationships (data-model.md)
  - Service contracts specify single-responsibility interfaces (api-contracts.md)
  - TypeScript types defined for all entities and DTOs
  - Clear separation: Services (data access) → Store (state) → Components (UI)
  - No complex abstractions introduced - straightforward CRUD + aggregations

- ✅ **Testing** (Validated):
  - Testing stack decided: Jest + @testing-library/react + @tarojs/test-utils-react
  - Test structure planned: Unit (utils, services), Integration (storage), E2E (user flows)
  - Mock strategy defined for Taro APIs and WeChat Cloud DB
  - Coverage targets specified: 80% services, 100% calculations
  - Critical paths identified and mapped to test scenarios

- ✅ **UX Consistency** (Validated):
  - Terminology documented in data model and quickstart
  - TailwindCSS config specifies color scheme (income: green #34D399, expense: red #EF4444)
  - Navigation structure defined in app.config (4 tabs: Home, Transactions, Trends, Settings)
  - Accessibility considerations documented (44px tap targets, WCAG AA contrast)
  - Platform-specific adaptations handled via Taro abstractions

- ✅ **Performance** (Validated):
  - Database indexes specified: date (desc), categoryId, type
  - Query patterns optimized: pagination (20-50 records), date range filters
  - Caching strategy defined for balance summaries and trend data
  - Chart library optimized: Custom ECharts build <400KB (only line/bar/pie)
  - Bundle size considerations: Code splitting for vendors and ECharts

**Final Assessment**: All constitution principles satisfied. Design is production-ready.

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

```text
# Taro Mini-Program Project Structure
config/
├── index.ts            # Taro build configuration
├── dev.ts              # Development environment config
└── prod.ts             # Production environment config

src/
├── app.ts              # App entry point
├── app.scss            # Global styles (Tailwind imports)
├── app.config.ts       # App configuration (pages, tabBar, window)
├── assets/             # Static assets
│   └── icons/          # Tab bar icons
├── components/         # Reusable UI components
│   ├── TransactionList/
│   ├── CategorySelector/
│   ├── BalanceCard/
│   ├── TrendChart/
│   └── ec-canvas/      # ECharts mini-program component
├── pages/              # Page components
│   ├── index/          # Home - Balance summary dashboard
│   ├── transactions/   # Transaction list with filters
│   ├── add-transaction/ # Add/edit transaction form
│   ├── trends/         # Trend visualization (charts)
│   └── settings/       # App settings
├── services/           # Data access layer (API contracts)
│   ├── transaction.service.ts
│   ├── category.service.ts
│   ├── balance.service.ts
│   └── trend.service.ts
├── store/              # Zustand state management
│   └── index.ts        # Global app state
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared types
└── utils/              # Utility functions
    ├── currency.ts     # CNY formatting
    ├── date.ts         # Date helpers (dayjs wrappers)
    └── validation.ts   # Input validation

__tests__/              # Tests (outside src for Jest)
├── services/           # Service integration tests
├── utils/              # Utility unit tests
└── components/         # Component tests

__mocks__/              # Mock implementations
└── taro.ts             # Taro API mocks for testing

dist/                   # Build output (gitignored)
├── weapp/              # WeChat mini-program build
└── h5/                 # H5 web build

project.config.json     # WeChat mini-program project config
package.json
tsconfig.json
tailwind.config.js
jest.config.js
```

**Structure Decision**: 

This is a **Taro cross-platform mini-program** project targeting WeChat Mini-Program (primary) and H5 web (secondary). The structure follows Taro conventions with clear separation of concerns:

- **Pages**: Each page is a self-contained directory with component, config, and styles
- **Components**: Atomic, reusable UI components shared across pages
- **Services**: Data access layer implementing API contracts (see contracts/api-contracts.md)
- **Store**: Zustand global state for transactions, categories, and derived data
- **Utils**: Pure functions for formatting, validation, date operations

**Key Design Choices**:
1. Services abstract storage mechanism (WeChat Cloud DB vs local storage)
2. Components are platform-agnostic (work in both WeChat and H5)
3. Tests live outside `src/` to avoid bundling in production
4. ECharts integration via `ec-canvas` component for charts

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
