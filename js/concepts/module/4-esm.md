# 用法

1. [MDN ES Module](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)
1. [ES6 Module Loading More Complicated Than You Think](https://humanwhocodes.com/blog/2016/04/es6-module-loading-more-complicated-than-you-think/)
1. [ES modules: A cartoon deep-dive](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/)
1. [dynamic import 动态导入模块](https://github.com/tc39/proposal-dynamic-import)
1. [Loader Specification](https://whatwg.github.io/loader/)
1. [v8 Javascript Module](https://v8.dev/features/modules)

模块作用域（Module Scope）

同一个模块全局只有一个示例

# 机制

1. 静态机制，要经过解析和运行两个阶段
1. import readonly，导入的符号只读
1. import 语句提升，会在模块加载前初始化
1. 导入符号是引用形式，不是拷贝，所以引用内容发生变化得到的值也会变化

# 导入

# 导出

```
// 这里的语法是 export default FunctionDeclaration，不是匿名函数表达式
export default function {}

// 对象属性绑定类似
var obj = {
  "default": function() {}
};
console.log(obj.default.name); // "default"

// 导出的名称在lexicalEnvironment中，而不是variableEnvironment
export var a = 1;
```

对应规范 15.2.3.2，这里存在副作用，如果 HoistableDeclaration 没有"default"则添加

ExportDeclaration : export default HoistableDeclaration

## 导出

```js
// 单个导出
export const variable = 1;
export function FunctionName() {}
export class ClassName {}

// 多个导出，注意export {} 是导出语法，而不是export关键字加上了一个对象{}
export { variable, FunctionName, ClassName }

// 重命名导出
export { variable as variable1, FunctionName as FunctionName1, ClassName as ClassName1 }

// 默认导出
export default expression;
export default function (…) { … } // also class, function*
export default function name1(…) { … } // also class, function*
export { name1 as default, … };

// Aggregating modules
export * from …;
export { name1, name2, …, nameN } from …;
export { import1 as name1, import2 as name2, …, nameN } from …;
export { default } from …;
```

### 导入

```js
import defaultExport from "module-name";
import * as name from "module-name";
import { export } from "module-name";
import { export as alias } from "module-name";
import { export1 , export2 } from "module-name";
import { foo , bar } from "module-name/path/to/specific/un-exported/file";
import { export1 , export2 as alias2 , [...] } from "module-name";
import defaultExport, { export [ , [...] ] } from "module-name";
import defaultExport, * as name from "module-name";

// 副作用导入，仅为了运行模块中的全局代码而不导入任何内容
import "module-name";

// 动态
var promise = import("module-name");//这是一个处于第三阶段的提案。
```

注意默认导出和默认导入配对使用，命名导出和命名导入配对使用，二者不能混用。一个模块中默认导出导入只能有一个。

## Javascript 执行环境（Execution Context）

EnvironmentRecord

1. DeclarativeEnvironmentRecord VariableDeclaration/FunctionDeclaration/CatchClause
   1. FunctionEnvironmentRecord
   1. ModuleEnvironmentRecord [[OuterEnv]] -> Global
1. ObjectEnvironmentRecord WithStatement
1. GlobalEnvironmentRecord 有预先初始化的一组标识符绑定到全局对象上

模块标识符是活绑定（Live Binding）的处理

Import Binding 指向另一个模块的导出值，是实时求值的

It creates a new initialized immutable indirect binding for the name N.

https://tc39.es/ecma262/#sec-module-environment-records-getbindingvalue-n-s

标识符绑定（Binding）的状态

# intro

1. Let declarationNames be the BoundNames of HoistableDeclaration.
2. If declarationNames does not include the element "_default_", append "_default_" to
   declarationNames.
3. Return declarationNames.
4. ES Module 静态机制 对比动态模块
5. [ES6 Module Spec](https://tc39.es/ecma262/#sec-modules) in browser ES Module 把模块的解析划分为三个阶段，这是与 Node 环境的模块加载机制重大区别，浏览器环境要求模块**下载**不能阻塞主线程
   1. https://html.spec.whatwg.org/multipage/webappapis.html#resolve-a-module-specifier
   1. load module [HTML Spec](https://html.spec.whatwg.org/#fetch-a-module-script-tree) [module map](https://html.spec.whatwg.org/multipage/webappapis.html#integration-with-the-javascript-module-system)
   1. Module Record -> Module Instance 浏览器怎么处理 ES Module 的？
   1. Module steps
   1. Construction -> 1. module resolution process， 总共三步 1 module name -> 2 url （远程或者本地） -> 3 read module source -> 4 parse as module record
      module loader 负责前两步
   1. Instantiation ->
   1. Evaluation

# 动态导入

```js
const HighChart = await import('https://code.highcharts.com/js/es-modules/masters/highcharts.src.js');
Highcharts.default.chart('container', { ... }); // Notice `.default`
```

# Node ESM

https://nodejs.org/api/packages.html#determining-module-system

# V8 ESM

1. [v8 Javascript Module](https://v8.dev/features/modules)
