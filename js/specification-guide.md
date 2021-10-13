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

OrdinaryGetOwnProperty is called “ordinary” since it operates on ordinary objects. ECMAScript objects can be either ordinary or exotic. Ordinary objects must have the default behavior for a set of methods called essential internal methods. If an object deviates from the default behavior, it’s exotic.

The most well-known exotic object is the Array, since its length property behaves in a non-default way: setting the length property can remove elements from the Array.

Asserts in the spec assert invariant conditions of the algorithms. They are added for clarity, but don't add any requirements to the implementation — the implementation doesn’t need to check them.

对于抛出错误的情况，规范只规定了错误对象的类型（TypeError），并没有规定错误对象信息，信息由实现决定。

函数也是对象，只是有一个名为`[[Call]]`的内置属性，

对象分类 ordinary objects 和 exotic objects WindowProxy 就是使用了 Exotic object 来实现[跨域 API](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy#cross-origin_script_api_access)

Property Descriptor / Data Property Descriptor / Accessor Property Descriptor

1. [JavaScript 深入之从 ECMAScript 规范解读 this](https://github.com/mqyqingfeng/Blog/issues/7)
1. [读懂 ECMAScript 规格](http://www.ruanyifeng.com/blog/2015/11/ecmascript-specification.html)

1. [parser](https://github.com/mozilla-spidermonkey/jsparagus/tree/master/jsparagus)
1. [js-quirks](https://github.com/mozilla-spidermonkey/jsparagus/blob/master/js-quirks.md#readme)
