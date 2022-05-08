# ESM

字段 main/module/type/field/imports/exports

node 如何区分 commonjs 和 es module
https://nodejs.org/api/modules.html#modules-commonjs-modules

package#module

[rollup](https://github.com/rollup/rollup/wiki/pkg.module)

Tree Shaking

[tree-shaking package.json#module](https://loveky.github.io/2018/02/26/tree-shaking-and-pkg.module/)
[rollup](https://rollupjs.org/guide/en/#tree-shaking)
[rollup core functionality](https://rollupjs.org/guide/en/#core-functionality)
[webpack tree shaking](https://webpack.js.org/guides/tree-shaking/)

[setting up multi-platform npm packages](https://2ality.com/2017/04/setting-up-multi-platform-packages.html)

[Node Packages](https://nodejs.org/api/packages.html)
[Node Modules All Together](https://nodejs.org/api/modules.html#modules_all_together)
[What'is the "module" package.json field for？](https://stackoverflow.com/questions/42708484/what-is-the-module-package-json-field-for)

[ESBuild main field](https://esbuild.github.io/api/#main-fields)

[WRT PR #3 - ES module detection #13](https://github.com/nodejs/node-eps/issues/13)
[jsnext:main – should we use it, and what for? #5](https://github.com/jsforum/jsforum/issues/5)
[Webpack and rollup the same but different](https://medium.com/webpack/webpack-and-rollup-the-same-but-different-a41ad427058c)

## 模块格式

Node 同时支持 CommonJS 和 ES 模块格式，增加了规则用来区分 js 代码使用那种模块格式。

首先 JS 代码的来源有几种

1. --eval 参数、标准输入
1. 本地文件
1. import /import() / require

1. 命令行参数 --input-type 可以是 commonjs 或者 module
1. package.json#type 字段可以是 commonjs 或者 module
1. 文件后缀可以是 .js/.cjs（commonjs）/.mjs（module）

其中.mjs/--input-type=module 或者 package.json#type=module 显式指定使用 ES 模块，
.cjs/--input-type=commonjs 或者 package.json#type=commonjs 显式指定使用 commonjs 模块，
为显式指定的情况.js/没有--input-type 参数/没有 package.json#type 字段的情况隐式的使用 commonjs 模块，向前兼容支持。
显式由于隐式，库的作者不应该省略 type 字段。

`require()`引入 ES 模块时会报错。
`import`呢？

Calling require() always use the CommonJS module loader. Calling import() always use the ECMAScript module loader.

其他后缀的文件在被 require 的时候被当做是 commonjs 模块
Files with an extension that is not .mjs, .cjs, .json, .node, or .js (when the nearest parent package.json file contains a top-level field "type" with a value of "module", those files will be recognized as CommonJS modules only if they are being required, not when used as the command-line entry point of the program).

具体分析几种模块入口的情况

1. 入口模块 --eval / 标准输入
1. require('name') 中如何根据 name 确定
1. import 'name'或者 import('name') 中如何确定

如果在 commonjs 模块中使用了`import/export`关键字，会提示语法报错。ES 模块不能也可以使用 require 和 module 变量

```txt
ReferenceError: require is not defined in ES module scope, you can use import instead
```

ES 模块支持导入 commonjs 模块， ES 模块中 require.main 是 undefined，不存在的。

[Modules Enabling](https://nodejs.org/api/modules.html#enabling)
[Determining Module System](https://nodejs.org/api/packages.html#determining-module-system)
