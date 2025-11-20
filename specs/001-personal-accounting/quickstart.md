# Quickstart Guide: Personal Accounting System

**Feature**: 001-personal-accounting  
**Date**: 2025-11-20  
**Target**: Developers setting up the project for the first time

## Overview

This guide walks you through setting up the Taro-based personal accounting system from scratch, running it locally, and deploying to WeChat Mini-Program.

**Tech Stack**: Taro 4.x, React, TypeScript, TailwindCSS, Zustand, WeChat Cloud Database

---

## Prerequisites

### Required

- **Node.js**: v16+ (v18 recommended)
- **npm** or **yarn**: Latest version
- **WeChat DevTools**: Download from [WeChat Official](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- **WeChat Developer Account**: Register at [WeChat MP](https://mp.weixin.qq.com/)

### Recommended

- **VS Code** with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - Taro Extension

---

## Step 1: Initialize Taro Project

### 1.1 Install Taro CLI

```bash
npm install -g @tarojs/cli
```

Verify installation:
```bash
taro -V
# Should output: @tarojs/cli 4.x.x
```

---

### 1.2 Create New Project

```bash
npx @tarojs/cli init my-jizhang
```

**Interactive Prompts**:
- Template: `React`
- Language: `TypeScript`
- CSS Pre-processor: `Sass`
- Template source: `Default template`
- Features: `Enable TypeScript`, `Enable ESLint`

**Generated Structure**:
```
my-jizhang/
├── config/              # Taro configuration
├── src/
│   ├── app.config.ts   # Global app config
│   ├── app.ts          # App entry
│   ├── pages/          # Page components
│   └── index.html      # H5 entry
├── project.config.json # WeChat Mini-Program config
├── package.json
└── tsconfig.json
```

---

### 1.3 Install Dependencies

```bash
cd my-jizhang

# Core dependencies
npm install zustand dayjs

# Chart library (will be manually integrated later)
# npm install echarts

# Development dependencies
npm install -D tailwindcss postcss autoprefixer
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D @tarojs/test-utils-react ts-jest @types/jest
```

---

## Step 2: Configure TailwindCSS

### 2.1 Initialize Tailwind

```bash
npx tailwindcss init
```

---

### 2.2 Configure Tailwind (`tailwind.config.js`)

```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        income: '#34D399',   // Green for income
        expense: '#EF4444',  // Red for expenses
        primary: '#3B82F6',  // Blue for primary actions
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable base styles for mini-program compatibility
  },
}
```

---

### 2.3 Update Taro Config (`config/index.ts`)

```typescript
import { defineConfig } from '@tarojs/cli'

export default defineConfig({
  projectName: 'my-jizhang',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: 'react',
  compiler: 'webpack5',
  cache: {
    enable: false,
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          // Ignore Tailwind utility classes
          selectorBlackList: [/^\.bg-/, /^\.text-/, /^\.p-/, /^\.m-/, /^\.flex/, /^\.grid/],
        },
      },
      autoprefixer: {
        enable: true,
      },
      cssModules: {
        enable: false,
      },
    },
    webpackChain(chain) {
      // Optimize bundle size
      chain.merge({
        optimization: {
          splitChunks: {
            cacheGroups: {
              common: {
                name: 'common',
                minChunks: 2,
                priority: 1,
              },
              vendors: {
                name: 'vendors',
                minChunks: 2,
                test: /[\\/]node_modules[\\/]/,
                priority: 10,
              },
            },
          },
        },
      })
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
      },
    },
  },
})
```

---

### 2.4 Import Tailwind Styles

Create `src/app.scss`:
```scss
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
```

Update `src/app.ts`:
```typescript
import { Component, PropsWithChildren } from 'react'
import './app.scss' // Import Tailwind styles

class App extends Component<PropsWithChildren> {
  render() {
    return this.props.children
  }
}

export default App
```

---

## Step 3: Set Up WeChat Cloud Database

### 3.1 Enable Cloud Development

1. Open **WeChat DevTools**
2. Create a new mini-program project
3. Go to **Cloud Development** tab → **Open**
4. Create a new environment (e.g., `dev-env`)
5. Note the **Environment ID** (e.g., `dev-abc123`)

---

### 3.2 Initialize Cloud in App

Update `src/app.ts`:
```typescript
import Taro from '@tarojs/taro'
import { Component, PropsWithChildren } from 'react'
import './app.scss'

class App extends Component<PropsWithChildren> {
  componentDidMount() {
    // Initialize WeChat Cloud
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init({
        env: 'dev-abc123', // Replace with your environment ID
        traceUser: true,
      })
    }
  }

  render() {
    return this.props.children
  }
}

export default App
```

---

### 3.3 Create Database Collections

In WeChat DevTools:
1. Go to **Cloud Development** → **Database**
2. Create collections:
   - `transactions`
   - `categories`

**Set Permissions**:
- Transactions: `All users can read and write their own data`
- Categories: `All users can read and write their own data`

---

### 3.4 Initialize Default Categories

Create script to populate categories on first launch (see data-model.md for category list).

---

## Step 4: Project Structure Setup

Create the following directory structure:

```
src/
├── components/          # Reusable components
│   ├── TransactionList/
│   ├── CategorySelector/
│   ├── BalanceCard/
│   └── TrendChart/
├── pages/               # Page components
│   ├── index/           # Home (balance summary)
│   ├── transactions/    # Transaction list
│   ├── add-transaction/ # Add/edit transaction form
│   ├── trends/          # Trend visualization
│   └── settings/        # Settings page
├── services/            # Data access layer
│   ├── transaction.service.ts
│   ├── category.service.ts
│   ├── balance.service.ts
│   └── trend.service.ts
├── store/               # Zustand stores
│   └── index.ts
├── utils/               # Utility functions
│   ├── currency.ts      # Currency formatting
│   ├── date.ts          # Date helpers
│   └── validation.ts    # Input validation
├── types/               # TypeScript types
│   └── index.ts
├── app.config.ts
├── app.scss
└── app.ts
```

---

## Step 5: Configure App Pages

Update `src/app.config.ts`:
```typescript
export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/transactions/index',
    'pages/add-transaction/index',
    'pages/trends/index',
    'pages/settings/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '我的记账',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    color: '#999',
    selectedColor: '#3B82F6',
    backgroundColor: '#fff',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/icons/home.png',
        selectedIconPath: 'assets/icons/home-active.png',
      },
      {
        pagePath: 'pages/transactions/index',
        text: '账单',
        iconPath: 'assets/icons/list.png',
        selectedIconPath: 'assets/icons/list-active.png',
      },
      {
        pagePath: 'pages/trends/index',
        text: '趋势',
        iconPath: 'assets/icons/chart.png',
        selectedIconPath: 'assets/icons/chart-active.png',
      },
      {
        pagePath: 'pages/settings/index',
        text: '设置',
        iconPath: 'assets/icons/settings.png',
        selectedIconPath: 'assets/icons/settings-active.png',
      },
    ],
  },
})
```

**Note**: Create placeholder icon images in `src/assets/icons/`.

---

## Step 6: Set Up Zustand Store

Create `src/store/index.ts`:
```typescript
import create from 'zustand'
import { persist } from 'zustand/middleware'
import Taro from '@tarojs/taro'

export interface Transaction {
  _id: string
  amount: number
  type: 'income' | 'expense'
  categoryId: string
  date: string
  note?: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  _id: string
  name: string
  icon?: string
  color?: string
  type: 'income' | 'expense' | 'both'
  isDefault: boolean
  order: number
}

interface AppState {
  transactions: Transaction[]
  categories: Category[]
  balance: number
  loading: boolean

  // Actions
  setTransactions: (transactions: Transaction[]) => void
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  setCategories: (categories: Category[]) => void
  setLoading: (loading: boolean) => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      transactions: [],
      categories: [],
      balance: 0,
      loading: false,

      setTransactions: (transactions) => set({ transactions }),
      
      addTransaction: (transaction) => {
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        }))
      },

      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t._id === id ? { ...t, ...updates } : t
          ),
        }))
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t._id !== id),
        }))
      },

      setCategories: (categories) => set({ categories }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'jizhang-storage',
      getStorage: () => ({
        getItem: (key) => {
          const value = Taro.getStorageSync(key)
          return value || null
        },
        setItem: (key, value) => {
          Taro.setStorageSync(key, value)
        },
        removeItem: (key) => {
          Taro.removeStorageSync(key)
        },
      }),
    }
  )
)
```

---

## Step 7: Implement Services

### Example: Transaction Service (`src/services/transaction.service.ts`)

```typescript
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'

export interface CreateTransactionInput {
  amount: number
  type: 'income' | 'expense'
  categoryId: string
  date: string
  note?: string
}

const db = Taro.cloud.database()

export class TransactionService {
  static async create(input: CreateTransactionInput) {
    // Validation
    if (input.amount <= 0) {
      throw new Error('Amount must be positive')
    }

    const transaction = {
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const result = await db.collection('transactions').add({ data: transaction })
    return { _id: result._id, ...transaction }
  }

  static async list(limit = 20, offset = 0) {
    const result = await db
      .collection('transactions')
      .orderBy('date', 'desc')
      .skip(offset)
      .limit(limit)
      .get()

    return result.data
  }

  static async update(id: string, updates: Partial<CreateTransactionInput>) {
    await db
      .collection('transactions')
      .doc(id)
      .update({
        data: {
          ...updates,
          updatedAt: new Date().toISOString(),
        },
      })
  }

  static async delete(id: string) {
    await db.collection('transactions').doc(id).remove()
  }

  static async getMonthlyTransactions(year: number, month: number) {
    const startDate = dayjs(`${year}-${month}-01`).format('YYYY-MM-DD')
    const endDate = dayjs(startDate).endOf('month').format('YYYY-MM-DD')

    const result = await db
      .collection('transactions')
      .where({
        date: db.command.gte(startDate).and(db.command.lte(endDate)),
      })
      .get()

    return result.data
  }
}
```

---

## Step 8: Development Workflow

### 8.1 Run Development Server

**For WeChat Mini-Program**:
```bash
npm run dev:weapp
```

This builds to `dist/` folder. Then:
1. Open **WeChat DevTools**
2. Import project → select `dist/` directory
3. Use your AppID or test mode

**For H5 (Web)**:
```bash
npm run dev:h5
```

Opens at `http://localhost:10086`

---

### 8.2 Hot Reload

Both commands support hot reload. Edit files in `src/` and see changes instantly.

---

### 8.3 Debugging

**WeChat DevTools**:
- Use built-in **Console**, **Network**, **Storage** tabs
- Set breakpoints in **Sources** tab

**H5**:
- Use browser DevTools (Chrome/Firefox)

---

## Step 9: Testing Setup

### 9.1 Configure Jest

Create `jest.config.js`:
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '@tarojs/taro': '<rootDir>/__mocks__/taro.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app.config.ts',
  ],
}
```

Create `jest.setup.js`:
```javascript
import '@testing-library/jest-dom'
```

---

### 9.2 Mock Taro APIs

Create `__mocks__/taro.ts`:
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
  showToast: jest.fn(),
  navigateTo: jest.fn(),
  cloud: {
    init: jest.fn(),
    database: jest.fn(() => ({
      collection: jest.fn(() => ({
        add: jest.fn(),
        get: jest.fn(),
        doc: jest.fn(() => ({
          update: jest.fn(),
          remove: jest.fn(),
        })),
      })),
    })),
  },
}
```

---

### 9.3 Add Test Scripts

Update `package.json`:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

### 9.4 Example Test

Create `src/utils/__tests__/currency.test.ts`:
```typescript
import { formatCurrency } from '../currency'

describe('Currency Formatting', () => {
  it('should format CNY correctly', () => {
    expect(formatCurrency(1234.56)).toBe('¥1,234.56')
  })

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('¥0.00')
  })
})
```

Run tests:
```bash
npm test
```

---

## Step 10: Build for Production

### 10.1 WeChat Mini-Program

```bash
npm run build:weapp
```

**Output**: `dist/` folder

**Upload to WeChat**:
1. Open WeChat DevTools
2. Click **Upload** button
3. Enter version number and description
4. Submit for review in WeChat MP Admin

---

### 10.2 H5 (Web)

```bash
npm run build:h5
```

**Output**: `dist/` folder (static files)

Deploy to any static hosting (Vercel, Netlify, Cloudflare Pages, etc.)

---

## Step 11: Integration with ECharts (Optional)

For trend charts, integrate ECharts:

### 11.1 Download echarts-for-weixin

```bash
# Download from GitHub
# https://github.com/ecomfe/echarts-for-weixin
# Copy ec-canvas folder to src/components/
```

---

### 11.2 Use in Component

```typescript
// src/pages/trends/index.tsx
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import * as echarts from '../../components/ec-canvas/echarts'

export default function Trends() {
  const initChart = (canvas, width, height, dpr) => {
    const chart = echarts.init(canvas, null, {
      width,
      height,
      devicePixelRatio: dpr,
    })

    chart.setOption({
      series: [
        {
          type: 'pie',
          data: [
            { value: 1200, name: '餐饮' },
            { value: 800, name: '交通' },
          ],
        },
      ],
    })

    return chart
  }

  return (
    <View className="p-4">
      <ec-canvas id="chart" canvas-id="chart" ec={{ onInit: initChart }} />
    </View>
  )
}
```

---

## Troubleshooting

### Issue: Tailwind classes not working in mini-program

**Solution**: Ensure `corePlugins.preflight: false` in `tailwind.config.js` and check `selectorBlackList` in Taro config.

---

### Issue: WeChat Cloud not initialized

**Solution**: Verify Environment ID in `app.ts` and ensure cloud development is enabled in WeChat DevTools.

---

### Issue: Storage quota exceeded

**Solution**: Implement data pagination and consider using cloud database instead of local storage for large datasets.

---

## Next Steps

1. **Implement Core Features**:
   - Transaction CRUD pages
   - Balance summary dashboard
   - Trend visualization
   - Category management

2. **Add Advanced Features**:
   - Budget tracking
   - Export to CSV/Excel
   - Data backup/restore
   - Multi-device sync (via cloud DB)

3. **Optimize Performance**:
   - Implement virtual scrolling for long lists
   - Lazy load chart libraries
   - Optimize bundle size with code splitting

4. **Testing**:
   - Write unit tests for services
   - Add component tests
   - E2E testing for critical flows

5. **Deployment**:
   - Submit to WeChat for review
   - Monitor user feedback
   - Iterate based on analytics

---

## Resources

- **Taro Docs**: https://taro-docs.jd.com/
- **WeChat Mini-Program Docs**: https://developers.weixin.qq.com/miniprogram/dev/framework/
- **TailwindCSS Docs**: https://tailwindcss.com/docs
- **Zustand Docs**: https://github.com/pmndrs/zustand
- **ECharts Docs**: https://echarts.apache.org/

---

## Support

For issues or questions:
- Check Taro GitHub Issues
- WeChat Developer Community
- Project README and documentation

**Happy Coding! 🚀**
