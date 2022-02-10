# 基本

## 原则（Principles）

1. DRY
1. 开闭原则 Open/Closed Principle. You can introduce new strategies without having to change the context.
1. SOLID 原则
1. 高内聚，低耦合
1. 设计的正交性
1. YAGNI You aren’t gonna need it 原则 overdesign
1. 最小权限原则，所有需要权限的地方，只给需要的最小权限。
1. 只读 immutable data，side-effect free

Implementation Patterns

三个核心概念

价值 Values
原则 Principle
模式 Pattern

## 代码味道（Code Smell）

Mysterious Name
Global Data/Singleton
Mutable Data

1. Bloaters
   1. Long Method
   1. Long Parameter List
1. Data Organization

   1. Large Class
   1. Primitive Obsession
   1. Data Clumps
   1. Data Class
   1. Temporary Field
   1. Lazy Element
   1. Combinatorial Explosion / Composition over Inheritance

1. Object-Orientation Abusers
   1. Alternative Classes with Different Interfaces
   1. Refused Bequest
   1. Temporary Field
   1. Repeated Switches
1. Change Preventers 违反高内聚原则

   1. Hierarchies

1. Dispensables
   1. Comments
   1. Duplicated Code/Combinatorial Explosion
   1. Dead Code
   1. Speculative Generality
1. Couplers 违反低耦合原则

   1. Features Envy
   1. Inappropriate Intimacy/Insider Trading 互相依赖私有成员
   1. Incomplete Library Class
   1. Middle Man/Message Chains
   1. Divergent Change 一个模块、类因为多个原因发生变化 Single Responsibility
   1. Shotgun Surgery 新增或者更新一个功能时，需要修改多个模块、类 这两个讲的是模块之间的的耦合关系

1. [Code Refactoring Learn Code Smells And Level Up Your code](https://www.bilibili.com/video/BV1Sz411q76F)

代码原则

1. 命名
1. 参数个数
1. 函数长度
1. 文件长度
1. 嵌套层数
1. 圈复杂度
1. 全局数据和不可变数据

## 重构

### 什么是重构

在不改变可观察行为的情况下，修改程序内部结构。

程序在开发之处不可避免的走向腐化，熵增原则，新增功能的成本越来越高，最终可能失败。

软件开发的两种方式

1. 在开发之处考虑到所有情况，进行设计，然后开发
1. 开发的过程中，根据需求，不断调整重构，维护项目代码整洁

### 重构的时机

1.  Litter-Pickup Refactoring/Camp Rule
1.  Turn Understanding -> Code
1.  代码审查（code review）的时候， [google code review guide](https://google.github.io/eng-practices/review/reviewer/)

总原则

旧的不变，添加新的，使用新的，替换旧的

关键是步骤尽可能的小，关键点，避免大量代码变化造成问题追查成本较高。

### 开发流程

Workflow

Red -> Green -> Refactor

Two Hats

1. Add Function
1. Refactoring

https://www.bilibili.com/video/BV1SP4y1H7i3

Martin Fowler 关于重构流程的视频 [Workflows of Refactoring](https://www.bilibili.com/video/BV1SP4y1H7i3)

## 模式

1. 例子要真实，才能体现模式的必要性。
1. 对于典型问题的套路总结
1. 对于设计的交流语言 convey intention
1. functional patterns
1. patterns happy 要不得

什么时候该使用这个模式，成本与收益？
每个模式的应用要考虑成本和收益，在成本大于收益时不要使用模式，

## 参考材料

1. Refactoring 2nd Edition
1. https://www.martinfowler.com/articles/refactoring-pipelines.html
1. https://refactoring.guru/store
1. [Refactoring to Patterns](https://martinfowler.com/books/r2p.html)
1. Refactoring Workbook [Wake]
1. Working Effectively with Legacy Code
1. Head First Design Patterns
1. Dive into Refactoring/Patterns
1. Design Patterns
1. Design Patterns for Object-Oriented Software Development
1. Test Driven Development By Example Kent Beck
1. Domain Driven Design
1. https://www.ooed.org/best-online-courses-to-learn-refactoring/
