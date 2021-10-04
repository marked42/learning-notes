# 名称、作用域、绑定、闭包

## 绑定 Binding

绑定指一个名字（name）和其所代表的对象（object）建立关联（association），对象不仅限于变量（variable），也可以是常量（constant）、类型（type）、子过程（subroutine）、模块（module）等等。

绑定建立的时间（binding time）从前到后依次可能是语言设计时（language design time）、语言实现时（language implementation time）、程序编写时（program writing time）、编译时（compile time）、链接时（link time）、加载时（load time）、运行时（run time）等[1](#plp3.1)。

运行时之前发生的绑定成为静态绑定（static binding），运行时发生的绑定称为静态绑定（dynamic binding）。对于同一个绑定来说，设计为静态可以将工作放到编译时去做，从而提高运行时效率；设计为动态绑定发生时具有更多信息，程序具有更多的自由度和表现力。

对象的生命周期（object's lifetime）指对象的创建到销毁的持续周期，绑定的生命周期（binding's lifetime）绑定的创建和销毁。绑定的失效和激活（activation & deactivation）。

对象的生命周期对应三种类型的存储机制（storage management）。

1. 静态的，程序运行确定的，整个程序执行过程中保持不变，包括全局变量、常量、局部静态变量等，这些对象可以分配到只读内存区域，如果运行时遇到写入操作可以进行报错。
1. 栈上的，变量类型编译时静态决定，变量内存运行时动态分配在栈上，包括函数参数、局部变量等。
1. 堆上的，程序显式地（explicit）向操作系统申请得到的内存，或者是隐式（implicit）分配的内存。

elaboration time 值绑定首次激活的时候。

## 作用域（Scope）

绑定的作用域指程序源码中该绑定生效的范围。

> The textual region of the program in which a binding is active is its scope

有时候使用作用域（Scope）不与某个具体的变量关联，而指程序的一块区域。

作用域分为静态作用域（Static Scope）和动态作用域（Dynamic Scope）两种类型。静态作用域指编译时确定的作用域，由于编译时使用语法信息确定作用域，所以也称为语法作用域（Lexical Scope）。二者基本相同，但是语法作用域在 CommonLisp 中也可以在运行时进行检查。动态作用域（Dynamic Scope）指运行时才能确定的作用域。

在程序执行的任意位置，处用环境（referencing environment）指当前位置生效的绑定集合（active binding collection）。

### 静态作用域

1. Basic 语言，只有一个全局作用域，几百个全局变量，不用声明直接使用。
1. pre-Fortran 90，区分全局作用域和函数局部作用域，局部作用域变量可以显示声明，也可以隐式声明。C 语言中在函数内使用 static 关键自声明全局变量。
1. Algo 60 嵌套的函数 **closest nested scope rule** for bindings from names to objects:

1. 语言内置对象或者类型标识符存在于局部作用域和全局作用域之外的最外层作用域（outermost scope)，某些语言中这个最外层作用域的角色就由全局作用域充当。

1. 作用域中的名称绑定被嵌套作用域中同名变量隐藏时，称作外层作用域有了一个空洞（hole）。 A name-to-object binding that is hidden by a nested declaration of the same name is said to have a hole in its scope 作用域指示符 qualifier or scope resolution operator，c++中使用::name 表示全局作用域.

嵌套作用域情况下，如何确定一个变量指向那个外层作用域中的对象？

1. 栈帧之间需要维护 static link，当前作用域向外 k 层的作用域中存在变量 a，那么沿着 static link 向外 k 层对应的栈帧中就保存着对应的函数局部变量，然后在通过 frame pointer + displacement 位置偏移就能找到变量对应对象。
1. 嵌套函数被作为参数或者返回值传递，可能会在外层作用域 inactive 的情况下被调用，这时候外层作用域对应的栈帧 frame 已经消失了。也就是闭包的情况。这时如何找到变量名 a 对应的对象？Section 9.2 。函数嵌套作用域，如何确定函数内标识符指向那个变量，因为运行时函数栈和静态作用域并不一致。

作用域链 static parent, static ancestors

#### 声明顺序问题 Declaration Order

一个作用域中，变量在被声明之前的部分能够使用么？变量的作用域是整个括号作用域的范围还是变量声明开始到作用域结束的范围。

早期语言 Algol 60 and Lisp 通过要求函数中所有局部变量都要在开头统一声明，然后才能使用，但是这种做法还会存在声明的变量互相引用的问题。

如果采取变量作用于是从变量声明所在行到作用于结束的方案，那么所有变量使用前都必须先声明。对于互相引用的函数、递归定义的类型等情况，存在问题。C 语言采用将声明和定义分开的方法解决这个问题。两种方案 whole block 和 declaration before use。

```
let a = 1;
function b() {
   // 这里使用a变量使用的是函数b内部变量，但是还未初始化所以会报错。
   console.log('a', a);
   let a = 2;
};

b();
```

块级作用域

C#和 Java 不允许在嵌套块级作用域中定义同名变量 Shadowing

```java
void sub() {
   int count;
   while (true) {
      // 错误
      int count;
   }
}
```

对于交互式的环境，允许变量重新声明定义的功能会比较方便，例如 Chrome 工作台支持 JS 变量重定义。

Declaration Order 声明顺序

C89 中函数中所有变量声明必须位于函数开头，除了嵌套的块级作用域中。

先声明后使用

1. 使用未声明的变量如何处理
1. 使用声明但未初始化的变量如何处理
1. 为什么要区分变量的声明和初始化

### 动态作用域

必须在运行时顺着作用域链确认变量，通常适用于脚本语言，实现成本较低，运行时成本高，由于变量对应哪个对象是在运行时确定的，不同的执行条件造成同一个变量绑定到不同的对象，一旦程序出错，只会在运行时暴露出来，这使得动态作用域的程序很难理解。 Javascript with 表达式就是动态作用域。

dynamic parent 也就是 caller 的栈帧

缺点

1. 同一个名称在不同的函数调用时可能绑定到不同变量，类型不定
1. 函数调用时当前调用栈上所有栈帧中局部变量都是可见的，容易出错

### 作用域机制的实现

Symbol Table 或者 central reference\Association List

A symbol table with visibility support can be implemented in several different ways. One appealing approach, due to LeBlanc and Cook [CL83], is described on the companion site, along with both association lists and central reference tables.

## 变量

变量的属性六元组

A variable can be characterized as a sextuple of attributes: (name, address, value, type, lifetime, scope)

variable

变量的类型限定了变量值的返回和合法的操作。

1. static explicit/implicit
1. dynamic

概念

1.  The complete set of bindings in effect at a given point in a program is known as the current referencing environment
1.  Object
1.  Name
1.  Binding
1.  Scope
1.  Closure
1.  Lifetime
1.  alias
1.  overloading
1.  scope rules

区分常量（const），只读变量（readonly 或者 final)和可变变量。

如何确定一个对象分配在栈上还是堆中，编译时大小是否确定。

caller 调用 callee 前后的代码称作 calling sequence， callee 自身执行时，开头的代码 prologue，结束的代码 epilogue。

1. 栈帧 Stack Frame Activation Record 包括几部分。
   1. 函数实参和返回值 arguments and return value fp + positive offset，位于 caller 的栈帧内，其他内容是 fp + negative offset，位于 callee 的栈帧内。
   1. 局部变量 local variable
   1. 临时变量 temporaries 复杂计算的中间结果
   1. 记录信息 bookkeeping information
      1. 子调用的返回值地址
      1. caller 的栈帧地址

函数 S 和它对应的 referencing environment 什么时候绑定，有两种选择。

语句的引用环境指对于语句可见的所有变量。

> The referencing environment of a statement is the collection of all variables that are visible in the statement.

## 常量

const C/C++
final Java
C# const/readonly

1. 避免魔数
1. 统一定义方便修改

### 名称的意义

名字和对象并不是完全的一对一的关系， 别名和重载。

Two or more names that refer to the same object at the same point in the program are said to be aliases. A name that can refer to more than one object at a given point in the program is said to be overloaded

指针和引用实际上也是给了同一个对象多个别名，别名的使用会造成程序难以分析，容易出错。Pointer Analysis Algorithm.

1. deep binding 函数创建时，这种情况该函数任何时候调用，内部的变量都绑定到固定的对象。
1. shallow binding 函数运行时，这种情况，函数调用时对应的 reference environment 才确定，同一个变量绑定到的对象曲取决于当时的数据，沿着栈帧寻找绑定对象。

闭包就是函数加上 Referencing Environment，闭包使得函数成为语言中一等公民。闭包使得函数中局部变量生命周期被无限期延长，这样保证函数被调用时其依赖的数据还存在，直到编译器通过分析能够确认闭包函数不会再被使用，闭包中的数据才能被回收（垃圾回收机制或者其他的生命周期机制）。这样的数据必须被分配在堆中，栈中的数据都是在作用域结束后立即销毁。

deep binding 的情况**只会出现在**允许函数嵌套定义，而且变量在中间嵌套层定义中，对于位于最外层的变量，无论 deep binding 还是 shallow binding 都绑定到全局唯一的对象，对于位于最内层的变量，都绑定到当前函数的局部对象。

语言中概念的地位分类

1. 一等公民，可以作为函数参数、函数返回值、赋值给变量。
1. 二等公民，可以作为参数、但是不能作为返回值和赋值给变量。
1. 三等公民，不能作为参数、返回值、赋值给变量。

不支持函数定义嵌套的语言中，利用 Object Closure，function object 来保存函数调用的 context。

支持嵌套函数定义的语言，函数中的局部变量可能会被内部函数引用，因为其生命周期被延长(unlimited extent)，不能分配在栈上，必须分配在堆上，如何分类处理？

1. 将函数所有局部变量都分配在堆中，方便实现
1. 区分函数局部变量，分析程序结构，一部分分配在栈上，一部分分配在堆上，实现复杂。

对于分配在堆上的变量，什么时候回收？

1. 在程序结束时才回收，无限期延长其生命周期。
1. 垃圾回收算法决定，在对象不肯能再被以任何方式使用时回收。
1. 更精确的对象声明周期分析，在对象声明周期结束后回收，rust 引入声明周期标志的处理方法？

作用域四个功能

```java
public interface Scope {
	public String getScopeName();
	public Scope getEnclosingScope();
	public void define(Symbol symbol);
	public Symbol resolve(String name);
}
```

forward reference 限制在类语法中。

将 AST 节点和 Scope Tree 互相关联起来，这样在对 AST 进行解释执行或者代码分析时利用上 Scope Tree 的信息。

incremental analysis 对于 IDE 提供编程智能提示功能非常有用。

如果 AST 结构改变怎么处理，Scope Tree 如何更新？

语言概念列表

1. Type 类型，包括内置类型、自定义类型 Class/Struct
1. Symbol 符号
   1. VariableSymbol
   1. ScopedSymbol
      1. ClassSymbol
      1. StructSymbol
      1. 函数 FunctionSymbol
1. Scope 作用域
   1. 全局作用域 Global Scope
   1. 局部作用域 Local Scope
   1. 函数作用域 Function Scope

内层同名变量隐藏（shadowing）了外层变量，外边的变量 Binding 就不可见了，也就是 not active 了。

两趟构建作用域树，第一遍声明、第二遍引用

1. Concepts of Programming Languages Chapter 5 Names, Bindings and Scopes

## Reference

1. <span id="plp3.1">Programming Language Pragmatics Chapter 3.1 The Notion of Binding Time</span>
