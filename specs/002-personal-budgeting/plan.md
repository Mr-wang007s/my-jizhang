# Implementation Plan: Personal Expense Tracking

**Branch**: `002-personal-budgeting` | **Date**: 2025-11-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-personal-budgeting/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Building a personal expense tracking application that allows users to record income and expenses, view transaction history, analyze spending trends, and manage custom categories. The system uses Taro (latest version) for cross-platform mobile development, Tailwind CSS for styling, and local SQLite database for data persistence. The application prioritizes offline-first functionality with fast performance for daily financial tracking.

## Technical Context

**Language/Version**: TypeScript + Taro (latest stable version)  
**Primary Dependencies**: Taro (React-based), Tailwind CSS, SQLite (via Taro-compatible plugin or @tarojs/plugin-platform-*), React Hooks  
**Storage**: Local SQLite database for all transaction data, categories, and aggregated statistics  
**Testing**: Jest + Taro Testing Library (for component/integration tests), SQLite in-memory for database tests  
**Target Platform**: Cross-platform mobile (WeChat Mini Program, Alipay Mini Program, H5, React Native via Taro)
**Project Type**: Mobile application (single codebase targeting multiple platforms)  
**Performance Goals**: App launch < 2s, transaction list rendering (1000 items) < 1s, trend calculations (12 months) < 2s, smooth 60fps scrolling  
**Constraints**: < 300ms p95 for transaction CRUD operations, minimal SQLite query overhead, efficient chart rendering for trends  
**Scale/Scope**: Personal daily use, supporting 5000+ transactions, dozens of categories, multi-year data retention

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **Code Quality**: 
- Small, focused modules: Transaction logic separated into services, UI components isolated, database layer abstracted
- Clear naming: Entity-based naming (TransactionService, CategoryModel, StatisticsCalculator)
- Single responsibility: Each component handles one concern (e.g., TransactionForm, TransactionList, CategoryPicker)
- Static analysis: TypeScript strict mode, ESLint for Taro/React best practices

✅ **Testing**:
- **Unit tests**: Database models (CRUD operations), calculation services (totals, percentages, trends)
- **Integration tests**: Transaction flow (create → save → retrieve → display), category management with cascading updates
- **E2E tests**: Critical paths: P1 (record transaction), P2 (view history with filters), P3 (view trends)
- **Test command**: `npm test` (Jest + Taro Testing Library)
- **Coverage target**: >80% for services and database layer

✅ **UX Consistency**:
- Navigation: Tab-based navigation (Home/Transactions/Statistics/Settings)
- Terminology: Consistent Chinese terms (账单=transaction, 分类=category, 收入=income, 支出=expense)
- Visual hierarchy: Tailwind CSS utility classes for consistent spacing, typography, colors
- Design patterns: Form validation feedback, loading states, empty states, error messages
- Accessibility: Minimum 44px tap targets, sufficient color contrast, semantic HTML

✅ **Performance**:
- **Performance-sensitive flows**:
  1. Transaction list rendering: Virtual scrolling for 1000+ items, pagination/infinite scroll
  2. SQLite queries: Indexed columns (date, category_id), prepared statements, query optimization
  3. Statistics calculation: Cached aggregations, incremental updates on transaction changes
  4. Chart rendering: Lazy loading, data sampling for long time ranges
- **Mitigation strategies**:
  - Database: Indexes on frequently queried columns, batch operations
  - UI: React.memo for list items, debounced filters, optimistic UI updates
  - Bundle: Code splitting by route, lazy loading for statistics/charts

**No deviations planned** - all principles align with feature requirements.

## Project Structure

### Documentation (this feature)

```text
specs/002-personal-budgeting/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── database-schema.sql  # SQLite schema definitions
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── models/               # Database models and SQLite operations
│   ├── database.ts       # SQLite connection and initialization
│   ├── transaction.ts    # Transaction model (CRUD)
│   ├── category.ts       # Category model (CRUD)
│   └── statistics.ts     # Aggregation queries and calculations
├── services/            # Business logic services
│   ├── transaction-service.ts  # Transaction operations and validation
│   ├── category-service.ts     # Category management logic
│   └── statistics-service.ts   # Trend calculation and analytics
├── pages/               # Taro page components
│   ├── index/           # Home/Dashboard page
│   ├── transactions/    # Transaction list and detail pages
│   │   ├── index.tsx    # Transaction history list
│   │   ├── add.tsx      # Add/edit transaction form
│   │   └── detail.tsx   # Transaction detail view
│   ├── statistics/      # Trends and analytics pages
│   │   ├── index.tsx    # Statistics dashboard
│   │   └── charts/      # Chart components for trends
│   └── settings/        # Settings and category management
│       ├── index.tsx    # Settings home
│       └── categories.tsx  # Category management
├── components/          # Reusable UI components
│   ├── transaction-item.tsx   # Transaction list item
│   ├── category-picker.tsx    # Category selection component
│   ├── date-range-picker.tsx  # Date range filter
│   └── amount-input.tsx       # Formatted amount input
├── hooks/               # Custom React hooks
│   ├── use-transactions.ts    # Transaction data hooks
│   ├── use-categories.ts      # Category data hooks
│   └── use-statistics.ts      # Statistics data hooks
├── utils/               # Utility functions
│   ├── date.ts          # Date formatting and calculations
│   ├── currency.ts      # Amount formatting
│   └── validation.ts    # Input validation helpers
└── types/               # TypeScript type definitions
    ├── transaction.ts
    ├── category.ts
    └── statistics.ts

tests/
├── unit/                # Unit tests for services and models
│   ├── models/
│   ├── services/
│   └── utils/
├── integration/         # Integration tests for user flows
│   ├── transaction-flow.test.ts
│   ├── category-management.test.ts
│   └── statistics-calculation.test.ts
└── setup/               # Test configuration and helpers
    ├── database-mock.ts
    └── test-utils.tsx
```

**Structure Decision**: Using the mobile application structure with Taro conventions. Pages follow Taro's routing model, components are React-based, and models/services encapsulate database and business logic. This structure supports:
- Clear separation between UI (pages/components), business logic (services), and data access (models)
- Testability through isolated layers
- Taro's multi-platform compilation requirements
- Scalability for future features (budgets, reports, cloud sync)

## Complexity Tracking

> **No violations identified** - this section is not applicable as the Constitution Check passed without requiring any justifications.
