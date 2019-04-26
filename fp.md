# FP

1. pass only one argument through: unary
1. identity
1. Array construction

```js
// [1, 2, 3]
Array.of(1, 2, 3)
new Array(1, 2, 3)
// [0, 1, 2]
Array.from({length: 3}, (value, index) => index)
// empty array of length 3
new Array(3)
```

1. transform `fn` receiving single array argument to equivalent one receiving multiple args

```js
function spread(fn) {
  return spreadedFn(...args) {
    return fn(args)
  }
}

function collapse(fn) {
  return collapsedFn(arg) {
    return fn(...args)
  }
}

function partial(fn, ...bindArgs) {
  return partialFn(...args) {
    return fn(...bindArgs, ...args)
  }
}

function partialRight(fn, ...bindArgs) {
  return partialFn(...args) {
    return fn(...args, ...bindArg)
  }
}

function bind(fn) {
  return callBound(context, ...args) {
    return fn.call(context, ...args)
  }

  return applyBound(context, ...args) {
    return fn.apply(context, args)
  }

  return fn.bind
}

function reverse(fn) {
  return reversedFn(...args) {
    return fn(...args.reverse())
  }
}

function curry(fn, arity = fn.length) {
  function nextCurried(prevArgs) {
    return function curried(...nextArgs) {
      const args = [...prevArgs, ...nextArgs]

      if (args.length >= arity) {
        return fn(...args)
      }

      return nextCurried(args)
    }
  }

  return nextCurried([])
}

function uncurry(fn) {
  return uncurried(...args) {
    let ret = fn

    for (let arg of args) {
      ret = ret(arg)
    }

    return ret
  }
}

function partialProps(fn, presetArgsObj) {
  return partialFn(laterArgsObj) {
    return fn({...presetArgsObj, ...laterArgsObj})
  }
}

function curryProps(fn, arity = 1) {
  function nextCurried(presetArgsObj = {}) {
    return curried(laterArgsObj = {}) {
      const argsObj = {...presetArgsObj, ...laterArgsObj}

      if (Object.keys(argsObj).length >= arity) {
        return fn(argsObj)
      }

      return nextCurried(argsObj)
    }
  }

  return nextCurried({})
}

function compose(...fns) {
  return composed(result) {
    while (fns.length > 0) {
      const fn = fns.shift()

      result = fn(result)
    }

    return result
  }
}

const pipe = reverseArgs(compose)

const identity = value => value

function fib(n, cont = identity) {
  if (n <= 1) return cont(n)

  return fib(
    n - 2,
    n2 => fib(
      n - 1,
      n1 => n1 + n2
    )
  )
}

function recur([sum, ...nums], cont = v) {
  if (nums.length === 0) { return cont(sum) }

  return recur([...nums], function (v) {
    return cont(sum + v)
  })
}

// recursion declarative readable
// direct/indirect recursion
// tail call optimization TCO
// proper tail call (PTC)
// continue passing style  CPS
// trampoline
```
