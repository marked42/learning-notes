# Refactoring and Patterns

1. Refactoring 2nd Edition
1. https://www.martinfowler.com/articles/refactoring-pipelines.html
1. https://martinfowler.com/books/refactoringHtml.html
1. https://martinfowler.com/books/r2p.html
1. https://refactoring.guru/store
1. Dive into Refactoring/Patterns
1. Design Patterns

1. Refactoring Workbook [Wake]
1. Working Effectively with Legacy Code

Code Smell

tools to detect code smell

ruby reek https://github.com/troessner/reek

1. [Code Refactoring Learn Code Smells And Level Up Your code](https://www.bilibili.com/video/BV1Sz411q76F)
1. [Workflows of Refactoring](https://www.bilibili.com/video/BV1SP4y1H7i3)
1. https://www.ooed.org/best-online-courses-to-learn-refactoring/

Workflow

Red -> Green -> Refactor

1. [Refactoring to Functions](https://www.bilibili.com/video/BV1xs411X7iv)

Two Hats

1. Add Function
1. Refactoring

When to refactor

1.  Litter-Pickup Refactoring/Camp Rule
1.  Turn Understanding -> Code

dark patterns

1. https://www.darkpatterns.org/

## Patterns

1. 对于典型问题的套路总结
1. 对于设计的交流语言 convey intention
1. functional patterns
1. patterns happy 要不得

每个模式的应用要考虑成本和收益，在成本大于收益时不要使用模式，

什么时候该使用这个模式，成本与收益？

需要寻找例子

1. 例子要真实，才能体现模式的必要性。

## Creation

创建对象逻辑比较复杂时会遇到哪些问题？

1. 类数据特别多，造成构造函数参数特别多，逻辑太长需要拆分
1. 创建一系列的对象，对象有共同的基类? 对象组合造成子类个数非常多
1. 对象之间没有关联

几种方法区分 https://refactoring.guru/design-patterns/factory-comparison

### factory method

设计的正交性

Components -> button window
System -> windows / html
Dialog -> system + button

1. raw constructor -> 原始数据需要转换处理，得到构造函数所需要的数据
1. creation method
1. factory 指一个 class, factory method 指一个创建了目标类的实例方法，单一 factory 可以通过多个 factory method 对应创建不同的类，可以将返回值修改为接口类型，这样隐藏具体的类，
1. abstract factory 指一个 interface，用来创建一系列类

抽象工厂的作用

1. 创建逻辑中的差异部分，也就是根据不同逻辑的条件选择可以拆分到不同的工厂类
1. 创建逻辑中的相同部分可以实现共用，放到抽象工厂类中，模板方法模式

1. 对参数进行封装，用户不知道如何使用构造函数
1. 构造函数种类很多，使用参数支持，而不是为每类都创建对应函数
1. 构造函数太多，干扰类本身的 public api，使用专门的 Factory

builder pattern/template pattern

focuses on constructing complex objects step by step

针对复杂的对象 composite，建造者模式可以返回不同的类实例

## Conditional

1. type code/switch case/if 分支特别多，每个分支代码也很多的情况下
1. inheritance 形式。使用 replace type code with polymorphism，可以将每个分支代码封装在单独类中，类的个数和分支数相同。
1. composition 形式。使用策略模式（Strategy），将不同分支代码封装在不同的策略类中，策略类可以*运行时*修改，隔离 context 和 strategy
   1. 在 context 和 strategy 类中的数据传参策略。直接传数据，或者传整个 context 类实例

Open/Closed Principle. You can introduce new strategies without having to change the context.

1.  https://libgen.unblockit.how/libraryp2/main/009EAA05B477B57182B12B6755C01B87
1.  https://gateway.pinata.cloud/ipfs/bafykbzaceap7vc6374zw5isy4tarcg24egfnhy662xlz7pqy2frf5hdquyq7c?filename=Thorsten%20Ball%20-%20Writing%20an%20interpreter%20in%20Go%20%282017%29.pdf
1.  https://libgen.unblockit.how/book/index.php?md5=F0182DEBE7478735C07B82D15DD58FDE
1.  Design Patterns for Object-Oriented Software Development.
