# Name Scope & Binding

Object lifetime
binding lifetime

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
