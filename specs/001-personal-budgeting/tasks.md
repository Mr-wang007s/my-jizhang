---

description: "Task list for个人记账与消费趋势统计"
---

# Tasks: 个人记账与消费趋势统计

**Input**: Design documents from `/specs/001-personal-budgeting/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: 关键路径（新增/编辑/删除记账、账单筛选与汇总、趋势与分类统计）要求具备自动化测试，因此各用户故事阶段都包含针对服务与组件的测试任务。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story while preserving UX和性能要求。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- 单项目：源代码位于 `src/`，测试位于 `tests/`
- 多端页面：`src/pages/<page>/index.tsx`
- 组件：`src/components/<component>/`
- 服务：`src/services/<service>.ts`
- 存储层：`src/storage/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 初始化 Taro + Tailwind + SQLite 工程骨架。

- [ ] T001 创建 Taro 项目结构并建立 `src/pages`, `src/components`, `src/services`, `src/storage`, `src/styles` 目录（`/data/workspace/my-jizhang/src/`).
- [ ] T002 在 `package.json` 中添加 Taro@latest、React、Tailwind CSS、sqlite 插件等依赖并运行安装。
- [ ] T003 配置 `tailwind.config.js` 与 `src/styles/tailwind.css` 以启用全局样式与自定义主题。
- [ ] T004 配置 ESLint/Prettier/TypeScript（`.eslintrc.js`, `.prettierrc`, `tsconfig.json`）以满足代码质量原则。
- [ ] T005 设置 Jest + React Testing Library（`jest.config.ts`, `tests/setup.ts`）覆盖前端组件和服务测试。
- [ ] T006 配置 Taro 应用入口与路由（`src/app.config.ts`, `src/app.tsx`）并注册首页、记账页、账单页、统计页。

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 建立共享的数据访问、状态管理与基础组件，所有用户故事依赖此阶段成果。

- [ ] T007 在 `src/storage/sqlite.ts` 实现 SQLite 适配器（初始化、连接、错误处理）。
- [ ] T008 创建迁移脚本 `src/storage/migrations/001_init.sql` 定义 Transaction/Category/Metadata 表结构及索引。
- [ ] T009 实现仓储层 `src/storage/repositories/transactionRepository.ts` 与 `src/storage/repositories/categoryRepository.ts`。
- [ ] T010 在 `src/storage/seed.ts` 编写默认分类种子逻辑并于应用启动时执行。
- [ ] T011 构建全局状态/数据同步模块 `src/services/state/ledgerStore.ts`（缓存、订阅、失效策略）。
- [ ] T012 创建共享表单组件（金额输入、类型切换、分类选择）于 `src/components/form-controls/` 并提供 Tailwind 样式。

**Checkpoint**: SQLite、仓储、全局状态与基础 UI 组件就绪后方可进入用户故事开发。

---

## Phase 3: User Story 1 - 快速记录日常收支 (Priority: P1) 🎯 MVP

**Goal**: 用户可在 30 秒内完成新增收入/支出并立即看到记录。

**Independent Test**: 仅完成本阶段即可完成“新增并查看最新记录”闭环。

### Tests for User Story 1

> 写测试优先，确保核心服务/组件具备覆盖。

- [ ] T013 [P] [US1] 为 `src/services/transactionService.ts` 编写单元测试（`tests/unit/services/transactionService.spec.ts`）。
- [ ] T014 [P] [US1] 为 `src/components/transaction-form/index.tsx` 编写组件测试（`tests/unit/components/transaction-form.spec.tsx`）。

### Implementation for User Story 1

- [ ] T015 [P] [US1] 实现 `src/services/transactionService.ts`（创建、验证、持久化和错误映射）。
- [ ] T016 [P] [US1] 完成 `src/components/transaction-form/index.tsx`（字段、校验、Tailwind 样式、Loading/Error 状态）。
- [ ] T017 [US1] 开发记账页面 `src/pages/record/index.tsx`，集成 TransactionForm 与状态刷新。
- [ ] T018 [US1] 更新首页概览 `src/pages/home/index.tsx` 以展示最新记录（含“明显位置”排序规则）。
- [ ] T019 [US1] 在 `src/components/transaction-form/index.tsx` 中实现错误提示、无障碍标签及成功反馈。

**Checkpoint**: 记账表单和首页列表可验证地展示新记录。

---

## Phase 4: User Story 2 - 查看账单列表与汇总 (Priority: P2)

**Goal**: 用户可按时间/类型筛选账单并看到同步更新的汇总、结余。

**Independent Test**: 记录功能完成后，仅凭本阶段即可独立体验筛选与汇总。

### Tests for User Story 2

- [ ] T020 [P] [US2] 编写 `tests/unit/services/summaryService.spec.ts` 验证按时间/类型聚合结果。
- [ ] T021 [P] [US2] 编写 `tests/integration/ledger-filter.spec.ts` 覆盖筛选→列表→汇总更新流程。

### Implementation for User Story 2

- [ ] T022 [P] [US2] 实现 `src/services/summaryService.ts`（聚合查询、缓存、异常处理）。
- [ ] T023 [P] [US2] 构建账单列表页面 `src/pages/ledger/index.tsx`，含时间范围/类型筛选和倒序列表。
- [ ] T024 [US2] 实现记录详情与编辑/删除功能 `src/pages/ledger/detail.tsx` 并复用 TransactionForm。
- [ ] T025 [US2] 在 `src/pages/ledger/index.tsx` 添加空状态与“无记录”提示，确保 Edge Case 覆盖。
- [ ] T026 [US2] 实现汇总卡片组件 `src/components/summary-card/index.tsx` 显示总收入/总支出/结余。

**Checkpoint**: 用户可筛选账单并查看一致的汇总与编辑/删除效果。

---

## Phase 5: User Story 3 - 查看消费趋势统计 (Priority: P3)

**Goal**: 展示按月份和分类的消费趋势，帮助用户理解消费模式。

**Independent Test**: 在已有记录+列表功能基础上，仅本阶段即可交付趋势分析能力。

### Tests for User Story 3

- [ ] T027 [P] [US3] 编写 `tests/unit/services/analyticsService.spec.ts`，覆盖按月与按分类聚合逻辑。
- [ ] T028 [P] [US3] 编写 `tests/unit/components/trend-chart.spec.tsx`，验证图表组件数据映射与可访问性属性。

### Implementation for User Story 3

- [ ] T029 [P] [US3] 实现 `src/services/analyticsService.ts`（时间粒度切换、分类占比计算、缓存）。
- [ ] T030 [P] [US3] 创建图表组件 `src/components/charts/trend-chart.tsx` 与 `src/components/charts/distribution-chart.tsx`。
- [ ] T031 [US3] 开发财务趋势页面 `src/pages/analytics/index.tsx`，接入筛选器与双图表视图。
- [ ] T032 [US3] 在 `src/pages/analytics/index.tsx` 中实现时间范围与分类过滤器，联动 AnalyticsService。
- [ ] T033 [US3] 为 `src/components/charts/*` 增加可访问性描述、键盘导航与无数据状态。

**Checkpoint**: 趋势/分类图表可准确反映来自 SQLite 的数据并支持筛选。

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: 统一体验、性能与文档，收尾跨故事事项。

- [ ] T034 更新 `specs/001-personal-budgeting/quickstart.md`，补充最新界面截图与操作路径。
- [ ] T035 在 `src/services/metrics/perfTracker.ts` 添加关键操作（记账、筛选、趋势切换）的性能埋点。
- [ ] T036 编写可用性与可访问性审查记录 `specs/001-personal-budgeting/checklists/req-quality.md` 补充项并附结论。

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup** → 无依赖，完成后才能进入 Phase 2。
- **Phase 2 Foundational** → 依赖 Phase 1，完成后才能开始任何用户故事。
- **Phase 3/4/5（US1/US2/US3）** → 均依赖 Phase 2；US2 依赖 US1 的记录能力，US3 依赖 US2 的汇总数据正确性。
- **Polish Phase** → 所有用户故事完成后进行。

### User Story Dependencies

- **US1 (P1)**: 仅依赖 Phase 2，可独立交付 MVP。
- **US2 (P2)**: 依赖 US1 的数据写入能力，以便列表/汇总使用真实数据。
- **US3 (P3)**: 依赖 US2 的筛选/汇总逻辑，以保证趋势统计的准确输入。

### Parallel Opportunities

- Phase 1/2 中标记 [P] 的任务可由不同成员并行完成（如配置 vs. Tailwind vs. Jest）。
- US1/US2/US3 内部的 [P] 任务（服务实现、组件开发、测试）只要不在同一文件即可并行。
- 不同用户故事在完成各自依赖后也可并行推进，例如 US2 的汇总服务与 US3 的分析服务在数据层稳定后可并行。

### Parallel Example: User Story 1

```text
并行 1: T013 (服务单元测试) 与 T014 (组件测试)
并行 2: T015 (TransactionService) 与 T016 (TransactionForm) 在接口契约确定后并行
串联: T017/T018/T019 依赖服务与组件准备完成后再实现页面整合
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. 完成 Phase 1 + Phase 2。
2. 完成 US1（T013-T019）→ 可记录并查看最新账目。
3. 验证表单、存储、首页更新流程后即可小范围交付。

### Incremental Delivery

1. 在 MVP 基础上交付 US2，补齐筛选、汇总、编辑/删除能力。
2. 最后交付 US3 的趋势与分类分析，形成完整体验。
3. 每个阶段结束前确保相关测试全绿，避免累积风险。

### Parallel Team Strategy

- 开发者 A：聚焦服务层（SQLite 仓储、Transaction/Summary/Analytics Service）。
- 开发者 B：负责页面与组件（TransactionForm、Ledger、Analytics 页面）。
- 开发者 C：主导测试与性能/可访问性收尾任务。

---

## Notes

- [P] 任务 = 不同文件、无直接依赖，可并行。
- Story 标签将任务与用户故事绑定，方便追踪交付进度。
- 每个用户故事完成前需确保测试任务全部执行并通过。
- 在任何阶段如需新增依赖或跨故事共享逻辑，务必在 plan.md 与 tasks.md 中记录。