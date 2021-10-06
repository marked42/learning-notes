# 函数机制

解释下为什么要有 activation records

如果函数在运行时只能有一份调用，函数的局部变量是全局唯一，可以静态分配，缺点。

1. 不支持递归调用
1. 支持多线程，多个线程调用同一个函数

Pascal 支持嵌套函数但是不支持函数作为返回值，C 支持函数作为返回值但是不支持嵌套函数，

TODO:

高阶函数，闭包的引入

1. 返回值与返回地址的处理
1. static link

> It is the combination of nested functions (where inner functions may use variables defined in the outer functions) and functions returned as results (or stored into variables) that causes local variables to need lifetimes longer than their enclosing function invocations.

子程序（subroutine）是命令式（imperative）编程语言中对一组命令的抽象，将一个名称和一组命令关联起来，通过使用名称来执行命令。子程序可以接受参数，通过参数控制具体的行为。子程序定义处的参数称为形参（parameter/formal parameter），调用时传入的具体参数值称为实参（argument/actual parameter）。带有返回的子程序称为函数（function），不带返回值的称为过程（procedure），在无歧义的情况下后续统称为函数。

为什么使用栈来实现函数调用，LIFO

TODO:

1. 运行时程序内存布局 图片 Code/Static/Heap <- Free Memory -> Stack 又叫 control stack

1. stack layout
1. calling sequence 如何形成维护栈帧
1. static chain nonlocal variable nested subroutines
1. closure

Actual Parameters
Returned Values
Control Link/Dynamic Link
Access Link/Static Link
Saved Machine Status return address/saved registers
Local Data
Temporaries

函数运行的三种流程情况

1. 子函数正常调用并返回
1. 程序出错无法继续执行
1. 程序抛出异常则栈展开（unwinding）到能够处理异常的栈帧。

## 栈帧（Stack Frame）

也叫激活记录（Activation Record）

栈帧包含哪些信息

1. 实参、函数返回值
1. 函数返回地址 又叫做 dynamic link
1. 嵌套函数实现非局部变量 static link/display
1. 保存的寄存器
1. 局部变量
1. 临时信息

程序运行需要的其他信息

1. stack pointer register 栈顶（当前最后一个分配的内存地址）或者栈顶向下偏移（栈向低地址增长）一个字节的位置（第一个未分配的内存地址），不同的约定。
1. frame pointer register 指向当前栈帧开头的位置，使用偏移访问指令（displacement addressing），如何处理不定长的参数或者局部变量？

1. caller 调用者
1. callee 被调用者
1. calling sequence 调用者在被调用者执行前后执行的指令
1. return sequence ?
1. prologue 被调用者执行前运行的指令
1. epilogue 被调用者执行后运行的指令

栈帧中 caller 负责把对实参进行求值，

7.2.3 calling sequence

1. access link/static link/dynamic link
1. global display
1. precall sequence
1. postreturn sequence
1. prologue sequence
1. epilogue sequence

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

大多数任务可以是调用者完成，也可以是被调用者负责完成，但是传参需要调用者完成，区分这两种情况， caller save register/callee save register。

需要保存到栈上的寄存器 调用者和被调用者都使用到的寄存器，分别编译模型造成准确分析困难，所以可以由调用者保存所有用到的寄存器或者被调用者保存所有会覆盖的寄存器。

TODO: 栈上的变长数据 7.2.4 栈帧内使用指针类型表示变长数据，将变长数据本身保存在当前的栈帧之后，变长数据不属于栈帧，所有数据相对于栈帧起始位置偏移量可以编译时确定。

寄存器分为三个种类 Tiger P 129

1. 特殊目的寄存器
1. caller save registers 调用者负责保存
1. callee save registers 被调用者负责保存，为了减小代码尺寸，提高运行效率，局部变量可以保存在这里

typical calling sequence

对于 leaf procedure 的优化，可以都在寄存器中完成，会非常快。

static link chain / display

TODO: calling convention C++

## 传参方式 Parameter Passing

传参方式

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

可选参数、默认参数、命名参数、变长参数

1. Essentials of Programming Language

## Closure

COPL 9.12

## Exception Handling 异常机制

PLP 9.4
COPL 14

## 协程 Coroutine

PLP 9.5

iterator/generator

## Event

PLP 9.6
COPL 14

## 参考

1. PLP 9
1. COPL 9
1. COPL 10
1. Engineering a Compiler Chapter 6. The Procedure Abstraction
1. Modern Compiler Implementation in C Chapter 6. Activation Records
1. Advanced Design and Implementation of Virtual Machines Chapter 8. Stack Unwinding
1. Compilers Principles Techniques and Tools Chapter 7

TODO: 习题 Tiger Book Chapter 6. Activation Record
