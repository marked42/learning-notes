# eval

DirectCall/Indirect Call

https://tc39.es/ecma262/#sec-grouping-operator

表达式的结果什么时候是引用，什么时候是普通值 GetValue()

表达式、引用、lvalue、rvalue

```js
// 获取全局对象
function global() {
	return eval("this") || (0, eval)("this");
}
```

1. [(1, eval)('this') vs eval('this') in JavaScript?](https://stackoverflow.com/questions/9107240/1-evalthis-vs-evalthis-in-javascript/9107491#9107491)
1. [Why is (0,obj.prop)() not a method call?](https://2ality.com/2015/12/references.html)
