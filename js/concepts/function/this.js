(function () {
	let a = function () {
		console.log("this: ", this);
	};

	with ({ a }) {
		a();
	}
})();
function foo() {
	console.log(this);
}
var a = 2;
foo(); // 2
