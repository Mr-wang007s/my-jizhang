# Data Model: Personal Accounting System

**Feature**: 001-personal-accounting  
**Date**: 2025-11-20  
**Storage**: WeChat Cloud Database (primary) or local storage (fallback)

## Overview

This document defines the data entities, relationships, and validation rules for the personal accounting system. The model supports transaction recording, categorization, and trend analysis.

---

## Entities

### 1. Transaction

Represents a single financial transaction (income or expense).

**Fields**:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `_id` | string | Yes | Auto-generated (cloud DB) or timestamp-based | Unique identifier |
| `amount` | number | Yes | > 0, max 2 decimal places | Transaction amount in CNY |
| `type` | enum | Yes | "income" \| "expense" | Transaction type |
| `categoryId` | string | Yes | References Category._id | Associated category |
| `date` | string (ISO 8601) | Yes | YYYY-MM-DD format, not > 7 days in future | Transaction date |
| `note` | string | No | Max 200 characters | Optional description |
| `createdAt` | string (ISO 8601) | Yes | Auto-generated | Record creation timestamp |
| `updatedAt` | string (ISO 8601) | Yes | Auto-updated | Last modification timestamp |

**Validation Rules**:
- `amount`: Must be positive, precision limited to 2 decimal places (e.g., 100.56)
- `type`: Must be either "income" or "expense"
- `categoryId`: Must reference an existing category
- `date`: Cannot be more than 10 years in the past or more than 7 days in the future
- `note`: Optional, max 200 characters

**Example**:
```json
{
  "_id": "txn_1637123456789",
  "amount": 50.00,
  "type": "expense",
  "categoryId": "cat_food",
  "date": "2025-11-20",
  "note": "午餐",
  "createdAt": "2025-11-20T12:30:00.000Z",
  "updatedAt": "2025-11-20T12:30:00.000Z"
}
```

**Indexes** (for performance):
- `date` (desc) - for chronological listing and date range queries
- `categoryId` - for category-based filtering and trend aggregation
- `type` - for income/expense separation

---

### 2. Category

Represents a transaction category for organizing income and expenses.

**Fields**:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `_id` | string | Yes | Unique slug (e.g., "cat_food") | Unique identifier |
| `name` | string | Yes | Max 20 characters, unique | Display name (e.g., "餐饮") |
| `icon` | string | No | Icon name or emoji | Visual identifier |
| `color` | string | No | Hex color code (e.g., "#FF5733") | Category color |
| `type` | enum | Yes | "income" \| "expense" \| "both" | Applicable transaction types |
| `isDefault` | boolean | Yes | true \| false | System-provided vs user-created |
| `order` | number | Yes | Integer >= 0 | Display order in lists |
| `createdAt` | string (ISO 8601) | Yes | Auto-generated | Record creation timestamp |

**Validation Rules**:
- `name`: Required, max 20 characters, must be unique across all categories
- `icon`: Optional, can be emoji or icon name from icon library
- `color`: Optional, must be valid hex color if provided
- `type`: Determines which transaction types can use this category
- `isDefault`: Default categories cannot be deleted (only hidden)
- `order`: Lower numbers appear first in selection lists

**Default Categories** (pre-populated):

| ID | Name | Icon | Type | Order |
|----|------|------|------|-------|
| `cat_salary` | 工资 | 💼 | income | 1 |
| `cat_bonus` | 奖金 | 🎁 | income | 2 |
| `cat_investment` | 投资收益 | 📈 | income | 3 |
| `cat_food` | 餐饮 | 🍜 | expense | 10 |
| `cat_transport` | 交通 | 🚗 | expense | 11 |
| `cat_shopping` | 购物 | 🛍️ | expense | 12 |
| `cat_utilities` | 水电费 | 💡 | expense | 13 |
| `cat_entertainment` | 娱乐 | 🎮 | expense | 14 |
| `cat_healthcare` | 医疗 | 🏥 | expense | 15 |
| `cat_education` | 教育 | 📚 | expense | 16 |
| `cat_housing` | 住房 | 🏠 | expense | 17 |
| `cat_other` | 其他 | ⭐ | both | 100 |

**Example**:
```json
{
  "_id": "cat_food",
  "name": "餐饮",
  "icon": "🍜",
  "color": "#FF5733",
  "type": "expense",
  "isDefault": true,
  "order": 10,
  "createdAt": "2025-11-20T00:00:00.000Z"
}
```

**Indexes**:
- `type, order` - for efficient category selection by type

---

### 3. BalanceSummary (Computed/Derived)

**Not a stored entity** - calculated on-demand from Transaction records.

**Computed Fields**:

| Field | Type | Calculation |
|-------|------|-------------|
| `totalBalance` | number | SUM(amount WHERE type='income') - SUM(amount WHERE type='expense') |
| `monthlyIncome` | number | SUM(amount WHERE type='income' AND date >= startOfMonth AND date <= endOfMonth) |
| `monthlyExpense` | number | SUM(amount WHERE type='expense' AND date >= startOfMonth AND date <= endOfMonth) |
| `monthlyBalance` | number | monthlyIncome - monthlyExpense |

**Example Response**:
```json
{
  "totalBalance": 12450.50,
  "monthlyIncome": 5000.00,
  "monthlyExpense": 2350.75,
  "monthlyBalance": 2649.25,
  "month": "2025-11"
}
```

---

### 4. TrendData (Computed/Derived)

**Not a stored entity** - aggregated from Transaction records for visualization.

**Computed Structures**:

**By Category** (for pie/donut charts):
```json
{
  "period": { "start": "2025-11-01", "end": "2025-11-30" },
  "type": "expense",
  "data": [
    { "categoryId": "cat_food", "categoryName": "餐饮", "total": 1200.50, "percentage": 35.2 },
    { "categoryId": "cat_transport", "categoryName": "交通", "total": 800.00, "percentage": 23.5 },
    { "categoryId": "cat_shopping", "categoryName": "购物", "total": 600.25, "percentage": 17.6 }
  ]
}
```

**By Time Period** (for line/bar charts):
```json
{
  "period": { "start": "2025-08-01", "end": "2025-11-30" },
  "granularity": "month",
  "data": [
    { "period": "2025-08", "income": 5000, "expense": 2800, "balance": 2200 },
    { "period": "2025-09", "income": 5200, "expense": 3100, "balance": 2100 },
    { "period": "2025-10", "income": 5000, "expense": 2900, "balance": 2100 },
    { "period": "2025-11", "income": 5000, "expense": 2350, "balance": 2650 }
  ]
}
```

---

## Relationships

```
Category (1) ──< (Many) Transaction
    |
    └─ categoryId references Category._id
```

- **One Category** can have **many Transactions**
- **One Transaction** must belong to **exactly one Category**
- Deleting a category requires reassigning its transactions to another category

---

## State Transitions

### Transaction Lifecycle

```
[Create] → ACTIVE → [Edit] → ACTIVE → [Delete] → DELETED
```

- **Create**: New transaction saved with current timestamp
- **Edit**: Updates `updatedAt` timestamp
- **Delete**: Soft delete (mark as deleted) or hard delete (remove from DB)
  - Recommendation: Soft delete for audit trail

### Category Lifecycle

```
[Create] → ACTIVE → [Edit] → ACTIVE → [Hide/Delete] → HIDDEN
```

- **Create**: User-created categories (isDefault = false)
- **Edit**: Name, icon, color can be changed
- **Hide/Delete**: 
  - Default categories: Set to hidden, not deleted
  - User categories: Prompt to reassign transactions before deletion

---

## Data Access Patterns

### Frequent Queries (optimize with indexes)

1. **Recent Transactions** (Home page):
   ```javascript
   db.collection('transactions')
     .orderBy('date', 'desc')
     .limit(20)
     .get()
   ```

2. **Monthly Summary**:
   ```javascript
   db.collection('transactions')
     .where({
       date: db.command.gte('2025-11-01').and(db.command.lte('2025-11-30'))
     })
     .get()
   ```

3. **Category Breakdown** (Trend analysis):
   ```javascript
   db.collection('transactions')
     .where({
       type: 'expense',
       date: db.command.gte('2025-11-01')
     })
     .get()
   // Then aggregate by categoryId client-side
   ```

4. **Search/Filter**:
   ```javascript
   db.collection('transactions')
     .where({
       categoryId: 'cat_food',
       date: db.command.gte('2025-10-01')
     })
     .orderBy('date', 'desc')
     .get()
   ```

---

## Validation Summary

### Transaction Validation

```typescript
interface TransactionValidation {
  amount: (val: number) => {
    required: true,
    min: 0.01,
    max: 999999999.99,
    decimalPlaces: 2
  },
  type: (val: string) => {
    enum: ['income', 'expense']
  },
  categoryId: (val: string) => {
    exists: true, // Must reference existing category
    notEmpty: true
  },
  date: (val: string) => {
    format: 'YYYY-MM-DD',
    minDate: dayjs().subtract(10, 'years'),
    maxDate: dayjs().add(7, 'days')
  },
  note: (val: string) => {
    maxLength: 200,
    optional: true
  }
}
```

### Category Validation

```typescript
interface CategoryValidation {
  name: (val: string) => {
    required: true,
    maxLength: 20,
    unique: true
  },
  type: (val: string) => {
    enum: ['income', 'expense', 'both']
  },
  isDefault: (val: boolean) => {
    immutable: true // Cannot change after creation
  }
}
```

---

## Migration Strategy

### Initial Data Setup

On first app launch:
1. Create default categories (12 categories as defined above)
2. Set app initialization flag in storage
3. Display onboarding guide

### Future Schema Changes

For WeChat Cloud Database:
- Database schema is flexible (NoSQL)
- Add new fields without migration
- Handle missing fields in application logic with defaults

For local storage:
- Version tracking in storage: `{ version: 1, data: {...} }`
- Migration function runs on app start if version mismatch:
  ```typescript
  const migrateData = (currentVersion: number, targetVersion: number) => {
    if (currentVersion < 2) {
      // Add new field to existing records
      transactions.forEach(t => t.updatedAt = t.createdAt)
    }
  }
  ```

---

## Performance Considerations

### Storage Limits

- **WeChat Cloud Database**: Unlimited (free tier: 2GB)
- **Local Storage**: 10MB limit
  - Average transaction size: ~200 bytes
  - Capacity: ~50,000 transactions (exceeds user needs)

### Query Optimization

1. **Indexes**: Create on `date`, `categoryId`, `type` for fast filtering
2. **Pagination**: Load transactions in batches (20-50 per page)
3. **Aggregation**: 
   - For trend data, aggregate on server-side if using cloud DB
   - For local storage, cache aggregated results (invalidate on data change)

### Caching Strategy

```typescript
// Cache balance summary (invalidate on transaction CRUD)
const balanceCache = {
  data: null,
  timestamp: null,
  ttl: 60000, // 1 minute
  
  get: async () => {
    if (balanceCache.data && Date.now() - balanceCache.timestamp < balanceCache.ttl) {
      return balanceCache.data
    }
    balanceCache.data = await calculateBalance()
    balanceCache.timestamp = Date.now()
    return balanceCache.data
  },
  
  invalidate: () => {
    balanceCache.data = null
    balanceCache.timestamp = null
  }
}
```

---

## Summary

**Core Entities**:
- Transaction (stored)
- Category (stored)
- BalanceSummary (computed)
- TrendData (computed)

**Key Design Decisions**:
1. Simple 1:M relationship (Category → Transactions)
2. No soft delete for transactions (hard delete acceptable for personal app)
3. Default categories cannot be deleted (only hidden)
4. All dates stored in ISO 8601 format for consistency
5. Currency precision limited to 2 decimal places
6. Computed entities (balance, trends) calculated on-demand with caching

**Next Steps**:
- Define API contracts for CRUD operations
- Implement data access layer with validation
- Create database initialization scripts
