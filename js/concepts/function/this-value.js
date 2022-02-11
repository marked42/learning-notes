function foo() {
	console.log(this.a);
}
var a = 2;
var o = { a: 3, foo: foo };
var p = { a: 4 };
o.foo(); // 3
(1, o.foo)(); // TODO: 2 chrome, undefined in node
(p.foo = o.foo)(); // TODO: 2 chrome, undefined in node
