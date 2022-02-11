function printName() {
	console.log("name: ", arguments.callee.name);
}
printName();

const a = function test() {
	console.log("name: ", arguments.callee.name);
};

a();

const b = function () {
	console.log("name: ", arguments.callee.name);
};

b();

(function () {
	console.log("name: ", arguments.callee.name);
})();

console.log(new Function().name); // "anonymous"

const arrow = () => {
	console.log("name: ", arguments.callee.name);
};
arrow();
