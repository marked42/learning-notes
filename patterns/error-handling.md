如何使用日志，异常

# 错误码

不要使用错误码

# 抛出错误

# 区分错误和异常？

Error & Exception

# checked exception

Java 使用了这个机制，其他的语言没有

## Throw your own errors

1. 应该抛出什么样的错误

## when

Throw your own errors，抛出自定义类型的错误和有含义的信息，方便定位

什么时候抛出错误

Some good general rules of thumb for throwing errors:
• Once you’ve fixed a hard-to-debug error, try to add one or two custom errors that
can help you more easily the solve the problem, should it occur again.
• If you’re writing code and think, “I hope [something] doesn’t happen—that would
really mess up this code,” then throw an error when that something occurs.
• If you’re writing code that will be used by people you don’t know, think about how
they might incorrectly use the function and throw errors in those cases.

## 捕获错误

catch error 如果直到如何恢复错误，可以捕获。

应用层代码最好进行捕获，抛出代码到全局没有意义。

### 永远不要吞没错误

```js
// Bad
try {
  somethingThatMightCauseAnError()
} catch (ex) {
  // noop
}
```

### finally

try 里面有 return 时候的流程

# 参考资料

1. Clean Code Ch 7
