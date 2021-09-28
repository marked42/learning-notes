# 总结

编译原理的相关内容

编译流水线的划分

前端 中端 后端

词法解析 -> 语法解析 -> 语意分析 (semantic analysis) -> 中间代码 -> 优化 -> 字节码 -> 机器码

1. parsing
1. 语义分析
   1. 符号、作用域 抽象数据结构符号表 (abstract data structure symbol table)
      1. 全局作用域 同名符号定义，后面覆盖前边
      1. 局部作用域
      1. 嵌套作用域 内层作用域可以看到外层作用域定义的变量，内层作用域声明的符号覆盖外层作用域同名符号，如果形成 scope tree 每种作用域什么时候创建，添加到栈顶，什么时候结束
   1. 静态类型检查
1. IR generating
   1. ast [参考](#LIP)
1. 执行模型 syntax directed/ast tree walk/ activation record
1. optimization
1. 语言特性
   1. 闭包机制
   1. 面向对象
   1. 垃圾收集

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

## 类型检查

1. 计算所有表达式的类型
1. 类型之间的关系
   1. same 同样的类型
   1. compatible / assignable 兼容的类型
1. 自动类型提升，CPU 进行算数运算时使用相同类型的操作数， narrow type -> widen type 类型提升不能损失信息 type promotion
   1. 算数运算的类型提升，narrowest -> widest 全序排列，窄类型提升到宽类型
   1. declaration
   1. assignment 赋值语句类型提升
   1. call parameters/return type
1. 类型安全检查 与类型提升紧密结合
   1. 赋值类型兼容
   1. 函数调用类型的 callee 必须是函数
   1. a.b 中 a 必须是 struct 或者 class
1. 面向对象类型安全
   1. 类实例能否赋值给类，实例类必须是目标类或者目标类的子类
   1. 类指针类型是否兼容

attribute grammar 使用属性语法描述？

类型检查实现分为三趟

1. 解析源码构建 ast
1. 遍历 ast 构建 scope tree
1. 遍历 ast 进行类型分析

## 参考资料

1. <span id="MCIIC"> Modern Compiler Implementation In C
1. <span id="LIP"> Language Implementation Patterns
