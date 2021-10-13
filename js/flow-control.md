# 流程控制

使用 CompletionRecord 规范类型来描述程序执行的流程。

类型

1. normal
1. return function
1. break for / while / switch
1. continue Labelled Statement for/while
1. throw

抽象操作

1. NormalCompletion
1. Completion
1. ReturnIfAbrupt 效果相当于宏展开（简写）而不是函数调用 将 throw 类型向上抛出 propagation
1. throw a TypeError exception 相当于 return Completion({ type: throw })
1. 隐式的返回 return Infinity 隐式的返回 NormalCompletion(Infinity)
1. ? AbstractOp 抛出异常或者获得正常返回值 forwards any errors
1. ! AbstractOp 保证不抛出异常 asserts not abrupt
1. UpdateEmpty 用来描述顺序的连续语句执行的流程控制过程，主要用来描述多个 Statement 的顺序流程控制过程。只保留最后一个 producing item 的 value

LabelledStatement 引入 label set，是 continue label 的跳转目标。

具体的流程控制由虚拟机或者编译器实现。
