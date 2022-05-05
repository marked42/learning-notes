# Module Resolution

TS 如何分析确认每个模块及其类型的

区分 script 和 module，不包含 import/export 和顶层 await 语句的认为是 script，使用`export {}`强制为模块
二者作用域不同，脚本代码位于全局作用域，模块代码位于模块作用域

## 确定配置文件

确定配置文件 jsconfig.json/tsconfig.json 命令行-p/--project

package.json#types

--showConfig

# files/include/exclude

files 字段不存在则默认包括.tsconfig.json 下所有文件
files: [] 表示不包含任何文件

package.json#include/exclude/files

文件匹配使用文件相对于 tsconfig.json 所在目录的路径

```json
{
  "include": [
    // 等价于 src/**/*.ts src/**/*.tsx src/**/*.d.ts
    // 通配符不带有后缀名的话，默认支持.ts/.tsx/.d.ts
    // 如果 allowJs: true的话 还会包括 src/**/*.js src/**/*.jsx
    "src/**/*",

    // 与上边等价
    "src"
  ],
  "exclude": [
    // 只对include生效，默认排除这些 node_modules", "bower_components", "jspm_packages" and "<outDir>
    // 但是files字段、import语句、triple slash、types字段等方式指定的文件还是会被当做输入
  ]
}
```

# built-in lib

lib
noLib 禁用 lib 选项，不引入任何定义
skipDefaultLibCheck
skipLibCheck 不对 lib 定义进行类型检查

内置 [lib](https://www.typescriptlang.org/tsconfig#lib) 的分类

语言本身的类型定义 Promise/Array/...
运行环境的内置 API 的类型定义 DOM/fetch/browser/webworker/node

根据 target 字段的值决定 lib 字段的默认值

For Target ES5 : "DOM", "ES5", "ScriptHost"
For Target ES2015 : "DOM", "ES6", "DOM.Iterable", "ScriptHost"

可以根据实际运行环境的情况，使用 lib 字段指定引入的内置库

应用场景

1. 在"target: es5"且使用了 polyfill 的情况下，手动引入 ES2015.Promise
1. 默认情况下引入了 DOM 运行环境不同
1. 运行环境部分支持新的语言特性，需要精确指定

使用 noLib 禁用 lib 字段，不引入任何 built-in lib，这种情况下期望提供自己的内置库类型定义

[built-in lib replacement](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#supporting-lib-from-node_modules)
[lib replacement](https://devblogs.microsoft.com/typescript/announcing-typescript-4-5-beta/#supporting-lib-from-node_modules)

# third-party types

typeRoots 默认是所有的 node_modules/@types 目录
types 默认导入 typesRoots 目录下所有子目录，方便 IDE 根据这些信息自动提示模块名和类型名

package.json 使用使用 types or typings 字段指定类型文件

对于自身没有提供类型定义的库，使用三方定义

[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)

# path map

模块导入分为两类

Relative vs. Non-relative module imports

relative import is one that starts with /, ./ or ../. Some examples include:
relative 相对路径模块 包括 `./`、`../`、`/`等指定具体文件路径的名称
相对导入（relative import）**不能使用 Ambient Module declaration**（TODO:），适用与用户自己编写的文件。

```js
import Entry from './components/Entry'
import { DefaultHeaders } from '../constants/http'
import '/mod'
```

## classic module resolution

经典模块解析方法是为了向前兼容保留的选项，通常不会使用，node 模块解析选项是与 Node 寻找模块的机制一致的方法。

```js
// /root/dir/sub/example.ts
import 'package'
```

对于在文件`example.ts`中引入非相对模块`package`，首先会在文件所在目录寻找模块`package.ts`或者`package.d.ts`，找不到的话向上
一层目录寻找直到根目录，所有目录中都找不到的话抛出错误。

寻找的完整路径如下

```js
/root/dir/sub/package.ts
/root/dir/sub/package.d.ts
/root/dir/package.ts
/root/dir/package.d.ts
/root/package.ts
/root/package.d.ts
/package.ts
/package.d.ts
```

## node module resolution

node 的模块解析策略增加了对于[目录模块](https://nodejs.org/api/modules.html#folders-as-modules)的支持，

### 相对模块导入

```js
// /root/src/moduleA.ts
import { b } from './moduleB'
```

相对模块的所有的路径

```txt
// file module
/root/src/moduleB.ts
/root/src/moduleB.tsx
/root/src/moduleB.d.ts

// folder module
/root/src/moduleB/package.json (if it specifies a types property)
/root/src/moduleB/index.ts
/root/src/moduleB/index.tsx
/root/src/moduleB/index.d.ts
```

### 非相对模块导入

非相对路径模块，相对于 node_modules 模块，而且沿着文件路径逐层向上，增加了对于@types 的支持

```txt
/root/src/node_modules/moduleB.ts
/root/src/node_modules/moduleB.tsx
/root/src/node_modules/moduleB.d.ts
/root/src/node_modules/moduleB/package.json (if it specifies a types property)
/root/src/node_modules/@types/moduleB.d.ts
/root/src/node_modules/moduleB/index.ts
/root/src/node_modules/moduleB/index.tsx
/root/src/node_modules/moduleB/index.d.ts

<!-- 向上一层目录 -->
/root/node_modules/moduleB.ts
/root/node_modules/moduleB.tsx
/root/node_modules/moduleB.d.ts
/root/node_modules/moduleB/package.json (if it specifies a types property)
/root/node_modules/@types/moduleB.d.ts
/root/node_modules/moduleB/index.ts
/root/node_modules/moduleB/index.tsx
/root/node_modules/moduleB/index.d.ts

<!-- 向上一层到达根目录 -->
/node_modules/moduleB.ts
/node_modules/moduleB.tsx
/node_modules/moduleB.d.ts
/node_modules/moduleB/package.json (if it specifies a types property)
/node_modules/@types/moduleB.d.ts
/node_modules/moduleB/index.ts
/node_modules/moduleB/index.tsx
/node_modules/moduleB/index.d.ts
```

Any other import is considered non-relative. Some examples include:

baseUrl 影响 非相对模块导入 ./..//的解析是相对于 baseUrl 的

非相对模块都是针对 baseUrl 而言的，首先进行 path mapping 的替换，

```js
import \* as $ from "jquery";
import { Component } from "@angular/core";
```

paths 影响 相对模块导入

```js
// 相对路径 ok
import { b } from './src/b'
// 绝对路径 报错
import { b } from 'src/b'
// a.ts:1:19 - error TS2307: Cannot find module 'src/b' or its corresponding type declarations.
```

path 配置 { "box": "src/b" }时，会根据替换的路径去寻找模块，但是输出的文件中不会修改模块路径

```ts
// a.ts
import { b } from 'box';
console.log( b );
--------------------------------------------------------------------
// dist/a.js
var box_1 = require("box"); // 运行时 require("box")报错，因为路径不对，找不到box
console.log(box_1.b);
```

可以使用 module-alias 来解决

```js
// package.json
{
    "name": "sample",
    "_moduleAliases": {
        "box": "dist/src/b"
    },
    "devDependencies": {
        "module-alias": "^2.2.2"
    }
}
```

使用`node -r module-alias/register dist/a.js`或者在入口脚本顶部引入 register

```js
// dist/a.js
require('module-alias/register')
var box_1 = require('box') // 运行时 require("box")报错，因为路径不对，找不到box
console.log(box_1.b)
```

或者使用 tsconfig-paths 包

resolveJsonModule
allowJs

默认导出的语法情况

```js
// values.ts
export default var A = "Apple"; // ❌ invalid syntax
export default enum D{} // ❌ illegal: not a function or class
export default class B {} // ✅ legal
export default function C(){} // ✅ legal
```

# single module

import/export/triple slash directive/require
--noResolve

--traceResolution
--moduleResolution classic/node

代码中使用 `import`/`require`/triple slash 等形式指定的文件也会被作为输入处理

这两种形式都是找不到对应模块的，Headline.vue 会被尝试寻找 Headline.vue.ts/Headline.vue.d.ts
只能匹配上 Ambient Module Declaration。
`import { add } from './math.js'`是特殊的，可以带后缀`.js`会被自动去除掉之后进行匹配。

```ts
export { default as Headline } from './components/Headline.vue'
export { default as Headline } from '@/Headline.vue'
```

模块的导入导出语法

支持 ESModule 的所有 import/export 语法[export](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/export)，在此基础进行添加更多语法支持

[import/export assignment](https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require)

```ts
import type { add } from 'math'
import { type add } from 'math'
import fs = require('fs')

export type Text = string

export = 'fs'
```

# diagnostic

https://www.typescriptlang.org/tsconfig#diagnostics

--listFilesOnly

--listFiles
--listEmittedFiles

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "explainFiles": true,
    "listFiles": true,
    "listEmittedFiles": true,
    "traceResolution": true,
    // 配合 Babel/webpack使用，只进行类型检查，不输出文件
    "noEmit": true,
    // 默认情况下类型检查出现错误也会继续输出，配合watch使用， noEmitOnError禁用此行为
    "noEmitOnError": true
  }
}
```

# output

rootDir

根据所有输入文件路径计算最长的公共路径 longest common path 作为 rootDir，显式的指定 rootDir 的值时，必须包含计算出的结果，否则非法。
rootDir 路径必须包含所有的输入文件，否则编译时会抛出错误 Error TS6059

```txt
Error TS6059: File '/projects/sample/a.ts' is not under 'rootDir' '/projects/sample/src'. 'rootDir' is expected to contain all source files.
```

Typescript 编译输出文件时会 input 文件与 rootDir 的相对位置作为 output 文件与 outDir 的相对位置，也就是保留 rootDir 下的文件结构

rootDirs

[--module](https://www.typescriptlang.org/tsconfig#module)
--target

declaration
declarationDir
emitDeclarationOnly

isolatedModules

removeComments 输出文件中删除注释

outFile 将所有输出文件合并为一个文件，只能在 module: None/System/AMD 的情况下使用，这几种格式适用于全局脚本情况，其他模块需要多个文件之间的相对路径进行引用，合并后丢失路径信息，没有意义。
outDir

## sourceMap

```js
{
  "version": 3,
  // 输出文件名字
  "file": "b.js",
  "sourceRoot": "",
  // 输入文件
  "sources": [ "./src/b.ts" ],
  "names": [],
  // 映射
  "mappings": "CAAA,SAAAA,GAAA,GAAAA,..."
}
```

mapRoot map 文件的 baseUrl 位置
sourceMap
declarationMap

```js
// b.js
var b = 'B'
// 浏览器会读取这里记录的map文件
//# sourceMappingURL=b.js.map   ⫷
```

默认情况下.map 文件的位置是相对于原始文件，但是 map 文件可能单独部署在不同的路径，这时使用 `"mapRoot": "http://debug.com/dist"` 属性。

```js
// b.js
var b = 'B'
//# sourceMappingURL=http://debug.com/dist/src/b.js.map
```

inlineSourceMap

```js
'use strict'
const helloWorld = 'hi'
console.log(helloWorld)
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMifQ==
```

sourceMap
mapRoot 使用 URL `http://debug.com/dist` 或者相对路径 `../map` 此选项只影响生成出的 sourceMappingURL，不影响.map 文件的输出位置
inlineSourceMap 针对 mappings 字段

sourceRoot

```json
{
    "include": [
        "a.ts",
        "src/**/*"
    ],
    "compilerOptions": {
        "outDir": "dist",
        "sourceMap": true,
        "mapRoot": "http://debug.com/dist/",
        "sourceRoot": "http://source.com/"   ⫷
    }
}
```

影响生成的 sourceRoot 字段，最终预期从地址 "http://source.com/src/b.ts"能够获取源文件

```json
// b.js.map
{
  "version": 3,
  "file": "b.js",
  "sourceRoot": "http://source.com/",
  "sources": ["src/b.ts"],
  "names": [],
  "mappings": "AAAA,OAAO;AACP,IAAI,CAAC,GAAG,GAAG,CAAC"
}
```

inlineSources 控制源码直接生成到 sourceContent 字段

```json
// b.js.map
{
  "version": 3,
  "file": "b.js",
  "sourceRoot": "",
  "sources": ["../../src/b.ts"],
  "names": [],
  "mappings": "AAAA,OAAO;AACP,IAAI,CAAC,GAAG,GAAG,CAAC",
  "sourcesContent": ["// b.js\nvar b = 'B';\n"]
}
```

declarationMap 用来描述 declaration 文件和源文件.ts 的映射关系，IDE 用来支持点击 declarationMap 跳转源码的功能

https://www.bugsnag.com/blog/source-maps

# type checking

控制是否进行类型检查

allowJs false 时 include 中剔除 .js
checkJs
// @ts-nocheck
// @ts-ignore

# Project References

https://www.typescriptlang.org/docs/handbook/project-references.html

# Module & Namespace

1. 内置环境类型 built-in lib
1. 三方库 @types
1. 自己编写的
1. 全局环境 shims ambient module declare 语句 declare module "a.vue"; [wildcard module declaration](https://www.typescriptlang.org/docs/handbook/modules.html#wildcard-module-declarations)

1. 包的形式

[UMD modules](https://www.typescriptlang.org/docs/handbook/modules.html#umd-modules)

"extends"

All the objects are merged deeply while arrays are overridden.

# other

downleveling
importHelpers
noEmitHelpers
esModuleInterop
allowSyntheticDefaultImports

[Understanding TypeScript’s “Compilation Process” & the anatomy of “tsconfig.json” file to configure TypeScript Compiler](https://medium.com/jspoint/typescript-compilation-the-typescript-compiler-4cb15f7244bc)
[Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
[Handbook Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html)
[References Modules](https://www.typescriptlang.org/docs/handbook/modules.html)
[Typescript Blog](https://devblogs.microsoft.com/typescript/)

[尽量不要使用 namespace ](https://www.typescriptlang.org/docs/handbook/modules.html#do-not-use-namespaces-in-modules)

[Resources on Typescript](https://exploringjs.com/tackling-ts/ch_resources-on-typescript.html)
[Typescript Deep Dive](https://basarat.gitbook.io/typescript/overview)
[Tackling TypeScript](https://exploringjs.com/tackling-ts/toc.html)
[Typescript for Professionals](https://www.udemy.com/course/typescript-for-professionals/?referralCode=6EAA891A31A56E169625)

[Uday Hiwarale](https://thatisuday.medium.com/)

Typescript Internal

[Typescript Specification](https://github.com/microsoft/TypeScript/blob/main/doc/spec-ARCHIVED.md)
[Using the Compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API)
[How The Typescript Compiler Compiles](https://www.youtube.com/watch?v=X8k_4tZ16qU)
[How does TypeScript work? The bird’s eye view](https://2ality.com/2020/04/typescript-workflows.html)
[mini-typescript](https://github.com/sandersn/mini-typescript#mini-typescript)
[Typescript Compiler Notes](https://github.com/microsoft/TypeScript-Compiler-Notes/)
[Typescript Compiler Internal](https://basarat.gitbook.io/typescript/overview)
[Resources for Amateur Compiler Writers](https://c9x.me/compile/bib/)

# type system

1. type inference
   1. let
   1. const
   1. literal type
   1. as const
1. intersection/ union/discriminated union
1. structural typing
1. top type/bottom type any/unknown
1. keyof
1. type assertion
   1. as
   1. 箭头方式 <>
1. type guard
   1. typeof
   1. in
   1. instanceof
   1. user defined type guard assert /is
1. this type

[Understanding the Typescript's type system and some must-know concepts](https://medium.com/jspoint/typescript-type-system-81fdb84bba75)
