# 解析器

Babel 使用`defineType`来定义一个节点类型，自动生成相关构造函数、别名、类型检测函数 。

```js
defineType('BinaryExpression', {
  builder: ['operator', 'left', 'right'],
  fields: {
    operator: {
      validate: assertValueType('string'),
    },
    left: {
      validate: assertNodeType('Expression'),
    },
    right: {
      validate: assertNodeType('Expression'),
    },
  },
  visitor: ['left', 'right'],
  aliases: ['Binary', 'Expression'],
})
```

## 解析

1. [The Super Tiny Compiler](https://github.com/jamiebuilds/the-super-tiny-compiler)
1. [Creating custom JavaScript syntax with Babel](https://lihautan.com/creating-custom-javascript-syntax-with-babel/)
