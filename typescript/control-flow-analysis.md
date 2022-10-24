# 控制流分析 Control Flow Analysis

control flow analysis https://github.com/microsoft/TypeScript/pull/32695

```ts
function testThrow() {
  throw new Error('un')

  // 因为上边抛出了异常，这里的代码不可到达
  console.log('unreachable code')
}

function testThrowWrapper() {
  function panic() {
    throw 1
  }

  // 这里抛出异常
  panic()
  // return panic()

  // TODO: 控制流分析没有检测出这里的代码不可到达
  console.log('unreachable code')
}
```
