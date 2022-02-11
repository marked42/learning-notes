# 内置对象

## 数组

Avoid using sparse array.

```javascript
let a = new Array(1, 2, 3);
a; // [1, 2, 3]

let b = new Array(3); // single parameter 3, no slots
b.length; // 3

let c = Array.apply(null, { length: 3 }); // 3 slots with value as undefined

let c = [undefined, undefined, undefined];
```

### Number 精度问题

1.  浮点数 https://zhuanlan.zhihu.com/p/30703042
1.  [浮点精度](https://zhuanlan.zhihu.com/p/28162086)
1.  [为什么(2.55).toFixed(1)等于 2.5？](https://zhuanlan.zhihu.com/p/31202697)
1.  [浮点数精度之谜](https://zhuanlan.zhihu.com/p/28162086)

### Proxy & Reflect

1.  [Proxy & Reflect](https://zhuanlan.zhihu.com/p/60126477)
1.  [抱歉，学会 Proxy 真的可以为所欲为](https://zhuanlan.zhihu.com/p/35080324)

### RegExp

1. [JavaScript 正则表达式匹配汉字](https://zhuanlan.zhihu.com/p/33335629)

#### Reflection

#### 字符串

#### 符号

#### 集合

#### 正则
