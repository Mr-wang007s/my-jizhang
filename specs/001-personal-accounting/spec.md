# Feature Specification: Personal Accounting System

**Feature Branch**: `001-personal-accounting`  
**Created**: 2025-11-20  
**Status**: Draft  
**Input**: User description: "构建一个个人记账项目,支持记录收入、支出、消费趋势统计"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Record Income and Expenses (Priority: P1)

Users need to quickly record their daily financial transactions (both income and expenses) with essential details like amount, category, and date. This is the core functionality that delivers immediate value.

**Why this priority**: This is the foundation of any accounting system. Without the ability to record transactions, no other features can function. Users can immediately start tracking their finances.

**Independent Test**: Can be fully tested by creating a new transaction (income or expense), saving it, and verifying it appears in the transaction list. Delivers immediate value by allowing users to track their money flow.

**Acceptance Scenarios**:

1. **Given** a user wants to record an expense, **When** they enter amount (e.g., 50.00), select a category (e.g., "Food"), choose date (today), and optionally add a note, **Then** the expense is saved and appears in their transaction history.
2. **Given** a user wants to record income, **When** they enter amount (e.g., 3000.00), select a category (e.g., "Salary"), choose date, and save, **Then** the income is recorded and reflects in their balance.
3. **Given** a user enters invalid data (e.g., negative amount, future date beyond reasonable range), **When** they attempt to save, **Then** the system shows clear validation errors and prevents saving.
4. **Given** a user has multiple transactions on the same day, **When** they view their transaction list, **Then** transactions are displayed in chronological order with clear visual distinction between income (positive) and expenses (negative).

---

### User Story 2 - View Spending Trends (Priority: P2)

Users want to understand their spending patterns over time to make informed financial decisions. They need to see trends by category, time period, and overall spending vs. income.

**Why this priority**: This provides analytical value and helps users gain insights from their data. It's a key differentiator from simple note-taking and delivers on the "trends analysis" requirement.

**Independent Test**: Can be tested independently by pre-populating transactions for a test user and verifying that trend visualizations (charts/graphs) accurately reflect spending patterns by category and time period.

**Acceptance Scenarios**:

1. **Given** a user has recorded transactions over multiple months, **When** they view the trends page, **Then** they see a visual breakdown of spending by category for the selected time period (default: current month).
2. **Given** a user wants to analyze a specific time range, **When** they select a date range (e.g., last 3 months, custom range), **Then** the trend visualization updates to show data for that period only.
3. **Given** a user has both income and expenses, **When** they view monthly trends, **Then** they see a comparison chart showing total income vs. total expenses for each month.
4. **Given** a user taps/clicks on a category in the trend view, **When** the system responds, **Then** they see a detailed list of all transactions in that category for the selected period.

---

### User Story 3 - Manage Transaction Categories (Priority: P3)

Users want to organize their transactions using custom categories that reflect their personal spending habits, going beyond default categories.

**Why this priority**: While helpful for personalization, the system can function with default categories. This is an enhancement that improves user experience but isn't critical for MVP.

**Independent Test**: Can be tested by creating a new custom category, using it in a transaction, and verifying it appears in both the category list and trend analysis.

**Acceptance Scenarios**:

1. **Given** a user wants to create a custom category, **When** they enter a category name (e.g., "Pet Care") and optional icon/color, **Then** the category is saved and available for selection when recording transactions.
2. **Given** a user has custom categories, **When** they record a transaction, **Then** they can choose from both default and custom categories.
3. **Given** a user wants to edit a category name, **When** they update it, **Then** all existing transactions using that category automatically reflect the new name.
4. **Given** a user attempts to delete a category that has associated transactions, **When** they confirm deletion, **Then** they are prompted to reassign those transactions to another category or the system assigns them to "Uncategorized".

---

### User Story 4 - View Balance Summary (Priority: P2)

Users need a quick overview of their current financial status, including total balance, monthly income, and monthly expenses.

**Why this priority**: This provides immediate context and helps users understand their financial health at a glance. It's essential for actionable insights.

**Independent Test**: Can be tested by creating test transactions and verifying that the summary accurately calculates and displays total balance, current month income, and current month expenses.

**Acceptance Scenarios**:

1. **Given** a user has recorded income and expenses, **When** they view the home/dashboard, **Then** they see their current balance (total income - total expenses), current month income, and current month expenses.
2. **Given** a user has transactions spanning multiple months, **When** they view the balance summary, **Then** the monthly figures reflect only the current calendar month, while total balance includes all historical transactions.
3. **Given** a user has no transactions, **When** they view the summary, **Then** all values show zero with helpful prompts to start recording transactions.

---

### Edge Cases

- What happens when a user tries to record a transaction with an extremely large amount (e.g., billions)?
- How does the system handle transactions recorded with dates far in the past (e.g., 10 years ago)?
- What happens when a user has thousands of transactions - how does performance impact trend calculations and list rendering?
- How does the system handle category deletion when hundreds of transactions are associated with it?
- What happens if a user tries to record an expense that exceeds their current balance (does the system allow negative balance)?
- How are transactions displayed across different time zones if the user travels?
- What happens when two transactions have the exact same timestamp?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to create transaction records with amount, transaction type (income/expense), category, date, and optional notes
- **FR-002**: System MUST validate transaction data (positive amounts, valid dates, required fields) before saving
- **FR-003**: System MUST support both income and expense transaction types with clear visual distinction
- **FR-004**: System MUST provide default categories for common transaction types (e.g., Food, Transportation, Salary, Utilities, Entertainment, Healthcare, Shopping)
- **FR-005**: System MUST allow users to create, edit, and delete custom categories
- **FR-006**: System MUST calculate and display current balance as total income minus total expenses
- **FR-007**: System MUST calculate and display monthly summary (current month income and expenses)
- **FR-008**: System MUST generate spending trend visualizations by category for user-selected time periods
- **FR-009**: System MUST generate spending trend visualizations showing income vs. expenses over time
- **FR-010**: System MUST allow users to view, edit, and delete existing transactions
- **FR-011**: System MUST persist all transaction data across sessions
- **FR-012**: System MUST support filtering transactions by date range, category, and transaction type
- **FR-013**: System MUST display transactions in reverse chronological order (newest first) by default
- **FR-014**: System MUST handle currency formatting using Chinese Yuan (CNY) with ¥ symbol and Chinese number formatting standards
- **FR-015**: System MUST support trend analysis for standard time periods (current month, last 3 months, last 6 months, current year, custom date range)

*Testing linkage*: 
- FR-001 to FR-005 are validated by User Story 1 acceptance scenarios
- FR-006 to FR-007 are validated by User Story 4 acceptance scenarios
- FR-008 to FR-009 are validated by User Story 2 acceptance scenarios
- FR-010 to FR-013 are validated by User Story 1 and edge cases

### Key Entities

- **Transaction**: Represents a single financial event; includes amount (decimal), type (income/expense), category reference, date/time, optional note/description, and unique identifier
- **Category**: Represents a spending/income classification; includes name, optional icon/color identifier, type indicator (expense/income/both), and whether it's system-default or user-created
- **Balance Summary**: Calculated aggregate data; includes total balance (all-time), current period income total, current period expense total, derived from Transaction records

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: [UX] Users can record a new transaction (income or expense) in under 5 steps and complete the action within 15 seconds
- **SC-002**: [Performance] Transaction list displays up to 1,000 records without noticeable lag (under 2 seconds load time)
- **SC-003**: [Performance] Trend visualizations generate and display within 3 seconds for up to 12 months of transaction data
- **SC-004**: [Accuracy] Balance calculations are accurate to 2 decimal places for all currency amounts
- **SC-005**: [Quality] No known P0/P1 defects remain for implemented user stories (P1 and P2 priorities)
- **SC-006**: [Testing] All critical paths (recording transactions, viewing balance, viewing trends) have automated tests that pass in CI
- **SC-007**: [Data Integrity] Zero data loss - all saved transactions persist correctly across application restarts
- **SC-008**: [Usability] Users can understand their spending patterns by viewing trend visualizations without additional explanation or documentation
- **SC-009**: [Functionality] System correctly categorizes and aggregates transactions across all supported time periods (monthly, quarterly, yearly)

## Assumptions

- **Currency**: System uses Chinese Yuan (CNY) exclusively with ¥ symbol and Chinese number formatting (e.g., ¥1,234.56)
- **Single User**: This is a personal accounting system designed for individual use (not multi-user or family accounts)
- **Data Storage**: All data is stored locally on the user's device (no cloud sync or backup in MVP)
- **Time Zone**: Transactions are recorded in the user's local time zone
- **Categories**: System provides approximately 8-12 default categories covering common expense and income types
- **Date Range**: Reasonable date range for transactions is limited to prevent abuse (e.g., transactions can be dated from 10 years in the past to 1 week in the future for planned expenses)
- **Decimal Precision**: All monetary amounts support 2 decimal places (standard for most currencies)
- **Visual Trends**: Trend visualizations include at minimum bar charts or line graphs showing spending over time and pie/donut charts for category breakdown
