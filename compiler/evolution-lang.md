# 一个语言演化的例子

## 混沌之初

最开始只有值，我们只能使用值做一些简单的计算。

```c
1 + 2 * 3 - 4
```

值和全局变量

1. 只有表达式计算，只有值，calculator
1. 常量、只读变量、变量
1. 需要变量保存中间结果，全局变量

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

## 子程序 （Subroutine）

1. 子程序 subroutine 过程抽象
1. 区分 procedure 和 function
1. 引入参数（只支持 call by value）和局部变量 只在函数内部可见，只需要将局变量保存在全局控制即可，不支持函数或者过程再调用其他函数。同一时间只能有一份数据实例。
   函数中的局部对象名称不能和全局变量重名。

函数可以嵌套、函数可以递归调用、函数不能重入（non-reentrant）不支持一个线程上递归调用，也不支持多线程并发调用，同一时间只能有一份活跃调用（Activation Record），局部变量就可以就能静态分配。

子程序（subroutine）是命令式（imperative）编程语言中对一组命令的抽象，将一个名称和一组命令关联起来，通过使用名称来执行命令。子程序可以接受参数，通过参数控制具体的行为。子程序定义处的参数称为形参（parameter/formal parameter），调用时传入的具体参数值称为实参（argument/actual parameter）。带有返回的子程序称为函数（function），不带返回值的称为过程（procedure），在无歧义的情况下后续统称为函数。

## 静态作用域

绑定的作用域指程序源码中该绑定生效的范围。

> The textual region of the program in which a binding is active is its scope

有时候使用作用域（Scope）不与某个具体的变量关联，而指程序的一块区域。

作用域分为静态作用域（Static Scope）和动态作用域（Dynamic Scope）两种类型。静态作用域指编译时确定的作用域，由于编译时使用语法信息确定作用域，所以也称为语法作用域（Lexical Scope）。二者基本相同，但是语法作用域在 CommonLisp 中也可以在运行时进行检查。动态作用域（Dynamic Scope）指运行时才能确定的作用域。

在程序执行的任意位置，处用环境（referencing environment）指当前位置生效的绑定集合（active binding collection）。

### 全局作用域

### 嵌套作用域

1.  每个人都有自己的爸爸 引入作用域的概念，函数作用域，块级作用域，限制可见性

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

### 声明顺序问题

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

另一个例子

```javascript
;(function out() {
  var a = 'out'

  function test() {
    console.log(a)

    while (false) {
      var a = 'in'
    }
  }
  test()
})()
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

### 解释执行实现

两趟构建作用域树，第一遍声明、第二遍引用

Symbol Table 或者 central reference\Association List

A symbol table with visibility support can be implemented in several different ways. One appealing approach, due to LeBlanc and Cook [CL83], is described on the companion site, along with both association lists and central reference tables.

作用域四个功能

```java
public interface Scope {
	public String getScopeName();
	public Scope getEnclosingScope();
	public void define(Symbol symbol);
	public Symbol resolve(String name);
}
```

将 AST 节点和 Scope Tree 互相关联起来，这样在对 AST 进行解释执行或者代码分析时利用上 Scope Tree 的信息。

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

## 嵌套调用子程序

二次外包

次贷危机？

1.  递归支持、多线程支持 引入激活记录和控制栈（control stack）的概念 这里给出栈帧布局。
    1.  为什么选用栈

解释下为什么要有 activation records

如果函数在运行时只能有一份调用，函数的局部变量是全局唯一，可以静态分配，缺点。

## 函数调用栈（Control Stack）

栈帧（Stack Frame） / Activation Record

1. 不支持递归调用
1. 支持多线程，多个线程调用同一个函数

1. 栈帧 Stack Frame Activation Record 包括几部分。
   1. 函数实参和返回值 arguments and return value fp + positive offset，位于 caller 的栈帧内，其他内容是 fp + negative offset，位于 callee 的栈帧内。
   1. 局部变量 local variable
   1. 临时变量 temporaries 复杂计算的中间结果
   1. 记录信息 bookkeeping information
      1. 子调用的返回值地址
      1. caller 的栈帧地址

栈帧包含哪些信息

1. 实参、函数返回值
1. 函数返回地址 又叫做 dynamic link
1. 嵌套函数实现非局部变量 static link/display
1. 保存的寄存器
1. 局部变量
1. 临时信息

1. stack pointer register 栈顶（当前最后一个分配的内存地址）或者栈顶向下偏移（栈向低地址增长）一个字节的位置（第一个未分配的内存地址），不同的约定。
1. frame pointer register 指向当前栈帧开头的位置，使用偏移访问指令（displacement addressing），如何处理不定长的参数或者局部变量？

1. caller 调用者
1. callee 被调用者

栈帧中 caller 负责把对实参进行求值，

## 程序的内存结构

三个特殊的寄存器
frame pointer
stack pointer
program counter

1.  对象生命周期 动态静态两类，static，栈和堆。

1.  运行时程序内存布局 图片 Code/Static/Heap <- Free Memory -> Stack 又叫 control stack

Actual Parameters
Returned Values
Control Link/Dynamic Link
Access Link/Static Link
Saved Machine Status return address/saved registers
Local Data
Temporaries

## calling sequence

1. calling sequence 调用者在被调用者执行前后执行的指令
1. return sequence ?
1. prologue 被调用者执行前运行的指令
1. epilogue 被调用者执行后运行的指令

1. 如何维持栈 calling sequence

caller 调用 callee 前后的代码称作 calling sequence， callee 自身执行时，开头的代码 prologue，结束的代码 epilogue。

7.2.3 calling sequence

执行过程

1. 调用前
   1. 传参
   1. 保存调用者函数返回地址，frame pointer，
   1. 修改 program counter
   1. 寄存器值（会被被调用者覆盖但是仍然存活并且需要在被调用者执行完成后恢复的寄存器）
   1. 修改 stack pointer
1. 函数执行
1. 调用后

   1. 处理返回值，赋值给对应变量
   1. 局部变量可能的销毁操作 finalization
   1. 弹出栈帧，也就是恢复 stack pointer
   1. 恢复 program counter
   1. 恢复 frame pointer
   1. 其他 register

1. access link/static link/dynamic link
1. global display
1. precall sequence
1. postreturn sequence
1. prologue sequence
1. epilogue sequence

## 栈上的变长数据

TODO: 栈上的变长数据 7.2.4 栈帧内使用指针类型表示变长数据，将变长数据本身保存在当前的栈帧之后，变长数据不属于栈帧，所有数据相对于栈帧起始位置偏移量可以编译时确定。

## 寄存器优化

大多数任务可以是调用者完成，也可以是被调用者负责完成，但是传参需要调用者完成，区分这两种情况， caller save register/callee save register。

需要保存到栈上的寄存器 调用者和被调用者都使用到的寄存器，分别编译模型造成准确分析困难，所以可以由调用者保存所有用到的寄存器或者被调用者保存所有会覆盖的寄存器。

寄存器分为三个种类 Tiger P 129

1. 特殊目的寄存器
1. caller save registers 调用者负责保存
1. callee save registers 被调用者负责保存，为了减小代码尺寸，提高运行效率，局部变量可以保存在这里

对于 leaf procedure 的优化，可以都在寄存器中完成，会非常快。

## calling convention

TODO: calling convention C++

## 返回地址与返回值的处理

## parameter passing

1. parameter passing
   1. call by value
   1. call by reference
   1. call by value/result
   1. call by name
   1. call by need

TODO: Tiger 130 calling convention 使用寄存器保存前 k 个函数参数。

值传递（call by value）值拷贝的形式，两个参数是独立的

引用传递（call by reference）保存地址形式，在函数中可以通过参数修改传入的数据，传入的参数必须是左值 l-value，
引用传递有两个作用：

1. 值传递需要拷贝，参数无法拷贝或者拷贝操作成本较高的情况下使用，代价是参数访问多了一层间接跳转（indirection）。
1. 在函数内部要通过形参来修改实参

分享传递（call by sharing） 针对变量本身就是引用类型的说法，实现上还是和值传递一样做拷贝，和引用传递的区别在于参数无法重新绑定到其他对象上。

Java 中基础类型是值传递，其他变量都是对象的引用类型可以解释 call by sharing。

C++中的参数传递例子 值、指针、引用、右值引用等。

C#中区分值类型（struct）和引用类型（class），都使用 call by value 形式，区别在于引用类型变量本身保存的就是变量地址。使用 ref 或者 out 标记参数使用引用 call by reference。

call-by-name

call-by-need

### 更多传参

可选参数、默认参数、命名参数、变长参数

1. Essentials of Programming Language

## 堆内存

heap management

## 动态作用域

在运行时顺着函数栈帧自顶向下在每个栈帧中寻找变量，通常适用于解释执行的脚本语言，实现简单，相比于静态作用域有明显缺点。

1. 运行时进行绑定解析，效率较低
1. 不同的函数调用顺序造成同一个变量绑定到不同的对象，一旦程序出错，只会在运行时暴露出来，这使得动态作用域的程序很难理解。
1. 函数调用时当前调用栈上所有栈帧中局部变量对于栈顶函数都是可见的，容易出错

278 CHAPTER 6 The Procedure Abstraction 动态作用域和静态作用域对于局部变量的处理没有区别，都是位于当前栈帧中。对于函数中访问了的外层嵌套作用域中的变量，称为自由变量（free variable）。

Javascript with 语句就是动态作用域，但是在运行时很容易出现将变量泄漏到全局作用域中的情况。

程序中的变量可以用属性六元组定义区分，名称、地址、值、类型、声明周期、作用域。

> A variable can be characterized as a sextuple of attributes: (name, address, value, type, lifetime, scope)

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

## 对象的生存周期

对象的生命周期（object's lifetime）指对象的创建到销毁的持续周期，绑定的生命周期（binding's lifetime）绑定的创建和销毁。绑定的失效和激活（activation & deactivation）。

对象的生命周期对应三种类型的存储机制（storage management）。

1. 静态的，程序运行确定的，整个程序执行过程中保持不变，包括全局变量、常量、局部静态变量等，这些对象可以分配到只读内存区域，如果运行时遇到写入操作可以进行报错。
1. 动态的，栈内存，变量类型编译时静态决定，变量内存运行时动态分配在栈上，包括函数参数、局部变量等。
1. 动态的，堆内存，程序显式地（explicit）向操作系统申请得到的内存，或者是隐式（implicit）分配的内存。

elaboration time 指绑定首次激活的时间。

## 绑定 Binding

绑定指一个名字（name）和其所代表的对象（object）建立关联（association），对象不仅限于变量（variable），也可以是常量（constant）、类型（type）、子过程（subroutine）、模块（module）等等。

绑定建立的时间（binding time）从前到后依次可能是语言设计时（language design time）、语言实现时（language implementation time）、程序编写时（program writing time）、编译时（compile time）、链接时（link time）、加载时（load time）、运行时（run time）等[1](#plp3.1)。

运行时之前发生的绑定成为静态绑定（static binding），运行时发生的绑定称为静态绑定（dynamic binding）。对于同一个绑定来说，设计为静态可以将工作放到编译时去做，从而提高运行时效率；设计为动态绑定发生时具有更多信息，程序具有更多的自由度和表现力。

TODO:

1. <span id="plp3.1">Programming Language Pragmatics Chapter 3.1 The Notion of Binding Time</span>

## 嵌套函数与非局部对象

Pascal 支持嵌套函数但是不支持函数作为返回值，C 支持函数作为返回值但是不支持嵌套函数，

1. 嵌套但是被嵌套函数只能在外围函数尚未返回时才能被调用，使用 static link 方式实现非局部变量的访问 Pascal 嵌套函数的实现

1. 支持函数嵌套 不允许作为返回值 非局部对象 static link

局部对象

1. 栈帧之间需要维护 static link，当前作用域向外 k 层的作用域中存在变量 a，那么沿着 static link 向外 k 层对应的栈帧中就保存着对应的函数局部变量，然后在通过 frame pointer + displacement 位置偏移就能找到变量对应对象。
1. 嵌套函数被作为参数或者返回值传递，可能会在外层作用域 inactive 的情况下被调用，这时候外层作用域对应的栈帧 frame 已经消失了。也就是闭包的情况。这时如何找到变量名 a 对应的对象？Section 9.2 。函数嵌套作用域，如何确定函数内标识符指向那个变量，因为运行时函数栈和静态作用域并不一致。

作用域链 static parent, static ancestors

static link chain / display

1. Programming Language Pragmatics Chapter 3.3 Scope Rules / Access to Nonlocal Objects Page 128

## 闭包

TODO: COPL 9.12

1. 闭包 高阶函数

函数作为参数、函数作为返回值

嵌套但是支持外围函数返回后还可以被调用，非局部变量的生命周期需要被延长，就必须分配在堆上，闭包

> It is the combination of nested functions (where inner functions may use variables defined in the outer functions) and functions returned as results (or stored into variables) that causes local variables to need lifetimes longer than their enclosing function invocations.

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

### 闭包和对象是等价的

对象和闭包的关系有一个有趣的[小故事](https://www.iteye.com/blog/rednaxelafx-245022)，其中关键的描述如下。

> Objects are merely a poor man's closures. Closures are a poor man's object.

假设需要将数据和一组操作数据的行为封装在一起，很自然地可以使用面向对象的形式，下面的例子中使用类`Person`将两个数据字段`name`、`age`和两个方法（行为）`growOneYearOld`、`introduce`封装在一起。

```js
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  growOneYearOld() {
    this.age += 1
  }

  introduce() {
    console.log(`${this.name} is ${this.age} years old.`)
  }
}

const tom = new Person('tom', 3)
```

函数式编程中使用闭包可以达到相同的效果。

```js
function newPerson(name, age) {
  const person = { name, age }

  return {
    growOneYearOld() {
      person.age += 1
    },
    introduce() {
      console.log(`${person.name} is ${person.age} years old.`)
    },
  }
}
```

因此类和闭包在封装一组数据和关联行为上是等价的，可以用闭包来模拟实现类机制，也可以用类来模拟实现闭包。

## 异常流程

函数运行的三种流程情况

1. 子函数正常调用并返回
1. 程序出错无法继续执行
1. 程序抛出异常则栈展开（unwinding）到能够处理异常的栈帧。

PLP 9.4
COPL 14

## 协程 coroutine

PLP 9.5

iterator/generator

## Event

PLP 9.6
COPL 14

## 参考资料

_教材_

1. Compilers Principles, Techniques & Tools
   1. Chapter 7 Run-Time Environments
1. Modern Compiler Implementation in C
   1. Chapter 6. Activation Records TODO: 习题
1. Programming Language Pragmatics
   1. Chapter 3. Names, Scopes and Bindings
   1. Chapter 5. Target Machine Architecture
   1. Chapter 9. Subroutines and Control Abstraction
   1. Chapter 16. Run-Time Program Management
1. Concepts of Programming Languages
   1. Chapter 5. Names, Bindings, and Scopes
   1. Chapter 9. Subprograms
   1. Chapter 10. Implementing Subprograms
   1. Chapter 14. Exception Handling and Event Handling
1. Engineering a Compiler
   1. Chapter 6. The Procedure Abstraction
1. Advanced Design and Implementation of Virtual Machines
   1. Chapter 8. Stack Unwinding
1. Advanced Compiler Design And Implementation

   1. Chapter 3 Symbol-Table Structure
   1. Chapter 5.4 Run-Time Support

1. Language Implementation Patterns

   1. Chapter 6. Tracking and Identifying Program Symbols
   1. Chapter 7. Managing Symbol Tables for Data Aggregates

_文章_

1. [Programming in Lua Chapter 6.1 Closures](http://www.lua.org/pil/6.1.html)
1. [Programming in Lua Chapter 27.3.3 Upvalues](http://www.lua.org/pil/27.3.3.html)
1. [Closures in Lua](https://www.cs.tufts.edu/~nr/cs257/archive/roberto-ierusalimschy/closures-draft.pdf)
1. [Crafting Interpreters Chapter 25 Closures](https://craftinginterpreters.com/closures.html)
1. [脚本语言如何实现闭包？](https://www.zhihu.com/question/48850636/answer/113181336)
1. [JVM 的规范中允许编程语言语义中创建闭包(closure)吗？](https://www.zhihu.com/question/27416568/answer/36565794)
1. [Optimizing JavaScript variable access](https://blog.mozilla.org/luke/2012/10/02/optimizing-javascript-variable-access/)
1. [Grokking V8 closures for fun (and profit?)](https://mrale.ph/blog/2012/09/23/grokking-v8-closures-for-fun.html)
1. [为什么函数调用要用栈实现？](https://www.zhihu.com/question/34499262/answer/59415153)
1. [求讲解下列链接以及 pascal 嵌套子程序是如何实现的](https://www.zhihu.com/question/31208722/answer/51050003)
1. [栈帧内返回地址是在 local variables 前还是在它们后面？](https://www.zhihu.com/question/33920941/answer/57597076)
