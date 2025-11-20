# Requirements Quality Checklist: 个人记账与消费趋势统计

**Purpose**: Unit-test the written requirements ("记一笔、看账单、看趋势") for completeness, clarity, and consistency before downstream work.
**Created**: 2025-11-20
**Feature**: ../spec.md

## Requirement Completeness

- [ ] CHK001 Are all mandatory字段/校验 for新增记账（金额、类型、日期、分类、备注、校验规则）完整列出？[Completeness, Spec §FR-001]
- [ ] CHK002 Are列表/筛选需求覆盖默认时间范围、本月、自定义范围及收入/支出切换？[Completeness, Spec §User Story 2 & §FR-002]
- [ ] CHK003 Do消费趋势需求明确包含按月趋势与按分类分布两个统计视图及所需输入数据？[Completeness, Spec §User Story 3 & §FR-004]

## Requirement Clarity

- [ ] CHK004 Is“快速记录”在时长或步骤上有可测定义（例如 ≤30 秒或具体步骤数）以支撑 SC-001？[Clarity, Spec §User Story 1 & §SC-001]
- [ ] CHK005 Is“列表顶部或明显位置”对新增条目的展示位置有明确描述（排序/位置规则）？[Ambiguity, Spec §User Story 1]
- [ ] CHK006 Are汇总视图中“总收入/总支出/结余”的计算口径、单位与显示格式明确？[Clarity, Spec §FR-003]

## Requirement Consistency

- [ ] CHK007 Do User Stories 1–3 map一致到 FR-001~FR-005（无遗漏操作或重复定义）？[Consistency, Spec §User Stories & §FR]
- [ ] CHK008 Are假设（单用户、单币种、长期保留）与其它需求无冲突（例如未隐含共享/多币种场景）？[Consistency, Spec §Assumptions]

## Acceptance Criteria Quality

- [ ] CHK009 Are成功准则覆盖三大主流程（新增、列表、趋势）并具备量化指标（例如 SC-002/SC-004/SC-005）？[Measurability, Spec §SC-002~SC-005]

## Scenario Coverage

- [ ] CHK010 Do requirements for每个流程描述零数据、极端金额、频繁操作等异常场景的预期表现？[Coverage, Spec §Edge Cases]

## Edge Case Coverage

- [ ] CHK011 Are修改/删除条目时的约束（并发编辑、撤销策略）在需求层面给出或标注缺失？[Gap, Spec §FR-005]

## Ambiguities & Conflicts

- [ ] CHK012 Is“至少 5 名体验用户 80% 满意”说明了评价方式与样本选择，避免统计歧义？[Ambiguity, Spec §SC-005]
