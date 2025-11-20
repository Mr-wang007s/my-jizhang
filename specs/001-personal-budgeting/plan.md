# Implementation Plan: 个人记账与消费趋势统计

**Branch**: `001-personal-budgeting` | **Date**: 2025-11-20 | **Spec**: ./spec.md
**Input**: Feature specification from `./spec.md`

**Note**: This plan is generated from the template by `/speckit.plan` semantics, adapted for the My Jizhang project.

## Summary

个人记账项目，支持记录收入和支出，并基于这些数据提供账单列表汇总和消费趋势统计。
核心用户价值：
- 快速记录日常收支，形成完整的个人账本。
- 按时间范围查看明细和汇总，理解在某段时间内的收支情况。
- 通过趋势和分类统计发现消费模式，为后续理性消费提供依据。

技术上，本项目基于最新版本的 Taro + Tailwind CSS 构建前端界面，元数据存储在本地 SQLite 数据库中，用于持久化记账记录和相关配置。

## Technical Context

**Language/Version**: TypeScript + Taro@latest  
**Primary Dependencies**: Taro, React, Tailwind CSS, SQLite (通过 Taro/小程序或跨端支持的 SQLite 访问方案)  
**Storage**: 本地 SQLite 数据库存储记账记录、分类和必要的元数据  
**Testing**: Jest + React Testing Library，用于单元与组件测试；后续可在需要时补充适配 Taro 的端到端测试工具。  
**Target Platform**: 主要面向 Taro 支持的平台（如小程序/移动端/浏览器），初始重点平台需在后续研究中确认  
**Project Type**: mobile 风格的前端应用（通过 Taro 单仓库实现多端）  
**Performance Goals**: 
- App 冷启动在主目标设备上的可接受范围内（初步目标：< 2 秒进入主页面）。
- 主账单列表在最多 1000 条记录下切换时间筛选时 2 秒内完成刷新（与 SC-002 保持一致）。  
**Constraints**: 
- 在性能敏感路径（新增记账、打开账单列表、查看趋势图）中避免不必要的多次渲染和重复查询。
- SQLite 查询需合理加索引，避免列表滚动或筛选时出现明显卡顿。  
**Scale/Scope**: 日常个人使用场景，每月记录量以数百至一两千条为主，数据在本地持久化为主，不要求大规模多用户并发。

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Code Quality:
  - 采用 TypeScript + Taro，前端代码按页面/组件/服务划分，保持小而清晰的模块。
  - 计划引入基础的 lint 规则（如 ESLint + TypeScript 规则）和统一的代码风格配置，避免新增高严重度静态检查问题。

- Testing:
  - 针对关键路径（新增/编辑/删除记账、查看账单列表与汇总、查看消费趋势）设计对应的自动化测试。
  - 单元测试覆盖核心计算逻辑（汇总与趋势统计），集成/端到端测试覆盖主用户流程。

- UX Consistency:
  - 所有与记账相关的页面遵守统一的信息架构和视觉风格（Taro + Tailwind 组件方案）。
  - 用统一术语展示概念（如「收入」「支出」「分类」「账单」等），不同页面之间交互方式保持一致。

- Performance:
  - 在设计阶段即考虑 SQLite 查询结构和前端渲染方式，减少重复计算和不必要的网络/存储操作。
  - 针对大数据量列表和趋势视图评估渲染方案，必要时采用懒加载或分页展示。

当前计划没有刻意违背宪章中关于代码质量、测试、UX 和性能的原则。如后续发现需要权衡（例如为了支持某特殊平台必须降低部分测试覆盖），将在 "Complexity Tracking" 中记录偏离原因和补救方案。Phase 1（research、data-model、contracts、quickstart）完成后复核，当前设计仍满足以上质量、测试、UX 和性能门槛，无需记录额外违规项。

## Project Structure

### Documentation (this feature)

```text
specs/001-personal-budgeting/
├── plan.md              # 规划与设计说明（本文件）
├── research.md          # Phase 0 输出：技术与方案调研结论
├── data-model.md        # Phase 1 输出：数据模型与实体关系
├── quickstart.md        # Phase 1 输出：快速上手和主要用户流程
├── contracts/           # Phase 1 输出：前端-存储/接口契约（如数据访问封装）
└── tasks.md             # Phase 2 输出：实现任务拆分（由 /speckit.tasks 生成）
```

### Source Code (repository root)

```text
src/
├── pages/               # Taro 页面（首页、记账页、趋势页等）
├── components/          # 通用 UI 组件（表单、图表封装、布局等）
├── services/            # 业务服务层（记账 CRUD、统计与趋势计算）
├── storage/             # SQLite 访问封装与仓储实现
└── styles/              # Tailwind 配置与全局样式扩展

tests/
├── unit/                # 单元测试（统计、聚合、数据处理逻辑）
├── integration/         # 集成测试（页面与服务层交互）
└── e2e/                 # 端到端测试（核心用户流程）
```

**Structure Decision**: 
- 采用单仓库单应用结构，由 Taro 负责多端构建。
- 通过 `pages/` + `components/` + `services/` + `storage/` 的分层方式，将 UI、业务逻辑和数据访问解耦，易于维护与测试。

## Complexity Tracking

> Fill ONLY if Constitution Check has violations that must be justified.

当前规划阶段未主动引入违背宪章的复杂度或额外项目结构，保留此表以备后续需要记录特例时使用。
