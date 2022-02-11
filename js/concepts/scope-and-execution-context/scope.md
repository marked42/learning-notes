# 作用域

1. 作用域链
1. Execution Context global、function、module，eval，new Function
1. 全局作用域，使用变量可以访问全局对象上的属性，或者 global/window/globalThis 访问全局对象本身。
1. VariableObject 是 ES5 之前的说法，全局作用域对象，ActionObject 代表函数作用域对象，ES6 中被 LexicalEnvironment 概念代替。
1. 函数作用域内特殊变量 arguments arguments 变量是拷贝还是引用，函数调用前准备 Lexical Environment，形参和 arguments 变量。 有哪些要处理 变量声明 var / let / const /FunctionDeclaration/ arguments / this / super / ClassDeclaration
1. 函数表达式可以匿名，不添加对应变量，但是有名称的函数表达式内可以使用名称形成递归调用。类表达式
1. 名称是否允许重复，那个具有更高优先级？ var / function 允许 / let / const
1. 函数调用分成两步 准备调用环境，执行函数代码。
1. var a = 1 声明了变量 a; 和 a = 1 只是隐式的在全局对象上增加了属性 a，没有声明变量。区别的例子。

```js
alert(a); // undefined
alert(b); // "b" is not defined

b = 10;
var a = 20;
```

EnvironmentRecord 类型

1. ObjectEnvironmentRecord global/with/ function expression
1. DeclarativeEnvironmentRecord
1. FunctionEnvironmentRecord
1. ModuleEnvironmentRecord

两个过程的细节

1. Identifier Resolution
1. 属性访问

### 变量与作用域

读写未声明的变量会隐式的在全局作用域创建该变量，使用严格模式禁用这种情况。

1. var 声明的变量是 VariableEnvironment
1. let/const 声明的变量是 LexicalEnvironment

```js
// var 声明的变量不能删除
var a = 1
delete a

// 隐式声明的变量可以被删除
x = 1
delete x

// eval中的var可以删除
eval('var b = 2')
delete b

new Function('var a = 1')
```

变量与作用域的问题

1. 变量编译时生成还是运行时生成
1. 变量是否可以读取、修改、删除
1. 可见性问题

连续复制形式，给变量值增加一个执行新变量的属性

```js
var a = { n: 1 },
	ref = a;
a.x = a = { n: 2 };
console.log(a.x); // --> undefined
console.log(ref.x); // {n:2}
```

```js
(function out() {
	var a = "out";

	function test() {
		console.log(a);

		while (false) {
			var a = "in";
		}
	}
	test();
})();
```

静态作用域 函数作为参数 downwards funarg problem

```js
let x = 10;

function foo() {
	console.log(x);
}

function bar(funArg) {
	let x = 20;
	funArg(); // 10, not 20!
}

// Pass `foo` as an argument to `bar`.
bar(foo);
```

upwards funarg problem

```js
function foo() {
	let x = 10;

	// Closure, capturing environment of `foo`.
	function bar() {
		return x;
	}

	// Upward funarg.
	return bar;
}

let x = 20;

// Call to `foo` returns `bar` closure.
let bar = foo();

bar(); // 10, not 20!
```

nonlocal variable
自由变量（free variable）指被嵌套函数捕获并且嵌套函数返回的情况下生命周期需要延长的变量，函数执行环境销毁时自由变量需要继续存在。

简单的实现可以保存执行环境中的所有变量，准确的的实现是指捕获自由变量。

```js
const obj = { foo() { return this } }
// true
(obj.foo) () === obj
// false
eval('obj.foo') () = obj
```

#### 语句的块级作用域

```js
// 一些简单的、显而易见的块级作用域包括：

// 例1
try {
  // 作用域1
}
catch (e) { // 表达式e位于作用域2
  // 作用域2
}
finally {
  // 作用域3
}

// 例2
//（注：没有使用大括号）
with (x) /* 作用域1 */; // <- 这里存在一个块级作用域

for (let a = 1; ;) {}

for (let x = 102; x < 105; x++)
  let x = 200;
```

也就是说，如果循环体（单个语句）允许支持新的变量声明，那么为了避免它影响到循环变量，就必须为它再提供另一个块级作用域。很有趣的是，在这里，JavaScript 是不允许声明新的变量的。上述的示例会抛出一个异常，提示你“单语句不支持词法声明”：

SyntaxError: Lexical declaration cannot appear in a single-statement context

for 循环的代价
在 JavaScript 的具体执行过程中，作用域是被作为环境的上下文来创建的。如果将 for 语句的块级作用域称为 forEnv，并将上述为循环体增加的作用域称为 loopEnv，那么 loopEnv 它的外部环境就指向 forEnv。

于是在 loopEnv 看来，变量 i 其实是登记在父级作用域 forEnv 中，并且 loopEnv 只能使用它作为名字“i”的一个引用。更准确地说，在 loopEnv 中访问变量 i，在本质上就是通过环境链回溯来查找标识符（Resolve identifier, or Get Identifier Reference）。

上面的矛盾“貌似”被解决了，但是想想程序员可以在每次迭代中做的事情，这个解决方案的结果就显得并不那么乐观了。例如：

for (let i in x)
setTimeout(()=>console.log(i), 1000);
这个例子创建了一些定时器。当定时器被触发时，函数会通过它的闭包（这些闭包处于 loopEnv 的子级环境中）来回溯，并试图再次找到那个标识符 i。然而，当定时器触发时，整个 for 迭代有可能都已经结束了。这种情况下，要么上面的 forEnv 已经没有了、被销毁了，要么它即使存在，那个 i 的值也已经变成了最后一次迭代的终值。

所以，要想使上面的代码符合预期，这个 loopEnv 就必须是“随每次迭代变化的”。也就是说，需要为每次迭代都创建一个新的作用域副本，这称为迭代环境（iterationEnv)。因此，每次迭代在实际上都并不是运行在 loopEnv 中，而是运行在该次迭代自有的 iterationEnv 中。

也就是说，在语法上这里只需要两个“块级作用域”，而实际运行时却需要为其中的第二个块级作用域创建无数个副本。

这就是 for 语句中使用“let/const”这种块级作用域声明所需要付出的代价。
