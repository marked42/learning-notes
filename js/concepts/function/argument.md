arguments 参数

函数内`object`引用的就是`arguments[0]`，arguments 变化造成最终执行的是`17[12]`

```js
function callMethod(obj, method) {
  var shift = [].shift
  // arguments [obj, "add", 17, 25]
  shift.call(arguments)
  // arguments ["add", 17, 25]
  shift.call(arguments)

  // arguments [17, 25]
  //   obj = arguments[0]  17
  // method = arguments[1] /25

  // 17[25].apply(obj, arguments)
  return obj[method].apply(obj, arguments)
}

var obj = {
  add: function (x, y) {
    return x + y
  },
}

callMethod(obj, 'add', 17, 25)
```

非严格模式下 argument 是函数参数的别名，严格模式下 argument 是函数参数的拷贝。

```js
function strict(x) {
  'use strict'
  arguments[0] = 'modified'
  return x === arguments[0]
}
function nonstrict(x) {
  arguments[0] = 'modified'
  return x === arguments[0]
}
strict('unmodified') // false
nonstrict('unmodified') // true
```

将`arguments`拷贝到数组中，切断关联性。

```js
function callMethod(obj, method) {
var args = [].slice.call(arguments, 2);
return obj[method].apply(obj, args);
}
At last, callMethod works as expected:
var obj = {
 add: function(x, y) { return x + y; }
};
callMethod(obj, "add", 17, 25); // 42
```

# 嵌套函数中的 arguments 不是同一个

`it.next()`调用时的`arguments`不是`values`接受的参数值，iterator 实现错误

```js
function values() {
  var i = 0,
    n = arguments.length
  return {
    hasNext: function () {
      return i < n
    },
    next: function () {
      if (i >= n) {
        throw new Error('end of iteration')
      }
      return arguments[i++] // wrong arguments
    },
  }
}

var it = values(1, 4, 1, 4, 2, 1, 3, 5, 6)
it.next() // undefined
it.next() // undefined
it.next() // undefined
```

# 参考

1. Effective Javascript Item 23 / Item 24
