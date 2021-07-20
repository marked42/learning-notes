# Name Scope & Binding

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

Object lifetime
binding lifetime

In general, early binding times are associated with greater efficiency, while later binding times are as- sociated with greater flexibility.

Some languages are difficult to compile because their semantics require funda- mental decisions to be postponed until run time, generally in order to increase the flexibility or expressiveness of the language.

静态变量 static means before runtime、动态变量 automatic (stack + heap)

1. language design time
1. language implementation time
1. program writing time
1. compile time
1. link time
1. load time
1. run time

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
1. heap
   1. internal fragmentation / external fragmentation
   1. first fit/best fit algorithm
   1. 内存池
      1. buddy system 2^k 大小的 block 记录链表
      1. Fibnacci Heap

函数 S 和它对应的 referencing environment 什么时候绑定，有两种选择。

作用域(Scope)定义

> The textual region of the program in which a binding is active is its scope

四个概念 Binding, Active， Scope， Textual Region
内层同名变量隐藏（shadowing）了外层变量，外边的变量 Binding 就不可见了，也就是 not active 了。

有时候使用作用域（Scope）时不指某个变量的作用域，不与某个具体的变量关联。

In addition to talking about the “scope of a binding,” we sometimes use the word “scope” as a noun all by itself, without a specific binding in mind. Infor- mally, a scope is a program region of maximal size in which no bindings change (or at least none are destroyed—more on this in Section 3.3.3).

语法作用域（Lexical Scope）静态作用域（Static Scope）指编译时确定的作用域，但是语法作用域在 CommonLisp 中也可以在运行时进行检查。

动态作用域（Dynamic Scope）

引用环境

At any given point in a program’s execution, the set of active bindings is called the current referencing environment.

### 静态作用域

1. Basic 语言，只有一个全局作用域，几百个全局变量，不用声明直接使用。
1. pre-Fortran 90，区分全局作用域和函数局部作用域，局部作用域变量可以显示声明，也可以隐式声明。C 语言中在函数内使用 static 关键自声明全局变量。
1. Algo 60 嵌套的函数 **closest nested scope rule** for bindings from names to objects:

1. 语言内置对象或者类型标识符存在于局部作用域和全局作用域之外的最外层作用域（outermost scope)，某些语言中这个最外层作用域的角色就由全局作用域充当。

1. 作用域中的名称绑定被嵌套作用域中同名变量隐藏时，称作外层作用域有了一个空洞（hole）。 A name-to-object binding that is hidden by a nested declaration of the same name is said to have a hole in its scope 作用域指示符 qualifier or scope resolution operator，c++中使用::name 表示全局作用域.

嵌套作用域情况下，如何确定一个变量指向那个外层作用域中的对象？

1. 栈帧之间需要维护 static link，当前作用域向外 k 层的作用域中存在变量 a，那么沿着 static link 向外 k 层对应的栈帧中就保存着对应的函数局部变量，然后在通过 frame pointer + displacement 位置偏移就能找到变量对应对象。
1. 嵌套函数被作为参数或者返回值传递，可能会在外层作用域 inactive 的情况下被调用，这时候外层作用域对应的栈帧 frame 已经消失了。也就是闭包的情况。这时如何找到变量名 a 对应的对象？Section 9.2 。函数嵌套作用域，如何确定函数内标识符指向那个变量，因为运行时函数栈和静态作用域并不一致。

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

对于交互式的环境，允许变量重新声明定义的功能会比较方便，例如 Chrome 工作台支持 JS 变量重定义。

### 动态作用域

必须在运行时顺着作用域链确认变量，通常适用于脚本语言，实现成本较低，运行时成本高，由于变量对应哪个对象是在运行时确定的，不同的执行条件造成同一个变量绑定到不同的对象，一旦程序出错，只会在运行时暴露出来，这使得动态作用域的程序很难理解。 Javascript with 表达式就是动态作用域。

### 作用域机制的实现

Symbol Table 或者 central reference\Association List

A symbol table with visibility support can be implemented in several different ways. One appealing approach, due to LeBlanc and Cook [CL83], is described on the companion site, along with both association lists and central reference tables.

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