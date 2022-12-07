# Clean Architecture

## Humble Object Pattern

根据可测试性，将容易测试的部分和难测试的部分分开，形成明显的边界（boundary）

Presenter -> View (Humble Object)
Database gateway -> DataBase (Humble Object)

## Partial Boundary

怎么在高成本整洁架构与不过度设计中寻找平衡，渐进式的策略。

One way to construct a partial boundary is to do all the work necessary to create independently compilable and deployable components, and then simply keep them together in the same component. The reciprocal interfaces are there, the input/output data structures are there, and everything is all set up—but we compile and deploy all of them as a single component.

做好分层分模块设计，但是暂时仍然作为整个组件发布。

1. Skip Last Step
1. One-Dimensional Boundaries
1. Facades
