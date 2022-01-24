# 作用域相关

这其中有作用域相关的节点操作 BindingIdentifier/IdentifierReference/Scope
Identifier/IdentifierName Let/Var

1. ast-types 作用域相关的节点别名有 Scopable/BlockParent/Block 等，详细机制可以参考[插件作用域篇](./plugin-scope.md)。
1. retrievers
1. validators
1. converters
1. noScope 选项会造成遍历得不到 callExpression traverse(expr, { noScope: true })

## 合法的变量名

1. 语法合法
1. 严格模式、保留字 valid ES3 id keyword/reserved word
1. binding id
1. identifier refs
