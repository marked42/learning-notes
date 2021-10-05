# 函数机制

子程序（subroutine）是命令式（imperative）编程语言中对一组命令的抽象，将一个名称和一组命令关联起来，通过使用名称来执行命令。子程序可以接受参数，通过参数控制具体的行为。子程序定义处的参数称为形参（parameter/formal parameter），调用时传入的具体参数值称为实参（argument/actual parameter）。带有返回的子程序称为函数（function），不带返回值的称为过程（procedure），在无歧义的情况下后续统称为函数。

TODO:

1. stack layout
1. calling sequence 如何形成维护栈帧
1. static chain nonlocal variable nested subroutines
1. closure
1. 参数传递和返回值 parameter passing / return
1. 异常 iterator/generator
1. 协程 coroutine

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
1. prologue 被调用者执行前运行的指令
1. epilogue 被调用者执行后运行的指令

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

寄存器分为三个种类

1. 特殊目的寄存器
1. caller save registers 调用者负责保存
1. callee save registers 被调用者负责保存，为了减小代码尺寸，提高运行效率，局部变量可以保存在这里

typical calling sequence

对于 leaf procedure 的优化，可以都在寄存器中完成，会非常快。

static link chain / display

TODO: calling convention C++

## 传参方式 Parameter Passing

传参方式

1. 值 call by value
1. 引用 call by reference
1. 闭包 closure call by sharing

可选参数、默认参数、命名参数、变长参数
