# Promise 的类型声明

```ts
/* _____________ Your Code Here _____________ */

type MyAwaited<T> = T extends Promise<infer U> ? MyAwaited<U> : T

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type X = Promise<string>
type Y = Promise<{ field: number }>
type Z = Promise<Promise<string | number>>
type Z1 = Promise<Promise<Promise<string | boolean>>>

type cases = [
  Expect<Equal<MyAwaited<X>, string>>,
  Expect<Equal<MyAwaited<Y>, { field: number }>>,
  Expect<Equal<MyAwaited<Z>, string | number>>,
  Expect<Equal<MyAwaited<Z1>, string | boolean>>
]

// @ts-expect-error
type error = MyAwaited<number>
```

```ts
// 关键点，使用一个参数，匹配元组类型，使用Mapped Types进行映射
declare function PromiseAll<T extends any[]>(
  values: readonly [...T]
): Promise<{ [P in keyof T]: Awaited<T[P]> }>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

const promiseAllTest1 = PromiseAll([1, 2, 3] as const)
const promiseAllTest2 = PromiseAll([1, 2, Promise.resolve(3)] as const)
const promiseAllTest3 = PromiseAll([1, 2, Promise.resolve(3)])

type cases = [
  Expect<Equal<typeof promiseAllTest1, Promise<[1, 2, 3]>>>,
  Expect<Equal<typeof promiseAllTest2, Promise<[1, 2, number]>>>,
  Expect<Equal<typeof promiseAllTest3, Promise<[number, number, number]>>>
]
```

TODO: Promise 相关函数的类型标注

```ts
// 注意这里标记为Promise<never>
function timeout(ms: number): Promise<never> {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject('timeout'), ms)
  })
}

// 正确返回类型为 Promise<Response>
function fetchWithTimeout(url: string, ms: number) {
  return Promise.race([timeout(ms), fetch(url)])
}
```

[Promise.all](https://ghaiklor.github.io/type-challenges-solutions/en/medium-promise-all.html)

```ts
// Type instantiation is excessively deep and possibly infinite.(2589)
type AwaitedArray<T> = T extends [...infer H, ...infer Tail]
  ? [Awaited<H>, ...AwaitedArray<Tail>]
  : never

declare function PromiseAll<T extends any[]>(
  values: readonly [...T]
): Promise<AwaitedArray<T>>

// type Awaited<T> = T extends Promise<infer V> ? V : T;
// type AwaitedArray<T> = T extends [infer F, ...(infer R)] ? [Awaited<F>, ...AwaitedArray<R>] : Awaited<T>;
// declare function PromiseAll<T extends any[]>(values: readonly [...T]): Promise<AwaitedArray<T>>

import type { Equal, Expect } from '@type-challenges/utils'

type Includes<T extends readonly any[], U> = T extends [
  infer First,
  ...infer Rest
]
  ? Equal<First, U> extends true
    ? true
    : Includes<Rest, U>
  : false

const promiseAllTest1 = PromiseAll([1, 2, 3] as const)
const promiseAllTest2 = PromiseAll([1, 2, Promise.resolve(3)] as const)
const promiseAllTest3 = PromiseAll([1, 2, Promise.resolve(3)])

type cases = [
  Expect<Equal<typeof promiseAllTest1, Promise<[1, 2, 3]>>>,
  Expect<Equal<typeof promiseAllTest2, Promise<[1, 2, number]>>>,
  Expect<Equal<typeof promiseAllTest3, Promise<[number, number, number]>>>
]
```

因为直接使用 Promise 函数容易写出同步异步混用的函数，优先使用 async/await 语法能避免这种情况。
