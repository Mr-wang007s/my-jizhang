# Data Model: 个人记账与消费趋势统计

**Feature**: 001-personal-budgeting
**Date**: 2025-11-20

本文件描述本地 SQLite 中与个人记账功能相关的核心实体、字段和关系，为后续实现和测试提供数据层约束。

## 1. 实体概览

- Transaction（记账条目）
- Category（分类）
- Metadata（元数据/配置）

## 2. Transaction（记账条目）

表示一笔收入或支出，用于账单列表、汇总和消费趋势统计。

### 字段

- `id`（INTEGER, PRIMARY KEY, AUTOINCREMENT）
  - 唯一标识一条记账记录。
- `amount`（REAL, NOT NULL）
  - 记账金额，正数表示实际金额大小。
- `type`（TEXT, NOT NULL）
  - 收支类型，取值约束：`"income"` 或 `"expense"`。
- `date`（TEXT, NOT NULL）
  - 交易日期时间，建议使用 ISO 8601 字符串（如 `2025-11-20T09:30:00Z` 或本地时间）。
- `category_id`（INTEGER, NOT NULL）
  - 外键，关联到 `Category.id`，用于统计时按分类聚合。
- `note`（TEXT, NULL）
  - 备注，记录该笔流水的补充说明。
- `created_at`（TEXT, NOT NULL）
  - 记录创建时间。
- `updated_at`（TEXT, NOT NULL）
  - 最近一次修改时间。

### 约束与校验

- `amount` 必须大于等于 0。
- `type` 仅允许 `income` 或 `expense`，不接受其他字符串。
- `date`、`created_at`、`updated_at` 必须是可解析的日期时间字符串。
- `category_id` 必须指向一个存在的 `Category` 记录。

### 索引建议

- 索引：`idx_transaction_date`（`date`）
  - 用于时间范围筛选与排序。
- 索引：`idx_transaction_type`（`type`）
  - 用于按收入/支出筛选。
- 索引：`idx_transaction_category`（`category_id`）
  - 用于按分类统计支出占比。

## 3. Category（分类）

用于对收入和支出进行分组（如「工资」「餐饮」「交通」等）。

### 字段

- `id`（INTEGER, PRIMARY KEY, AUTOINCREMENT）
  - 唯一标识一个分类。
- `name`（TEXT, NOT NULL, UNIQUE）
  - 分类名称，例如 "工资"、"餐饮"、"交通" 等。
- `type` (TEXT, NOT NULL)
  - 分类适用的类型：`"income"`、`"expense"` 或 `"both"`。
- `icon`（TEXT, NULL）
  - 可选的图标标识，用于前端展示（如图标名称或 key）。
- `created_at`（TEXT, NOT NULL）
- `updated_at`（TEXT, NOT NULL）

### 约束与校验

- `name` 不得为空，且在全表中唯一。
- `type` 仅允许 `income`、`expense` 或 `both`。

### 关系

- 一个 `Category` 可以关联多条 `Transaction` 记录。

## 4. Metadata（元数据/配置）

用于存储部分应用配置与统计视图偏好等，不直接参与财务计算，但会影响展示和用户体验。

### 字段（示例）

- `key`（TEXT, PRIMARY KEY）
  - 元数据键名，如 `"default_time_range"`、`"default_view"` 等。
- `value`（TEXT, NOT NULL）
  - 元数据值，按 JSON 字符串或简单文本保存。

### 可能的键值

- `default_time_range`
  - 默认时间范围，例如 `"this_month"`、`"last_30_days"`。
- `default_analytics_view`
  - 默认趋势视图，例如 `"monthly_expense_trend"`、`"category_distribution"`。

## 5. 状态与流程

### 新增记账

1. 用户在 UI 中输入金额、选择类型、日期和分类，可选填写备注。
2. 前端校验：金额非负，字段完整，日期合法。
3. 将数据写入 `Transaction` 表，自动填充 `created_at` 和 `updated_at`。
4. 刷新当前时间范围的列表和汇总视图。

### 编辑/删除记账

- 编辑：
  - 更新对应 `Transaction` 记录的字段，刷新 `updated_at`。
  - 刷新列表、汇总和趋势统计，确保结果与修改后的数据一致。
- 删除：
  - 删除 `Transaction` 记录，或标记为已删除（视实现策略而定）。
  - 再次计算汇总和趋势。

### 消费趋势统计

- 按时间维度（如按月）聚合 `Transaction`：
  - 过滤 `type = 'expense'` 的记录。
  - 按 `strftime` 或等价方式切片时间，求和 `amount`。
- 按分类统计支出占比：
  - 过滤 `type = 'expense'`。
  - 按 `category_id` 分组求和 `amount`，并与总支出比较。

## 6. 与需求的对应关系

- FR-001：通过 `Transaction` 表的基础字段支持收入/支出的完整记录。
- FR-002：通过 `date`、`type` 和相关索引支持按时间范围和类型浏览列表。
- FR-003：通过对 `Transaction` 的聚合查询，计算总收入、总支出和结余。
- FR-004：基于 `Transaction` + `Category` 的聚合计算，提供时间趋势和分类占比统计。
- FR-005：支持对 `Transaction` 记录的更新和删除操作，并通过重新查询实现即时更新。
