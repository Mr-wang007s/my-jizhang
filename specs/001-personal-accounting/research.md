# Research: Personal Accounting System Technical Decisions

**Date**: 2025-11-20  
**Feature**: Personal Accounting System (001-personal-accounting)

## Overview

This document consolidates research findings for key technical decisions needed to implement the personal accounting system using Taro 4.x, TailwindCSS, and local data storage.

---

## Research Area 1: Target Platform Selection

### Decision
**Primary: WeChat Mini-Program (微信小程序)**  
**Secondary: H5 (Web) for accessibility**

### Rationale

1. **Market Fit**:
   - WeChat has 1.3+ billion monthly active users in China
   - Zero installation friction - instant access via WeChat
   - Finance/accounting apps are popular mini-program categories
   - Lower user acquisition costs compared to standalone apps

2. **User Behavior**:
   - Chinese users already manage finances through WeChat (WeChat Pay)
   - Natural integration with daily financial ecosystem
   - Built-in sharing for family accounting scenarios

3. **Distribution Advantages**:
   - No app store approval delays
   - Searchable within WeChat ecosystem
   - Easy sharing via QR codes
   - Auto-updates on launch

4. **Technical Feasibility**:
   - 10MB local storage via `wx.setStorage` (sufficient for thousands of transactions)
   - Excellent chart library support (ECharts via `ec-canvas`)
   - Mature ecosystem with Chinese documentation

### Alternatives Considered

| Platform | Pros | Cons | Verdict |
|----------|------|------|---------|
| **H5 Web** | Full SQLite support, no restrictions, easy debugging | Poor discovery in China, no native feel, lower trust for finance data | Secondary target for web accessibility |
| **React Native** | Full native SQLite, best performance | High distribution barrier in China, 50-100MB app size, complex approval process, maintenance overhead | Not recommended for MVP |
| **Alipay Mini-Program** | Strong finance user base, similar capabilities to WeChat | Smaller user base, less social features | Optional expansion target |

### Implementation Notes

**Storage Strategy** (WeChat mini-program constraint - no native SQLite):
- **Option A (Recommended for MVP)**: WeChat Cloud Database
  - Auto-sync, no storage limits, built-in backup
  - Free tier available
  - Code example:
    ```javascript
    Taro.cloud.init()
    const db = Taro.cloud.database()
    db.collection('transactions').add({ data: {...} })
    ```

- **Option B**: Structured local storage (fallback)
  - 10MB limit (sufficient for ~5000 transaction records)
  - Manual indexing for performance
  - Simple implementation with `Taro.setStorageSync`

**Build Configuration**:
```bash
npm run dev:weapp    # WeChat development
npm run build:weapp  # Production build
npm run dev:h5       # H5 fallback
```

**Platform-specific code handling**:
- Use `process.env.TARO_ENV` for conditional logic
- Multi-platform file naming: `index.weapp.tsx`, `index.h5.tsx`

**Chart Library**: ECharts via `echarts-for-weixin`
- Download `ec-canvas` component from GitHub
- Use custom build (https://echarts.apache.org/builder.html) to include only needed chart types
- Target size: <400KB (line, bar, pie charts only)
- Alternative: F2 (AntV) - lighter weight (~200KB) but less features

**Deployment Phases**:
1. **Phase 1 (MVP)**: WeChat mini-program only
2. **Phase 2**: Add H5 for desktop access
3. **Phase 3**: Expand to Alipay if user demand validates

---

## Research Area 2: State Management

### Decision
**Zustand for global state + React hooks for local component state**

### Rationale

1. **Taro 4.x Compatibility**:
   - Zustand is explicitly recommended in Taro documentation for React-based projects
   - Works seamlessly across all Taro platforms (WeChat, H5, native)
   - No platform-specific adapters needed

2. **Performance Characteristics**:
   - Bundle size: ~1.2KB (minified + gzipped) vs Redux Toolkit (~22KB)
   - No re-render overhead - components subscribe only to needed state slices
   - Perfect for financial app with frequent balance updates

3. **Developer Experience**:
   - Minimal boilerplate - no actions, reducers, or dispatch patterns
   - First-class TypeScript support
   - Simple API similar to React hooks (low learning curve)
   - Easy debugging with DevTools

4. **Suitability for Local Data**:
   - Integrates naturally with async data fetching from SQLite/cloud DB
   - Supports middleware for persistence (zustand/middleware)
   - Can sync state with Taro storage automatically

### Alternatives Considered

| Solution | Pros | Cons | Verdict |
|----------|------|------|---------|
| **Built-in React Hooks** | No dependencies, simple for small apps | Context API causes re-renders, prop drilling for deep trees, no DevTools | Good for component-local state, insufficient for global app state |
| **Redux Toolkit** | Industry standard, powerful DevTools, extensive ecosystem | 22KB bundle size, significant boilerplate, overkill for personal app | Too complex for project needs |
| **MobX** | Reactive programming, minimal boilerplate | Steeper learning curve, decorators require Babel config in Taro, less community adoption | More complex than needed |

### Implementation Notes

**Installation**:
```bash
npm install zustand
```

**Store Structure** (TypeScript):
```typescript
// src/store/index.ts
import create from 'zustand'
import { persist } from 'zustand/middleware'

interface Transaction {
  id: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string
  note?: string
}

interface AppState {
  transactions: Transaction[]
  categories: Category[]
  balance: number
  
  // Actions
  addTransaction: (transaction: Transaction) => void
  updateBalance: () => void
  loadTransactions: () => Promise<void>
}

export const useStore = create<AppState>(
  persist(
    (set, get) => ({
      transactions: [],
      categories: [],
      balance: 0,
      
      addTransaction: (transaction) => {
        set(state => ({
          transactions: [...state.transactions, transaction]
        }))
        get().updateBalance()
      },
      
      updateBalance: () => {
        const { transactions } = get()
        const balance = transactions.reduce((sum, t) => 
          sum + (t.type === 'income' ? t.amount : -t.amount), 0
        )
        set({ balance })
      },
      
      loadTransactions: async () => {
        // Load from WeChat Cloud DB or local storage
        const data = await fetchTransactions()
        set({ transactions: data })
      }
    }),
    {
      name: 'accounting-storage', // Storage key
      getStorage: () => ({
        getItem: (key) => Taro.getStorageSync(key),
        setItem: (key, value) => Taro.setStorageSync(key, value),
        removeItem: (key) => Taro.removeStorageSync(key)
      })
    }
  )
)
```

**Usage in Components**:
```typescript
// Only re-renders when balance changes
const balance = useStore(state => state.balance)

// Access actions
const addTransaction = useStore(state => state.addTransaction)
```

**Best Practices**:
- Use Zustand for: global app state (transactions, categories, user preferences)
- Use React hooks for: form state, UI toggles, component-specific data
- Keep stores flat - avoid deep nesting
- Use selectors to prevent unnecessary re-renders
- Integrate with Taro storage middleware for persistence

---

## Research Area 3: Testing Strategy

### Decision
**Jest + @testing-library/react + @tarojs/test-utils-react for comprehensive testing**

### Rationale

1. **Official Taro Support**:
   - Taro 4.x provides `@tarojs/test-utils-react` package specifically for React component testing
   - Integrates seamlessly with Jest (default test runner in Taro projects)
   - Official documentation and examples available

2. **Testing Layers Coverage**:
   - **Unit**: Jest for business logic (calculations, validation, date utilities)
   - **Component**: @testing-library/react for UI components and user interactions
   - **Integration**: Mock Taro APIs and test SQLite/storage operations
   - **E2E**: Taro's built-in simulator for WeChat mini-program flows

3. **Community Adoption**:
   - Jest is industry standard (used by React, React Native, Taro ecosystem)
   - @testing-library/react promotes best practices (testing user behavior, not implementation)
   - Extensive resources and plugins available

4. **TypeScript Integration**:
   - First-class TypeScript support with ts-jest
   - Type-safe mocks and assertions

### Alternatives Considered

| Solution | Pros | Cons | Verdict |
|----------|------|------|---------|
| **Vitest** | Faster than Jest, native ESM support, modern API | Less mature for Taro ecosystem, fewer mini-program testing examples | Promising but stick with Jest for stability |
| **Cypress** | Excellent E2E experience for web | Cannot test mini-program environment, heavy for unit tests | Not suitable for WeChat mini-program target |
| **Playwright** | Multi-browser E2E testing | No mini-program support, overkill for MVP | Use for H5 target only if needed |

### Implementation Notes

**Installation**:
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @tarojs/test-utils-react ts-jest @types/jest
```

**Jest Configuration** (`jest.config.js`):
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Mock Taro APIs
    '@tarojs/taro': '<rootDir>/__mocks__/taro.ts'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app.config.ts'
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80
    }
  }
}
```

**Mock Taro APIs** (`__mocks__/taro.ts`):
```typescript
const mockStorage: Record<string, any> = {}

export default {
  setStorageSync: (key: string, data: any) => {
    mockStorage[key] = data
  },
  getStorageSync: (key: string) => mockStorage[key],
  removeStorageSync: (key: string) => {
    delete mockStorage[key]
  },
  // Add other Taro APIs as needed
  showToast: jest.fn(),
  navigateTo: jest.fn()
}
```

**Example Unit Test** (Balance calculation):
```typescript
// src/utils/__tests__/balance.test.ts
import { calculateBalance } from '../balance'

describe('Balance Calculation', () => {
  it('should calculate correct balance from transactions', () => {
    const transactions = [
      { type: 'income', amount: 1000 },
      { type: 'expense', amount: 200 },
      { type: 'expense', amount: 150 }
    ]
    
    expect(calculateBalance(transactions)).toBe(650)
  })
  
  it('should handle empty transactions', () => {
    expect(calculateBalance([])).toBe(0)
  })
  
  it('should handle precision to 2 decimal places', () => {
    const transactions = [
      { type: 'income', amount: 100.556 },
      { type: 'expense', amount: 50.334 }
    ]
    
    expect(calculateBalance(transactions)).toBe(50.22)
  })
})
```

**Example Component Test**:
```typescript
// src/components/__tests__/TransactionForm.test.tsx
import { render, fireEvent, waitFor } from '@testing-library/react'
import { TransactionForm } from '../TransactionForm'

describe('TransactionForm', () => {
  it('should validate amount is positive', async () => {
    const { getByLabelText, getByText } = render(<TransactionForm />)
    
    const amountInput = getByLabelText('金额')
    fireEvent.change(amountInput, { target: { value: '-50' } })
    
    await waitFor(() => {
      expect(getByText('金额必须大于0')).toBeInTheDocument()
    })
  })
  
  it('should submit valid transaction', async () => {
    const onSubmit = jest.fn()
    const { getByLabelText, getByText } = render(
      <TransactionForm onSubmit={onSubmit} />
    )
    
    fireEvent.change(getByLabelText('金额'), { target: { value: '100' } })
    fireEvent.change(getByLabelText('分类'), { target: { value: 'food' } })
    fireEvent.click(getByText('保存'))
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 100,
          category: 'food'
        })
      )
    })
  })
})
```

**Integration Test** (Storage operations):
```typescript
// src/services/__tests__/transaction.service.test.ts
import Taro from '@tarojs/taro'
import { TransactionService } from '../transaction.service'

jest.mock('@tarojs/taro')

describe('TransactionService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  it('should save transaction to storage', async () => {
    const transaction = {
      id: '1',
      amount: 100,
      type: 'expense',
      category: 'food',
      date: '2025-11-20'
    }
    
    await TransactionService.save(transaction)
    
    expect(Taro.setStorageSync).toHaveBeenCalledWith(
      'transactions',
      expect.arrayContaining([transaction])
    )
  })
  
  it('should load transactions from storage', async () => {
    const mockData = [{ id: '1', amount: 100 }]
    ;(Taro.getStorageSync as jest.Mock).mockReturnValue(mockData)
    
    const result = await TransactionService.loadAll()
    
    expect(result).toEqual(mockData)
    expect(Taro.getStorageSync).toHaveBeenCalledWith('transactions')
  })
})
```

**E2E Testing Strategy** (Mini-program):
- Use WeChat DevTools automation testing feature
- Write test scripts for critical user flows:
  1. Add new transaction → verify in list
  2. View balance summary → check calculations
  3. Generate trend chart → verify data accuracy
  4. Edit transaction → verify updates persist

**Test Commands**:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

**Coverage Targets**:
- Services layer: 80% (transaction logic, calculations)
- Utils/helpers: 100% (date formatting, currency, validation)
- Components: 70% (focus on user interactions)
- Overall: 80%+ for production readiness

**SQLite Mocking Approach** (if using local SQLite for H5):
```typescript
// For H5 target with sql.js
jest.mock('sql.js', () => ({
  default: jest.fn(() => Promise.resolve({
    Database: jest.fn(() => ({
      run: jest.fn(),
      exec: jest.fn(() => [{ values: [[1, 100, 'food']] }]),
      close: jest.fn()
    }))
  }))
}))
```

**CI Integration** (package.json):
```json
{
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx",
    "test:ci": "npm run lint && npm run test:coverage",
    "build:ci": "npm run test:ci && npm run build:weapp"
  }
}
```

---

## Additional Technical Considerations

### TailwindCSS Integration with Taro

**Installation**:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

**Taro Configuration** (`config/index.js`):
```javascript
const config = {
  // ...
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          // Ignore Tailwind classes
          selectorBlackList: [/^\.bg-/, /^\.text-/, /^\.p-/, /^\.m-/]
        }
      },
      autoprefixer: {
        enable: true
      },
      cssModules: {
        enable: false
      }
    }
  }
}
```

**Tailwind Config** (`tailwind.config.js`):
```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        income: '#34D399',  // Green for income
        expense: '#EF4444', // Red for expenses
        primary: '#3B82F6'
      }
    }
  },
  plugins: [],
  // Important for mini-program compatibility
  corePlugins: {
    preflight: false // Disable base styles
  }
}
```

**Usage in Components**:
```tsx
<View className="bg-white p-4 rounded-lg shadow-md">
  <Text className="text-lg font-bold text-gray-900">¥1,234.56</Text>
</View>
```

**Gotchas**:
- Mini-programs don't support full CSS - some Tailwind utilities may not work
- Test thoroughly in WeChat DevTools
- Consider using Taro's built-in style system for complex layouts

### Currency Formatting (CNY)

**Utility Function**:
```typescript
// src/utils/currency.ts
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// Usage: formatCurrency(1234.56) → "¥1,234.56"
```

### Date Handling

**Recommended Library**: `dayjs` (2KB, Taro-compatible)
```bash
npm install dayjs
```

**Usage**:
```typescript
import dayjs from 'dayjs'

// Format for display
dayjs().format('YYYY-MM-DD') // "2025-11-20"

// Date range filters
const startOfMonth = dayjs().startOf('month')
const endOfMonth = dayjs().endOf('month')

// Relative time
dayjs('2025-11-15').fromNow() // "5 days ago"
```

---

## Summary

**Technology Stack Finalized**:
- **Platform**: WeChat Mini-Program (primary), H5 (secondary)
- **Framework**: Taro 4.x + React + TypeScript
- **Styling**: TailwindCSS (with mini-program compatibility adjustments)
- **State Management**: Zustand + React hooks
- **Data Storage**: WeChat Cloud Database (primary) or local storage (fallback)
- **Charts**: ECharts (custom build <400KB)
- **Testing**: Jest + @testing-library/react + @tarojs/test-utils-react
- **Date Library**: dayjs
- **Currency**: Intl.NumberFormat API

**Next Steps**:
1. Update plan.md Technical Context with resolved decisions
2. Generate data-model.md based on spec entities
3. Create API contracts (if using cloud database)
4. Generate quickstart.md for development setup
