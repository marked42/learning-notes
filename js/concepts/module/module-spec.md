# 模块机制

### Export

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

1. Let declarationNames be the BoundNames of HoistableDeclaration.
2. If declarationNames does not include the element "_default_", append "_default_" to
   declarationNames.
3. Return declarationNames.

CommonJS

1. 解释 module.exports/exports 几种不同用法的含义，应该禁用使用 exports 的方式避免落入陷阱

```js
module.exports = 1

exports = 2

module.exports.a = 1
exports.a = 2
```

1. dependency hell 问题
1. 在 Windows 系统中，文件路径最大长度为 260 个字符

1. webpack resolve.modules ?
1. https://nodejs.org/api/module.html#modulecreaterequirefilename

1. 代码热更新 http://fex.baidu.com/blog/2015/05/nodejs-hot-swapping/
