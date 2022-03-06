# 数字

## 范围

Javascript 的数字只有 64 位浮点数一种类型。

能表示的合法整数范围 –2^53 and 2^53

# 位运算

数字参与位运算时比较特殊，会被转换为 32-bit, big-endian, two’s complement integers 进行运算，运算完成后再转换为浮点数。

# 精确度有限

```js
0.1 + 0.2 !== 0.3
```

# 参考资料

1. Effective Javascript Understanding Javascript's Floating Point Numbers
