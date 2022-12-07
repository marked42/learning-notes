# Clean Architecture

## Humble Object Pattern

根据可测试性，将容易测试的部分和难测试的部分分开，形成明显的边界（boundary）

Presenter -> View (Humble Object)
Database gateway -> DataBase (Humble Object)

## 系统设计策略

怎么在高成本整洁架构与不过度设计中寻找平衡，渐进式的策略。

1. 一开始不注意架构设计的话，后续添加成本很高
1. YAGNI you aren't going to need it. 设计、实现组件边界成本很高

系统是不断变化的，根据变化的趋势不断调整组件与边界。

But this is not a one-time decision. You don’t simply decide at the start of a project which boundaries to implement and which to ignore. Rather, you watch. You pay attention as the system evolves. You note where boundaries may be required, and then carefully watch for the first inkling of friction because those boundaries don’t exist.
At that point, you weigh the costs of implementing those boundaries versus the cost of ignoring them—and you review that decision frequently. Your goal is to implement the boundaries right at the inflection point where the cost of implementing becomes less than the cost of ignoring.
It takes a watchful eye.

## Partial Boundary

One way to construct a partial boundary is to do all the work necessary to create independently compilable and deployable components, and then simply keep them together in the same component. The reciprocal interfaces are there, the input/output data structures are there, and everything is all set up—but we compile and deploy all of them as a single component.

做好分层分模块设计，但是暂时仍然作为整个组件发布。

1. Skip Last Step
1. One-Dimensional Boundaries
1. Facades

## Layers and Boundaries 25

1. Hunt The Wumpus 用这个例子分析，如何拆分模块，定义边界
