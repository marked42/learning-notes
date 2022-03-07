# eval

## 直接调用

`eval`使用的是当前作用域，因为需要保留作用域链，直接调用成本较高，性能差

```js
var x = 'global'
function test() {
  var x = 'local'
  return eval('x') // direct eval
}
test() // "local"
```

## 间接调用

`eval`使用的是全局作用域

```js
var x = 'global'
function test() {
  var x = 'local'
  var f = eval
  return f('x') // indirect eval
}
test() // "global"
```

DirectCall/Indirect Call

https://tc39.es/ecma262/#sec-grouping-operator

表达式的结果什么时候是引用，什么时候是普通值 GetValue()

表达式、引用、lvalue、rvalue

```js
// 获取全局对象
function global() {
  return eval('this') || (0, eval)('this')
}
```

1. [(1, eval)('this') vs eval('this') in JavaScript?](https://stackoverflow.com/questions/9107240/1-evalthis-vs-evalthis-in-javascript/9107491#9107491)
1. [Why is (0,obj.prop)() not a method call?](https://2ality.com/2015/12/references.html)

1. Effective Javascript Item 16 / Item 17
