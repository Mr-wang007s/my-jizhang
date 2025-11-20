# Research: 个人记账与消费趋势统计

**Feature**: 001-personal-budgeting
**Date**: 2025-11-20

本研究文档用于支撑实现计划中的技术选择与 "NEEDS CLARIFICATION" 的决策，确保最终方案符合项目宪章中关于代码质量、测试、用户体验和性能的要求。

## 1. 技术背景与已知条件

- 前端框架：Taro@最新版（基于 React 的多端框架）。
- 样式方案：Tailwind CSS，用于构建一致且可复用的 UI 组件样式。
- 数据存储：本地 SQLite 数据库，用于持久化记账记录、分类和少量元数据。

以上三者为既定技术约束，本研究重点在于：
- 如何在 Taro 环境中合理组织代码和状态，以支持记账和统计场景。
- 如何使用 SQLite 存储和查询个人账本数据，同时保证性能与可靠性。
- 如何选取合适的测试框架和策略，覆盖关键业务流程。

## 2. 需要澄清的问题（NEEDS CLARIFICATION 来源）

### 2.1 测试框架选择

原计划中的 Technical Context 中存在：
- "[NEEDS CLARIFICATION: 计划使用的测试框架尚未确定，例如 Jest + React Testing Library 或 Taro 官方推荐方案]"。

**问题**：在 Taro + React 项目中，应采用何种测试栈，既能方便地对组件和业务逻辑进行测试，又能在 CI 中稳定运行？

## 3. 研究任务

### 3.1 测试框架的选择

Task: "Research testing frameworks for Taro + React + TypeScript personal bookkeeping app"

- 目标：
  - 找到在 Taro 项目中实践较多、社区支持良好的测试框架组合。
  - 支持单元测试与组件测试，未来可以扩展到端到端测试。

- 参考方向：
  - Taro 官方文档或社区示例中推荐的测试工具（通常基于 Jest）。
  - React 生态中常见的组件测试方案（如 React Testing Library）。

## 4. 研究结论与决策

### 决策 1：测试框架栈

- **Decision**: 使用 Jest + React Testing Library 作为主要测试栈，配合 Taro 适配配置，用于单元与组件测试；后续如需可引入适合 Taro 环境的端到端测试工具。

- **Rationale**:
  - Jest 在 TypeScript + React 场景下成熟度高，生态丰富，文档和社区案例充足。
  - React Testing Library 提倡以用户视角测试组件行为，与本项目强调的用户体验一致性相契合。
  - Taro 社区示例中广泛采用 Jest 进行测试，配置成本相对较低。

- **Alternatives considered**:
  - 方案 A：仅使用 Jest（不加 React Testing Library），通过浅渲染工具测试组件。
    - 缺点：更容易陷入实现细节测试，难以体现真实用户交互，违背「从用户视角」的测试原则。
  - 方案 B：使用 Cypress 或类似工具优先进行端到端测试。
    - 优点：更贴近真实使用环境。
    - 缺点：在当前早期阶段，端到端测试搭建成本相对较高，且 Taro 多端环境下调试门槛较大，更适合作为后续补充，而非首选主栈。

### 决策 2：SQLite 使用策略（概要）

虽然原 Technical Context 没有明确 NEEDS CLARIFICATION，但结合性能和数据可靠性，给出初步策略：

- **Decision**: 使用统一的本地 SQLite 数据表结构存储所有记账记录和分类数据，针对常用查询（按时间、按分类、按类型）建立必要索引。

- **Rationale**:
  - 个人记账场景下数据量相对有限（每月数百到一两千条），SQLite 在本地完全能满足读写性能要求。
  - 通过合理设计索引（如日期、类型、分类 ID），可以在查询账单列表和消费趋势统计时保持较好的响应时间。

- **Alternatives considered**:
  - 使用浏览器/localStorage 或小程序本地 KV 存储。
    - 缺点：难以高效进行复杂查询和聚合计算，随着数据量增长性能会迅速下降。
  - 使用远程云端数据库。
    - 缺点：增加网络依赖和同步复杂度，与当前 "本地 SQLite" 的前提不符。

## 5. 结论

- 所有在 Technical Context 中标记的测试框架相关 "NEEDS CLARIFICATION" 已通过本研究决策为：
  - 测试工具：Jest + React Testing Library。
- 本文档中确立了 SQLite 使用的基本策略，有利于后续的数据模型和契约设计。

后续设计（data-model.md、contracts/、quickstart.md）将在本研究结论基础上展开，确保与项目宪章关于代码质量、测试覆盖、UX 一致性和性能目标的要求保持一致。
