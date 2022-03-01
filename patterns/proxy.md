### Proxy

1. Data Validation
1. Security
1. Caching
1. Lazy initialization
1. Logging
1. Remote Object
1. Vue Reactive Object Proxy

实现 Proxy 可以直接修改原有对象属性（object augmentation、monkey patching），也可以使用组合方式（composition）。这里的组合指面向对象编程中类 A 中成员 b 是类 B 的实例，A 以组合的方式使用 B，组合是相对于继承的方式而言的。JS 中可以使用组合，更直接的可以使用闭包将对象封装到函数作用中，直接使用对象。

```js
function Proxy(object) {
  const proto = Object.getPrototypeOf(object)

  const proxiedObject = Object.create(proto)

  ;[
    ...Object.getOwnPropertySymbols(object),
    ...Object.getOwnPropertyNames(object),
  ].forEach((key) => {
    Object.defineProperty(proxiedObject, key, {
      get() {
        return object[key]
      },
      set(value) {
        object[key] = value
      },
    })
  })

  return proxiedObject
}
```
