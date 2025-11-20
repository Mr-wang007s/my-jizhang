# Contracts: 个人记账与消费趋势统计

本目录用于描述前端与本地 SQLite 存储之间的数据访问契约。由于本项目当前主要为前端 + 本地数据库形态，不涉及远程 HTTP API，本阶段采用文本形式说明代替 OpenAPI。

## 1. 数据访问服务约定

### 1.1 TransactionService 契约（概念层）

- `listTransactions(filter)`
  - 输入：时间范围（起止日期）、类型（收入/支出/全部）、可选分类。
  - 输出：符合条件的 `Transaction` 列表，按日期倒序排序。

- `createTransaction(payload)`
  - 输入：金额、类型、日期、分类、备注。
  - 输出：创建成功的 `Transaction` 对象（含 id）。

- `updateTransaction(id, payload)`
  - 输入：记录 id 及需更新字段。
  - 输出：更新后的 `Transaction` 对象。

- `deleteTransaction(id)`
  - 输入：记录 id。
  - 输出：删除结果（成功/失败）。

### 1.2 AnalyticsService 契约（概念层）

- `getSummary(timeRange)`
  - 输入：时间范围。
  - 输出：该范围内的总收入、总支出和结余。

- `getExpenseTrendByMonth(timeRange)`
  - 输入：时间范围（通常为多个月）。
  - 输出：按月份聚合的支出列表（月份 + 金额）。

- `getExpenseDistributionByCategory(timeRange)`
  - 输入：时间范围。
  - 输出：按分类聚合的支出金额和占比。

## 2. 注意事项

- 所有金额在契约层面使用相同币种，具体符号和格式在 UI 层处理。
- 所有日期在契约层面使用可解析的字符串，建议统一为 ISO 8601 格式。
- 错误与异常处理（如数据库访问失败）应在服务层标准化，向上暴露为可辨识的错误码或状态。