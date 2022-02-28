# 作用域机制

## 作用域

这其中有作用域相关的节点操作 BindingIdentifier/IdentifierReference/Scope Let/Var

validators/isScope
validators/isScopable
isBlockScoped
ast-types 作用域相关的节点别名有 Scopable/BlockParent/Block 等

1. retrievers
1. validators
1. converters
1. noScope 选项会造成遍历得不到 callExpression traverse(expr, { noScope: true })

## 不变性

validators/isImmutable

## 副作用

isPure
