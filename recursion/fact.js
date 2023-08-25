// function fact(h, n) {
//   if (n < 2) {
//     return 1
//   } else {
//     return n * h(h, n - 1)
//   }
// }

// function fact1(h) {
//   return function (n) {
//     return n < 2 ? 1 : n * h(h)(n - 1)
//   }
// }

// // console.log(fact(fact, 10))

function fact2(h) {
  return function (n) {
    return n < 2 ? 1 : n * h(n - 1)
  }
}

function y(f) {
  function g(g) {
    return function (x) {
      return f(g(g))(x)
    }
  }

  return g(g)
}

let f = y(fact2)

console.log(f(3))

// recursive takes effect by global definition of f
// let f = (n) => {
//   return n < 2 ? 1 : n * f(n - 1)
// }

// console.log(f(1))
// console.log(f(2))
// console.log(f(3))
// console.log(f(4))
