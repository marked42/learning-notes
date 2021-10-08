# 执行环境与作用域

语法环境（Lexical Environment）与某种语法结构关联，包括

1. 函数声明（FunctionDeclaration）
1. 块语句（BlockStatement）
1. Try 语句的 Catch 分支（Catch Clause）

环境记录（Environment Record）包含了对应语法环境作用域中的所有标识符绑定（Binding）。

环境记录有 outer 字段指向外层环境记录，

语法环境分类

1. 全局环境（global environment），outer 为 null，包含内置的对象绑定（Math/Object 等）和全局对象（window/global/globalThis/this）
1. 模块环境（module environment），outer 是全局环境，包含了模块中顶层声明创建的标识符和导入的标识符。模块环境全局唯一？
1. 函数环境（function environment），每个函数调用对应一个函数环境，outer 是嵌套的其他语法环境，可能是全局、模块、或者函数。可能包含 this 和 super。

语法环境和环境记录是规范用来描述语言机制的工具，不是具体实现。

1. abstract EnvironmentRecord
   1. DeclarativeEnvironmentRecord var / const / let / class / module / import / function
      1. FunctionEnvironmentRecord top-level declarations within function
      1. ModuleEnvironmentRecord
      1. FunctionDeclaration
      1. VariableDeclaration
      1. CatchClause
   1. ObjectEnvironmentRecord
      1. WithStatement
   1. GlobalEnvironmentRecord script global declarations
