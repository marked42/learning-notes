# 规范导读

分类

1. Grammar
1. Static semantic 静态语义 Early Error
1. Runtime semantic 运行时语义
1. API Global Object
1. Conventions

   1. Types and Values
   1. Abstract Operations
   1. Fundamental
   1. Host Defined / Exotic Object

1. AbstractOperations
1. CompletionRecord normal completion / abstract completion

   1. AbstractOperation -> CompletionRecord -> Result
   1. ReturnIfAbrupt
   1. ? AbstractOperation forwards any errors
   1. ! AbstractOperation asserts not abrupt

1. internal slot 对于普通 javascript 代码是不感知的[[This]]

对于抛出错误的情况，规范只规定了错误对象的类型（TypeError），并没有规定错误对象信息，信息由实现决定。

函数也是对象，只是有一个名为`[[Call]]`的内置属性，

对象分类 ordinary objects 和 exotic objects WindowProxy 就是使用了 Exotic object 来实现[跨域 API](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy#cross-origin_script_api_access)

1. [JavaScript 深入之从 ECMAScript 规范解读 this](https://github.com/mqyqingfeng/Blog/issues/7)
1. [读懂 ECMAScript 规格](http://www.ruanyifeng.com/blog/2015/11/ecmascript-specification.html)
