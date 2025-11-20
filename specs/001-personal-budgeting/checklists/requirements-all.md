# Requirements Quality Checklist: 个人记账与消费趋势统计（全量）

**Purpose**: 针对规范全部内容（记一笔、看账单、看趋势 + 非功能要求）做轻量级自检，确认需求写作质量。  
**Created**: 2025-11-20  
**Feature**: ../spec.md

## Requirement Completeness

- [ ] CHK001 是否为所有核心操作（新增、浏览/筛选、汇总、趋势、编辑/删除）在 FR-001~FR-005 中逐一列出输入/输出与约束？[Completeness, Spec §Requirements]
- [ ] CHK002 是否对非功能目标（性能、缺陷零容忍、用户满意度）在成功准则或假设中都有对应描述？[Completeness, Spec §Success Criteria & Assumptions]

## Requirement Clarity

- [ ] CHK003 “在列表顶部或明显位置”是否提供可验证的排序/展示规则？[Clarity, Spec §User Story 1]
- [ ] CHK004 “快速记录”与“30 秒内”之间的关系是否在文档中明确（步骤/触点）？[Clarity, Spec §User Story 1 & §SC-001]

## Requirement Consistency

- [ ] CHK005 User Stories 与 FR-001~FR-005 的映射是否一一对应且无遗漏或冲突？[Consistency, Spec §User Stories + §FR]
- [ ] CHK006 假设（单用户、单币种、长期保留）是否与任何用户故事或成功准则出现矛盾？[Consistency, Spec §Assumptions]

## Acceptance Criteria Quality

- [ ] CHK007 是否为每个成功准则（SC-001~SC-005）提供可执行的量化指标与验证方式？[Acceptance Criteria, Spec §Success Criteria]

## Scenario Coverage

- [ ] CHK008 是否覆盖主流程之外的筛选切换、趋势视图切换、编辑/删除后的即时刷新等场景？[Coverage, Spec §User Stories 2/3 + §FR-005]

## Edge Case Coverage

- [ ] CHK009 Edge Cases 是否包含无数据、极端金额、频繁操作外，还需明确编辑/删除冲突或撤销策略？[Edge Case Coverage, Spec §Edge Cases]

## Non-Functional Requirements

- [ ] CHK010 是否定义了性能预算（如 2 秒刷新）与可用性/可访问性要求的度量或收集手段？[Non-Functional, Spec §Success Criteria & User Story notes]

## Dependencies & Assumptions

- [ ] CHK011 与本地 SQLite、分类种子数据等依赖是否记录在 plan.md/data-model.md，并在 spec 中引用或声明？[Dependency, Plan §Technical Context + Spec §Assumptions]

## Ambiguities & Conflicts

- [ ] CHK012 “至少 5 名体验用户 80% 满意”是否阐明抽样与统计方法，避免结论无法重复？[Ambiguity, Spec §SC-005]
