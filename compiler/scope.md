# 编程语言中作用域机制相关的基础概念

## 绑定 Binding

绑定指一个名字（name）和其所代表的对象（object）建立关联（association），对象不仅限于变量（variable），也可以是常量（constant）、类型（type）、子过程（subroutine）、模块（module）等等。

绑定建立的时间（binding time）从前到后依次可能是语言设计时（language design time）、语言实现时（language implementation time）、程序编写时（program writing time）、编译时（compile time）、链接时（link time）、加载时（load time）、运行时（run time）等[1](#plp3.1)。

运行时之前发生的绑定成为静态绑定（static binding），运行时发生的绑定称为静态绑定（dynamic binding）。对于同一个绑定来说，设计为静态可以将工作放到编译时去做，从而提高运行时效率；设计为动态绑定发生时具有更多信息，程序具有更多的自由度和表现力。

对象的生命周期（object's lifetime）指对象的创建到销毁的持续周期，绑定的生命周期（binding's lifetime）绑定的创建和销毁。绑定的失效和激活（activation & deactivation）。

对象的生命周期对应三种类型的存储机制（storage management）。

1. 静态的，程序运行确定的，整个程序执行过程中保持不变，包括全局变量、常量、局部静态变量等，这些对象可以分配到只读内存区域，如果运行时遇到写入操作可以进行报错。
1. 栈上的，变量类型编译时静态决定，变量内存运行时动态分配在栈上，包括函数参数、局部变量等。
1. 堆上的，程序显式地（explicit）向操作系统申请得到的内存，或者是隐式（implicit）分配的内存。

elaboration time 指绑定首次激活的时间。

## 作用域（Scope）

绑定的作用域指程序源码中该绑定生效的范围。

> The textual region of the program in which a binding is active is its scope

有时候使用作用域（Scope）不与某个具体的变量关联，而指程序的一块区域。

作用域分为静态作用域（Static Scope）和动态作用域（Dynamic Scope）两种类型。静态作用域指编译时确定的作用域，由于编译时使用语法信息确定作用域，所以也称为语法作用域（Lexical Scope）。二者基本相同，但是语法作用域在 CommonLisp 中也可以在运行时进行检查。动态作用域（Dynamic Scope）指运行时才能确定的作用域。

在程序执行的任意位置，处用环境（referencing environment）指当前位置生效的绑定集合（active binding collection）。

### 静态作用域

静态作用域分为全局作用域和局部作用域（块级作用域、函数作用域）。

Basic 语言，只有一个全局作用域，几百个全局变量，不用声明直接使用，C/C++ 中在函数外定义的变量处于全局作用域，全局作用域中的变量可以在任意位置使用。

块级作用域使用花括号表示，块级作用域内声明的变量只对作用域内部可见，对作用域外部不可见。

函数作用域使用函数体作为作用域边界，效果跟块级作用域类似。C/C++中除了普通的局部变量声明还可以使用 static 关键字声明静态局部变量，静态局部变量的作用域还是函数作用域，但是和全局作用域中变量一样编译时静态分配，程序运行过程中只有一份实例，因此不同的函数调用使用的是同一个变量。

局部作用域支持嵌套，在嵌套作用域中根据最近嵌套作用域规则（closest nested scope rule）确定名称引用的绑定。从当前作用域开始，沿着包围当前作用域的外层作用域逐层寻找直到全局作用域，在每层作用域中寻找是否存在名称为 x 的绑定，第一个找到的也就是最近嵌套作用域的绑定 x 就是当前作用域中名称 x 使用的绑定。

```javascript
let a = 1
let b = 2
let c = 3
function outer() {
  let b = 4
  let c = 5
  function inner() {
    let c = 6

    // 1 4 6
    console.log(a, b, c)
  }

  inner()
}
```

嵌套作用域中名称 x 确定对应绑定的机制造成内层作用域的名称 x 会使得外层作用域同名的绑定 x 不可见（invisible），也称为遮挡（shadowing）。C++中可以使用作用域前缀（scope resolution operator） my_proc.x 来明确访问函数 my_proc 中的名称 x，或者::x 来明确访问全局作用域中的名称 x，这样可以绕过同名遮挡机制。Javascript 等语言中没有提供作用域前缀的方式，无法访问被遮挡的名称。

C 语言中不同作用域变量

1. 全局作用域 在函数之外部定义的不带 static 关键在的变量
1. 文件作用域 在函数外部定义的 static 变量，只当前文件可见对于其他文件不可见
1. 函数作用域 静态局部变量 带有 static 关键字，只在函数内可见，分配在全局上
1. 函数作用域 普通局部变量 默认带有 automatic 关键字，只在函数内可见，运行时分配在栈帧上

#### 声明顺序 Declaration Order

局部作用域的范围界定存在一个微妙的问题，对于局部作用域 B 中声明的对象 X，X 的作用域是指整个 B 的范围（whole block）还是从 X 的声明位置开始到 B 的结束位置（declaration before use）。这两种不同的定义对于对象 X 先使用后声明的情况有不同的处理。

C 等早期语言因为编译器的实现采用一趟编译的策略（single pass compilation）所以自然的采用了从声明开始到作用域结束的方案，C++/Java 沿用同样方案。下面的 C 程序中嵌套的局部变量 b 的初始化语句中使用的变量 a 指的是外层作用域的变量。

```c
#include <stdio.h>

int main() {
   int a = 1;
   {
      // b = 1
      int b = a;
      int a = 2;

	   printf("b: %d", b);
   }
}
```

早期语言 Algol 60 and Lisp 通过要求函数中所有局部变量都要在开头统一声明然后再使用的方法来避免这个问题，但是这种做法无法解决递归引用的问题。C 语言将声明和定义区分开来，使用前置声明来解决递归引用。

```c
// 递归结构体
struct manager;
struct employee {
   struct manager *boss;
   struct employee *next_employee;
};

struct manager {
   struct employee *first_employee;
};

// 递归函数
void list_tail(follow_set fs);
void list(follow_set fs) {
   list_tail(fs);
}

void list_tail(follow_set fs) {
   list(fs);
}
```

C++/Java/C#等面向对象语言中对于先声明后使用的规则进行了放宽，类的成员定义无顺序要求，可以用任意顺序定义和使用。

Javascript 中绑定的作用域采用整个局部作用域方案，但是声明位置到局部作用域开头的区域被称为暂时性死区（temporal dead zone），在这个区域使用变量会在运行时抛出引用错误。

```javascript
let a = 1
function b() {
  // 在暂时性死区中读写变量a都会在运行时抛出错误 // Uncaught ReferenceError: Cannot access 'a' before initialization
  // 读
  console.log('a', a)
  // 写
  a = 2
  let a = 3
}

b()
```

引用不存在的变量会在运行时抛出变量未定义错误。

```javascript
function b() {
  // Uncaught ReferenceError: test is not defined
  console.log('test', test)

  // 直接向不存在的变量写入会隐式地在全局作用域创建变量
  a = 1
}

b()
```

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

多数语言不允许在同一个作用域中重复声明同名变量，但是 Javascript 等脚本语言的交互式的环境（Read Evaluate Print Loop），允许变量重新声明对于编写代码比较方便，Chrome 工作台支持 JS 变量重定义。

#### 非局部对象

局部对象

1. 栈帧之间需要维护 static link，当前作用域向外 k 层的作用域中存在变量 a，那么沿着 static link 向外 k 层对应的栈帧中就保存着对应的函数局部变量，然后在通过 frame pointer + displacement 位置偏移就能找到变量对应对象。
1. 嵌套函数被作为参数或者返回值传递，可能会在外层作用域 inactive 的情况下被调用，这时候外层作用域对应的栈帧 frame 已经消失了。也就是闭包的情况。这时如何找到变量名 a 对应的对象？Section 9.2 。函数嵌套作用域，如何确定函数内标识符指向那个变量，因为运行时函数栈和静态作用域并不一致。

作用域链 static parent, static ancestors

#### 闭包

函数 S 和它对应的 referencing environment 什么时候绑定，有两种选择。

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

_引用环境（referencing environment）_

语句的引用环境指对于语句可见的所有变量。

> The referencing environment of a statement is the collection of all variables that are visible in the statement.

1.  The complete set of bindings in effect at a given point in a program is known as the current referencing environment

### 动态作用域

在运行时顺着函数栈帧自顶向下在每个栈帧中寻找变量，通常适用于解释执行的脚本语言，实现简单，相比于静态作用域有明显缺点。

1. 运行时进行绑定解析，效率较低
1. 不同的函数调用顺序造成同一个变量绑定到不同的对象，一旦程序出错，只会在运行时暴露出来，这使得动态作用域的程序很难理解。
1. 函数调用时当前调用栈上所有栈帧中局部变量对于栈顶函数都是可见的，容易出错

278 CHAPTER 6 The Procedure Abstraction 动态作用域和静态作用域对于局部变量的处理没有区别，都是位于当前栈帧中。对于函数中访问了的外层嵌套作用域中的变量，称为自由变量（free variable）。

Javascript with 语句就是动态作用域，但是在运行时很容易出现将变量泄漏到全局作用域中的情况。

```javascript
let obj = { name: 'tom' }

with (obj) {
  console.log(name)
  name = 'bob'

  // 目的是设置obj的gender属性值，但是如果运行时obj没有gender属性，会隐式的在全局作用域中定义属性gender。
  gender = 'male'
}
```

Scheme/Lisp/ML 等语言支持指定变量使用静态作用域或者动态作用域。

## 变量与常量

程序中的变量可以用属性六元组定义区分，名称、地址、值、类型、声明周期、作用域。

> A variable can be characterized as a sextuple of attributes: (name, address, value, type, lifetime, scope)

常量可以避免魔数，统一定义方便修改，常量分为两种。

1. 编译时常量，例如 PI 值或者一个常量字符串，这种常量根据需要可以编译时静态分配到全局常量池中，或者编译为立即数的形式，根本不需要分配内存空间。
1. 运行时常量，确定后不再发生变化，这种常量向普通变量一样进行处理，只是在初始化后不允许写入。

C/C++使用 const 关键字表示运行时常量，新增了 constexpr 表示编译时常量。Java 使用 final 关键字表示常量，没有对两种形式进行区分。

C# const 关键字表示编译时常量，readonly 关键字表示运行时常量（或者叫只读变量）。

全局变量
静态局部变量（static local variable）
局部变量
非局部变量

C 语言中变量只能是声明在函数之外顶层环境的全局变量，或者是声明在函数内的局部变量，并且不支持嵌套函数声明。

```c
int global = 0;

int main() {
	const char* local = "tom";
	print(local);
	return 0;
}
```

## 作用域的实现

Symbol Table 或者 central reference\Association List

A symbol table with visibility support can be implemented in several different ways. One appealing approach, due to LeBlanc and Cook [CL83], is described on the companion site, along with both association lists and central reference tables.

caller 调用 callee 前后的代码称作 calling sequence， callee 自身执行时，开头的代码 prologue，结束的代码 epilogue。

1. 栈帧 Stack Frame Activation Record 包括几部分。
   1. 函数实参和返回值 arguments and return value fp + positive offset，位于 caller 的栈帧内，其他内容是 fp + negative offset，位于 callee 的栈帧内。
   1. 局部变量 local variable
   1. 临时变量 temporaries 复杂计算的中间结果
   1. 记录信息 bookkeeping information
      1. 子调用的返回值地址
      1. caller 的栈帧地址

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

两趟构建作用域树，第一遍声明、第二遍引用

## Reference

1. <span id="plp3.1">Programming Language Pragmatics Chapter 3.1 The Notion of Binding Time</span>
1. Programming Language Pragmatics Chapter 3.3 Scope Rules / Access to Nonlocal Objects Page 128
1. Programming Language Pragmatics Chapter 3 Names, Scopes and Bindings
1. Concepts of Programming Languages Chapter 5 Names, Bindings and Scopes
