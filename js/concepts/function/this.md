# this 关键字

通过 ResolveThisBinding 来确定，第一步 GetThisEnvironment，第二部 GetThisBinding

GetThisEnvironment 验证 LexicalEnvironment 的 outer 向上寻找直到第一个 HasThisBinding 为 true 的语法环境

GlobalEnvironment 的 HasThisBinding 为 true，向上寻找 GetThisEnvironment 总会结束， GetThisBinding 返回全局对象
ModuleEnvironment 的 HasBinding 为 true，GetThisBinding 返回 undefined
LexicalEnvironment 的 HasThisBinding 默认为 false，所以局部作用域没有 this
ObjectEnvironmentRecord 的 HasThisBinding 也为 false
FunctionEnvironmentRecord 的 HasThisBinding 普通函数 true，箭头函数 false，返回的是函数环境记录创建时通过 BindThisValue 绑定的 thisValue 值。

上面这几种情况都比较简单，关键是 FunctionEnvironmentRecord 中的绑定 this 值有多种情况。这个 this 值由函数调用决定。

Call(thisArgument, argumentsList) -> OrdinaryCallBindThis(F, calleeContext, thisArgument)这个 thisArgument 就是绑定的 this。

这里分为几种情况

1. fn.bind/fn.call()/fn.apply 对应显式指定 thisArgument
1. 构造函数 Construct 调用 this 是新建对象
1. 其余函数调用情况 12.3.4.1 函数 fn CallExpression 的 Runtime Evaluation

区分被调用的函数值本身的类型 GetThisValue

EvaluateCall 中计算 thisValue

1. Reference 类型
    1. PropertyReference
        1. super reference -> super 的 this
        1. normal reference base object
    1. Record Reference 类型 base 是 Environment Record 类型，调用 envRec.WithBaseObject() 获取 Environment Record 的 base 作为 this
1. Type(fn) 值类型 this 是 undefined

ecma-262 test 收集 语言行为测试用例，测试用例最好能够不约束实现 JS 引擎的语言。

```js
{
	// this是全局对象
	console.log(this);
	const base = {
		name: 1,
		context: function () {
			console.log("context: ", this);
		},
	};
	with (base) {
		// ObjectEnvironment中，HasThisBinding为false，所以需要向上寻找到全局的this
		console.log("i: ", this);

		// context是一个引用类型 Record Reference，base是base变量，
		context();
	}
}
```

解释下面例子，跟绑定到全局对象类似，
TODO: 右值函数调用的情况呢？

```js
function foo() {
	console.log(this.a);
}
var a = 2;
foo(); // 2 chrome

// TODO: 单独拆开解释为什么foo是一个引用值，其base是全局对象，而不是Global Environment Record

// node环境下运行值为 undefined

var o = { a: 3, foo: foo };
var p = { a: 4 };
o.foo(); // 3
(1, o.foo)(); // TODO: 2 chrome, undefined in node
(p.foo = o.foo)(); // TODO: 2 chrome, undefined in node
```

函数作为参数传递时丢失了原来来的 this，这是个容易忽略的地方

```js
// 需要手动将类方法全部绑定到this
class Test {
	a(fn) {
		console.log(fn());
	}

	b() {
		return this;
	}

	main() {
		this.a(this.b);
	}
}
const t = new Test();
t.main();

// forEach函数第二个参数显式的指定this
function foo(el) {
	console.log(el, this.id);
}
var obj = {
	id: "awesome",
};
// use `obj` as `this` for `foo(..)` calls
[1, 2, 3].forEach(foo, obj);

// bind/apply/call函数指定this
```

构造函数中的 this [[Construct]]语义

1. bind 产生的函数作为构造函数使用时 this 还是新构造的对象，而不是 bind 的参数，构造函数语义优先于 Bind
   是否允许重复 bind？
1. 参考 MDN 的 bind 函数实现。
1. bind 的第一个参数是 null/undefined 时被忽略，相当于 bind 没生效

严格模式对 this 的影响

```js
function f() {
	return !this;
} // 返回false，因为"this"指向全局对象，"!this"就是false
function f() {
	"use strict";
	return !this;
} // 返回true，因为严格模式下，this的值为undefined，所以"!this"为true。
```

```js
function foo() {
	// 注意是这里的导致this不能绑定到全局对象
	"use strict";
	console.log(this.a);
}
var a = 2;
(function () {
	// 这里不影响foo内部的this
	"use strict";
	foo(); // 2
})();
```

## `this`

函数调用时生成新的函数执行环境，添加到函数执行栈顶部，函数执行环境记录了函数执行的相关信息。`this`关键字代表的值在函数执行时确定，有以下几种情况。

#### 构造函数调用

正常的函数使用`return obj`显式返回对象`obj`或者隐式返回`undefined`。构造函数调用`new Fun()`首先创建一个新的空对象，然后将`this`绑定到该对象，并在构造完成后返回该对象。

#### 显式绑定

使用函数`Function.prototype.call(context, arg1, arg2, ...)`和`Function.prototype.apply(this, args)`将`this`显式绑定到`context`参数代表的对象上。
`null`, `undefined`传参给`call`, `apply`, `bind`被忽略，默认绑定规则生效.

函数`Function.prototype.bind(context)`返回一个新函数，这个函数等同于原来的函数，区别在于新函数的`this`固定的绑定到`context`参数上，再次调用`bind/call/apply`都无法重新绑定`this`。

ES5 环境下对于`bind`函数的模拟实现。

```javascript
if (!Function.prototype.bind) {
	Function.prototype.bind = function (oThis) {
		if (typeof this !== "function") {
			// closest thing possible to the ECMAScript 5
			// internal IsCallable function
			throw new TypeError(
				"Function.prototype.bind - what is trying to be bound is not callable"
			);
		}

		var aArgs = Array.prototype.slice.call(arguments, 1);
		var fToBind = this;
		var fNOP = function () {};
		var fBound = function () {
			return fToBind.apply(
				this instanceof fNOP ? this : oThis,
				aArgs.concat(Array.prototype.slice.call(arguments))
			);
		};

		// maintain prototype chain
		if (this.prototype) {
			// Function.prototype doesn't have a prototype property
			fNOP.prototype = this.prototype;
		}
		fBound.prototype = new fNOP();

		return fBound;
	};
}
```

有几个点需要注意：

1. `Function.prototype.bind`返回函数`fBound`，`this`绑定到`oThis`上。
1. `bind(this, arg1, arg2, ...)`函数的其他参数也强制绑定作为新函数调用时开头的参数，所以需要拼接参数。
1. 新函数作为构造函数调用时应该尊重构造函数的语义，构造函数的`this`绑定到一个空对象。为了区分构造函数调用和普通函数调用，在`bind`内部声明了一个函数，并将其插入到原型链中。
   因为`fNOP`是函数内部声明，所以此函数之外不可能引用得到。这样`this istanceof fNOP`为真时表明新函数作为构造函数被调用，否则将`this`绑定到`oThis`指定的对象。

![Prototype Chain of Bind Function](function_bind.png)

#### 隐式绑定

对于函数调用表达式`callee()`，`callee`代表了要被调用的函数，这个函数可能由标识符、成员表达式、函数表达式等等形式指定。`callee`得到的值可能是引用类型或者单纯的值类型。

引用类型的值在 Javascript 内部实际上三个部分，引用了基础对象`base`上的属性`propertyName`，`strict`代表是否开启严格模式。

```js
"use strict";

// Access foo.
foo;

// Reference for `foo`.
const fooReference = {
	base: global,
	propertyName: "foo",
	strict: true,
};
```

引用类型函数调用时，`this`的值绑定到`base`对象上；值类型函数调用时`this`绑定到全局对象，严格模式下绑定到`undefined`。

```js
var x = 10;
var foo = {
	x: 20,
	bar: function () {
		var x = 30;
		return this.x;
	},
};

console.log(
	foo.bar(),
	// grouping operator returns Reference
	foo.bar(),

	// 以下表达式返回值类型
	(foo.bar = foo.bar)(),
	(foo.bar, foo.bar)(),
	(false || foo.bar)() // global?
);
```

使用`with`语句的例子，引用类型的基础对象是`with`提供的对象，符合上述规则，`this`绑定到基础对象上。

```js
var x = 10;

with ({
	foo: function () {
		console.log(this.x);
	},
	x: 20,
}) {
	foo(); // 20
}

// because
var fooReference = {
	base: __withObject,
	propertyName: "foo",
};
```

存在一种例外情况，如果引用类型值的基础对象是 Javascript 内部语法环境对象时，`this`绑定到该语法环境对象会将其暴露出来，可以被非法使用。为了避免这种情况，此时`this`绑定到全局对象上或者`undefined`。

嵌套函数调用`bar`的基础对象是外层函数`foo`的语法环境对象，强制绑定到全局对象或者`undefined`。

```js
function foo() {
	function bar() {
		console.log(this); // global
	}
	bar(); // the same as AO.bar()
}
```

`catch`语句块参数`e`的基础对象是`catch`语句块的块级环境对象，强制绑定到全局对象或者`undefined`。

```js
try {
	throw function () {
		console.log(this);
	};
} catch (e) {
	e(); // __catchObject - in ES3, global - fixed in ES5
}
```

命名函数表达式的局部语法环境对象包括同名自身引用，在内部嵌套调用时`foo`引用类型的`base`对象是局部语法环境对象，强制绑定到全局对象或者`undefined`。

```js
(function foo(bar) {
	console.log(this);

	!bar && foo(1); // "should" be special object, but always (correct) global
})(); // global
```

另一个例子

```js
function one() {
	// 1. this bind to window, set window.name to 1
	this.name = 1;

	return function two() {
		// 2. set to window.name to 2
		name = 2;

		return function three() {
			var name = 3;
			// 3. this bind to window, window.name is now 2
			console.log(this.name);
		};
	};
}
one()()(); // => 2;
```

#### 箭头函数

箭头函数的`this`在运行时箭头函数所在的语法作用域（全局作用域全局对象`window`或者函数作用域的`this`）的`this`，绑定之后不能再改变。箭头函数不能使用`new`关键字作为构造函数调用，否则抛出错误`TypeError 'x' is not a constructor`。

```javascript
const globalScope = () => {
	console.log("this bound to global: ", this);
};

function foo() {
	return (a) => {
		// `this` here is lexically inherited from `foo()`
		console.log(this.a);
	};
}

var obj1 = { a: 1 };
var obj2 = { a: 2 };
var boundToObj1 = foo.call(obj1);
boundToObj1(); // 1
boundToObj1.call(obj2); // 1

var boundToObj2 = foo.call(obj2);
boundToObj2(); // 2
boundToObj2.call(obj1); // 2

boundToObj1 !== boundToObj2;
```

TODO: this 是个左值，不能被赋值

```js
this = 1;
// Invalid left-hand side
```

TODO: 类方法的 this 如何绑定的？类语法语意是什么样的？

# 参考

1. [MDN this](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)
1. [You Don't Know JS: this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/this%20&%20object%20prototypes/README.md#you-dont-know-js-this--object-prototypes)
1. [How does the "this" keyword work?](https://stackoverflow.com/questions/3127429/how-does-the-this-keyword-work/3127440#3127440)
1. [ECMA-262-3 in detail. Chapter 3. This](http://dmitrysoshnikov.com/ecmascript/chapter-3-this/)
1. [JavaScript 深入之从 ECMAScript 规范解读 this](https://github.com/mqyqingfeng/Blog/issues/7)
