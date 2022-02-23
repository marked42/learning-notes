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
