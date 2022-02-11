(function test(i) {
	if (i >= 2) {
		return;
	}
	console.log("test: ", i);
	// test(i + 1);
	// let test = 1;
	debugger;
})(0);

console.log("test: ", typeof test);
