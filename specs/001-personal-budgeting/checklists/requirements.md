# Requirements Quality Checklist: 个人记账与消费趋势统计

**Purpose**: 轻量级自检，确保“记一笔、看账单、看趋势”及相关非功能要求的书写完整、清晰、一致。  
**Created**: 2025-11-20  
**Feature**: ../spec.md

## Requirement Completeness

- [ ] CHK001 是否在 FR-001 中列出新增记账所需的全部字段、校验和失败提示？[Completeness, Spec §FR-001]
- [ ] CHK002 是否确保所有核心操作（新增、筛选、汇总、趋势、编辑/删除）在 FR-001~FR-005 中逐一说明输入、输出与约束？[Completeness, Spec §Requirements]
- [ ] CHK003 列表/筛选需求是否覆盖默认时间范围、本月、自定义范围及收入/支出切换？[Completeness, Spec §User Story 2 & §FR-002]
- [ ] CHK004 消费趋势需求是否明确包含按月趋势与按分类分布两种视图及其数据来源？[Completeness, Spec §User Story 3 & §FR-004]
- [ ] CHK005 非功能目标（性能、缺陷零容忍、用户满意度）是否在成功准则/假设中给出并可追溯？[Completeness, Spec §Success Criteria & §Assumptions]

## Requirement Clarity

- [ ] CHK006 “在列表顶部或明显位置”是否提供可验证的排序/展示规则（例如日期倒序，若同日则按创建时间）？[Clarity, Spec §User Story 1]
- [ ] CHK007 “快速记录”与“30 秒内完成”之间的步骤、触点或约束是否写清楚？[Clarity, Spec §User Story 1 & §SC-001]
- [ ] CHK008 汇总视图中“总收入/总支出/结余”的计算口径、单位、显示格式是否定义？[Clarity, Spec §FR-003]

## Requirement Consistency

- [ ] CHK009 User Stories 1–3 是否与 FR-001~FR-005 完全映射，无重复或缺失的动作？[Consistency, Spec §User Stories + §FR]
- [ ] CHK010 假设（单用户、单币种、长期保留）是否与任何用户故事或成功准则产生冲突？[Consistency, Spec §Assumptions]

## Acceptance Criteria Quality

- [ ] CHK011 SC-001~SC-005 是否都提供可执行的量化指标及验证方法（含样本或测试类型）？[Acceptance Criteria, Spec §Success Criteria]

## Scenario Coverage

- [ ] CHK012 是否描述筛选切换、趋势视图切换、编辑/删除后刷新等非主路径场景的期望行为？[Coverage, Spec §User Stories 2/3 & §FR-005]

## Edge Case Coverage

- [ ] CHK013 Edge Cases 是否覆盖无数据、极端金额、频繁操作等情况，并说明界面反馈？[Edge Case Coverage, Spec §Edge Cases]
- [ ] CHK014 是否记录编辑/删除冲突、撤销策略或至少标明缺失？[Edge Case Coverage, Spec §FR-005]

## Non-Functional Requirements

- [ ] CHK015 性能（如 2 秒刷新）、可用性/可访问性指标是否定义度量或数据收集方式？[Non-Functional, Spec §Success Criteria]

## Dependencies & Assumptions

- [ ] CHK016 SQLite、本地分类种子、Taro/Tailwind 依赖是否在 plan.md/data-model.md 中记录，并在 spec 中引用或假设？[Dependency, Plan §Technical Context + Spec §Assumptions]

## Ambiguities & Conflicts

- [ ] CHK017 “至少 5 名体验用户 80% 满意”是否阐明抽样方式、问卷/访谈方法以及如何统计？[Ambiguity, Spec §SC-005]
