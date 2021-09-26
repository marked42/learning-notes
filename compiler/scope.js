;(function out() {
  var a = 'out'

  function test() {
    console.log(a)

    while (false) {
      var a = 'in'
    }
  }
  test()
})()
