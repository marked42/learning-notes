globalThis.context1 = function context() {
	console.log("context: ", this);
};

context1();

const base = {
	name: 1,
	context: function () {
		console.log("context: ", this);
	},
	context1,
};

base.context1();

with (base) {
	// context是一个引用类型 Record Reference，base是base变量，
	context();
}
