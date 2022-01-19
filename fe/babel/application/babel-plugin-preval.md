# babel-plugin-preval

四种形式

1. Program 使用@preval 首行注释标记的文件整个替换为导出值
1. ImportDeclaration 使用 preval 注释的导入语句替换为赋值语句，值为模块运行的结果
1. TaggedTemplateLiteral 自身替换为模板字符串作为模块执行的结果
1. CallExpression preval.require 函数调用，替换为模块调用结果，可以传参

注意的要点

1. preval 的模块需要在编译时运行，借助 require-from-string 包实现，这里值的探究，如何将动态运行一个模块？
1. preval 的模块可以导出一个函数，这时函数的运行结果才是最终得到的值
1. preval 使用的函数运行时接受参数，这些参数需要在编译时能够求值，否则会报错

```js
import a from /* preval(1) */ './test'

preval`module.exports = 1`

preval.require('./test', 1, 2)

// @preval
module.exports = 1 + 1
```

1. babel-plugin-lodash
1. babel-plugin-preval
1. babel-plugin-macro
1. https://lihautan.com/babel-macros/
1. [awesome babel macro](https://github.com/jgierer12/awesome-babel-macros)
