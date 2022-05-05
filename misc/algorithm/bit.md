# 位运算

1. 汉明距离 https://leetcode-cn.com/problems/convert-integer-lcci/
1. 配对交换 https://leetcode-cn.com/problems/exchange-lcci/

https://tc39.es/ecma262/#sec-numeric-types-number-leftShift

做位运算之前，数字首先别转换为 32 位整数

TODO: 为什么这么设计？
Javascript 中左移操作，移位数会对首先 32 取余，参考 Java/C/CPP 有这样的情况么？
[Left Shift](https://tc39.es/ecma262/#sec-numeric-types-number-leftShift)

参考题目 https://leetcode-cn.com/problems/insert-into-bits-lcci/

```js
var insertBits = function (N, M, i, j) {
  // 错误 j + 1可能 >= 32
  // let mask = ((~0) << (j + 1)) | (((1 << i) - 1))
  // 正确
  let mask = ~(((1 << (j - i + 1)) - 1) << i)

  return (N & mask) | (M << i)
}
```

## 二进制和十进制转换

分为整数部分和小数部分

https://leetcode-cn.com/problems/bianry-number-to-string-lcci/

## Javascript 浮点数精度问题
