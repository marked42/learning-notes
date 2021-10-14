var b
void (function () {
  var env = { b: 1 }
  b = 2
  console.log('In function b:', b)
  with (env) {
    var b = 3
    console.log('In with b:', b)
  }
})()
console.log('Global b:', b)
