Parsing 技术

1. vue template compiler
1. Expression Shunting Yard / TDOP
1. [.npmrc](https://docs.npmjs.com/cli/v8/configuring-npm/npmrc) [npm/ini](https://github.com/npm/ini)
1. HTML Parser
1. CSS Parser
1. XML http://aosabook.org/en/posa/parsing-xml-at-the-speed-of-light.html
1. regexp
   1. [Build a Regex Engine in Less than 40 Lines of Code](https://nickdrane.com/build-your-own-regex/)
   1. [HOW TO IMPLEMENT REGULAR EXPRESSIONS IN FUNCTIONAL JAVASCRIPT using Derivatives](http://dpk.io/dregs/toydregs)
   1. [Implementing a Regular Expression Engine](https://deniskyashif.com/2019/02/17/implementing-a-regular-expression-engine/)
   1. [藏在正则表达式里的陷阱](https://zhuanlan.zhihu.com/p/38278481)
1. glob patterns vue-router converts glob patterns to regexp
1. [markdown parser](https://www.bilibili.com/video/BV1qq4y1F7Ch)
1. HTTP
   1. [HTTP Parser](https://zhuanlan.zhihu.com/p/100660049)

## language design

功能列表

1. 基础的值与表达式类型 数字、字符串、布尔值
1. 数学运算
1. 全局作用域 变量支持，读取与写入
   1. 变量定义，不允许重复定义
   1. 变量读取，读取不存在变量报错
   1. 变量写入，写入不存在变量报错，写入只读变量报错
   1. 变量初始化之前读取，在编译时报错
1. 块级作用域、局部作用域 嵌套的环境支持 Environment/EnvironmentRecord
   1. 包含多条语句
   1. 返回值是最后一条语句
   1. 嵌套作用域
      1. 在内层可以读写外层变量
      1. 内层变量可以定义与外层变量同名的变量
      1. 内层变量覆盖同名外层变量
1. 函数
1. lambda 函数，定义，直接调用形式（Immediately Invoked）和赋值
1. 语法糖转换
   1. switch -> if
   1. for -> while
   1. ++/--/+=/-=
1. 面向对象，类支持
   1. 类定义 构造函数，普通函数 构造函数初始化的过程中，类实例的成员数据需要调用 set 或者 define 语意，区分变量的定义还是设置。
   1. new 操作符生成类实例
   1. 属性读写，区分类属性的读写和普通变量的读写，也可以可以用统一的 Reference 概念表示
   1. 父类
1. 模块支持
