# Array & Tuple

Concat/Length/DropN

[Tuple](https://zhuanlan.zhihu.com/p/38687656)
[Fixed Length Tuple](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html#fixed-length-tuples)

Permutation

1.  https://ghaiklor.github.io/type-challenges-solutions/en/medium-permutation.html
1.  https://github.com/type-challenges/type-challenges/issues/614
1.  [Tuple](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)

TODO:

1. [DeepReadonly](https://github.com/type-challenges/type-challenges/blob/main/questions/00009-medium-deep-readonly/README.md)

Head/Tail/First/Last/

```ts
type First<T extends any[]> = T extends [infer First, ...any] ? First : never

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<First<[3, 2, 1]>, 3>>,
  Expect<Equal<First<[() => 123, { a: string }]>, () => 123>>,
  Expect<Equal<First<[]>, never>>,
  Expect<Equal<First<[undefined]>, undefined>>
]

type errors = [
  // @ts-expect-error
  First<'notArray'>,
  // @ts-expect-error
  First<{ 0: 'arrayLike' }>
]
```

Last

```ts
type Last<T extends any[]> = T extends [...any, infer Last] ? Last : never

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Last<[3, 2, 1]>, 1>>,
  Expect<Equal<Last<[() => 123, { a: string }]>, { a: string }>>
]
```

Shift/Pop Tail 效果和 Shift 相同

```ts
type Pop<T extends any[]> = T extends [...infer H, any] ? H : []

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Pop<[3, 2, 1]>, [3, 2]>>,
  Expect<Equal<Pop<['a', 'b', 'c', 'd']>, ['a', 'b', 'c']>>,
  Expect<Equal<Pop<[]>, []>>
]

type Shift<T extends any[]> = T extends [any, ...infer Tail] ? Tail : []

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  // @ts-expect-error
  Shift<unknown>,
  Expect<Equal<Shift<[]>, []>>,
  Expect<Equal<Shift<[1]>, []>>,
  Expect<Equal<Shift<[3, 2, 1]>, [2, 1]>>,
  Expect<Equal<Shift<['a', 'b', 'c', 'd']>, ['b', 'c', 'd']>>
]
```

Concat

```ts
type Concat<T extends any[], U extends any[]> = [...T, ...U]
```

[Include](https://github.com/type-challenges/type-challenges/blob/main/questions/00898-easy-includes/README.md)

```ts
// 典型的错误写法 infer关键字的类型只能在条件为真的分支使用
type Includes<T extends readonly any[], U> = T extends []
  ? false
  : T extends [infer A, ...infer B]
  ? Equal<A, U>
  : Includes<B, U>

type Includes<T extends readonly any[], U> = T extends []
  ? false
  : T extends [infer A, ...infer B]
  ? // 借助Equal判断类型相同
    Equal<A, U> extends true
    ? true
    : // 使用类型B只能在true为真的分支
      Includes<B, U>
  : never

// 更简单的实现，遍历的思路，相当于reduce的操作
type Includes<T extends readonly any[], U> = T extends [
  infer First,
  ...infer Rest
]
  ? Equal<First, U> extends true
    ? true
    : Includes<Rest, U>
  : false

/**
 * 相当于Map操作
 *
 * 1. 首先使用映射类型将元组的每个值进行映射，检查和U是否相等
 * 2. 然后使用索引类型取出元组值的union类型，其中每个元素是true或者false
 * 3. 如果union类型中包含true则代表至少有一个true，也就元组中包含元素，使用条件类型返回结果值
 */
type Includes<T extends readonly any[], U> = true extends {
  [P in keyof T]: Equal<T[P], U>
}[number]
  ? true
  : false
```

Unique

```ts
/* _____________ Your Code Here _____________ */
type Includes<T extends readonly any[], U> = T extends [
  infer First,
  ...infer Rest
]
  ? Equal<First, U> extends true
    ? true
    : Includes<Rest, U>
  : false

// 使用类型参数Result记录结果
// type Unique<T extends unknown[], Result extends unknown[] = []> =
//   T extends [infer First, ...infer Rest]
//   ? Includes<Result, First> extends true
//     ? Unique<Rest, Result>
//     : Unique<Rest, [...Result, First]>
//   : Result

// 逆向处理最终结果元素顺序才正确
type Unique<T> = T extends [...infer H, infer T]
  ? Includes<H, T> extends true
    ? [...Unique<H>]
    : [...Unique<H>, T]
  : []

// type Unique<T extends unknown[]> =
//   T extends [infer First, ...infer Rest]
//   ? Includes<Rest, First> extends true
//     ? Unique<Rest>
//     : [First, ...Unique<Rest>]
//   : []

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Unique<[1, 1, 2, 2, 3, 3]>, [1, 2, 3]>>,
  Expect<Equal<Unique<[1, 2, 3, 4, 4, 5, 6, 7]>, [1, 2, 3, 4, 5, 6, 7]>>,
  Expect<Equal<Unique<[1, 'a', 2, 'b', 2, 'a']>, [1, 'a', 2, 'b']>>,
  Expect<
    Equal<
      Unique<[string, number, 1, 'a', 1, string, 2, 'b', 2, number]>,
      [string, number, 1, 'a', 2, 'b']
    >
  >,
  Expect<
    Equal<
      Unique<[unknown, unknown, any, any, never, never]>,
      [unknown, any, never]
    >
  >
]
```

TODO: Array 相关标准 API 的类型标注解读

Effective Typescript Item27 函数式编程写法两大优势，生命式写法，代码易懂；自带准确类型推导。

underscore 的 pluck 函数，根据实现添加合适的类型标注

```ts
function pluck(record: any[], key: string): any[] {
  return record.map((r) => r[key])
}
```

Push 操作

```ts
type Push<T extends any[], U> = [...T, U]

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Push<[], 1>, [1]>>,
  Expect<Equal<Push<[1, 2], '3'>, [1, 2, '3']>>,
  Expect<Equal<Push<['1', 2, '3'], boolean>, ['1', 2, '3', boolean]>>
]
```

Unshift

```ts
/* _____________ Your Code Here _____________ */

type Unshift<T extends any[], U> = [U, ...T]

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Unshift<[], 1>, [1]>>,
  Expect<Equal<Unshift<[1, 2], 0>, [0, 1, 2]>>,
  Expect<Equal<Unshift<['1', 2, '3'], boolean>, [boolean, '1', 2, '3']>>
]
```

Without

```ts
type Without<T extends unknown[], U> = T extends [infer First, ...infer Rest]
  ? First extends (U extends unknown[] ? U[number] : U)
    ? Without<Rest, U>
    : [First, ...Without<Rest, U>]
  : T
;/_ **\*\***\_**\*\*** Test Cases **\*\***\_**\*\*** _/
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Without<[1, 2], 1>, [2]>>,
  Expect<Equal<Without<[1, 2, 4, 1, 5], [1, 2]>, [4, 5]>>,
  Expect<Equal<Without<[2, 3, 2, 3, 2, 3, 2, 3], [2, 3]>, []>>
]
```

IndexOf

```ts
/* _____________ Your Code Here _____________ */

type IndexOf<T extends unknown[], U, Count extends unknown[] = []> = Equal<
  U,
  T[Count['length']]
> extends true
  ? Count['length']
  : Count['length'] extends T['length']
  ? -1
  : IndexOf<T, U, [...Count, unknown]>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<IndexOf<[1, 2, 3], 2>, 1>>,
  Expect<Equal<IndexOf<[2, 6, 3, 8, 4, 1, 7, 3, 9], 3>, 2>>,
  Expect<Equal<IndexOf<[0, 0, 0], 2>, -1>>,
  Expect<Equal<IndexOf<[string, 1, number, 'a'], number>, 2>>,
  Expect<Equal<IndexOf<[string, 1, number, 'a', any], any>, 4>>
]
```

LastIndexOf

```ts
type LastIndexOf<T extends unknown[], U> = T extends [...infer Rest, infer Last]
  ? Equal<Last, U> extends true
    ? Rest['length']
    : LastIndexOf<Rest, U>
  : -1

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<LastIndexOf<[1, 2, 3, 2, 1], 2>, 3>>,
  Expect<Equal<LastIndexOf<[2, 6, 3, 8, 4, 1, 7, 3, 9], 3>, 7>>,
  Expect<Equal<LastIndexOf<[0, 0, 0], 2>, -1>>,
  Expect<Equal<LastIndexOf<[string, 2, number, 'a', number, 1], number>, 4>>,
  Expect<Equal<LastIndexOf<[string, any, 1, number, 'a', any, 1], any>, 5>>
]
```

Join

```ts
type Join<T extends string[], U extends string | number> = T extends [
  // 推断增加条件，否则报错
  infer First extends string,
  ...infer Rest extends string[]
]
  ? `${First}${Rest['length'] extends 0 ? '' : U}${Join<Rest, U>}`
  : ''

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Join<['a', 'p', 'p', 'l', 'e'], '-'>, 'a-p-p-l-e'>>,
  Expect<Equal<Join<['Hello', 'World'], ' '>, 'Hello World'>>,
  Expect<Equal<Join<['2', '2', '2'], 1>, '21212'>>,
  Expect<Equal<Join<['o'], 'u'>, 'o'>>
]
```

数组拍平 Flatten

1. 查看 Lodash 的实现
2. Array.prototype.flat 支持一个 depth 的参数，尝试考虑到类型中

```ts
/* _____________ Your Code Here _____________ */
type Flatten<T extends any[]> = T extends [infer A, ...infer B]
  ? A extends any[]
    ? [...Flatten<A>, ...Flatten<B>]
    : [A, ...Flatten<B>]
  : T

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Flatten<[]>, []>>,
  Expect<Equal<Flatten<[1, 2, 3, 4]>, [1, 2, 3, 4]>>,
  Expect<Equal<Flatten<[1, [2]]>, [1, 2]>>,
  Expect<Equal<Flatten<[1, 2, [3, 4], [[[5]]]]>, [1, 2, 3, 4, 5]>>,
  Expect<
    Equal<
      Flatten<[{ foo: 'bar'; 2: 10 }, 'foobar']>,
      [{ foo: 'bar'; 2: 10 }, 'foobar']
    >
  >
]

// 不要求Flatten的参数为数组，非数组元素直接返回
type Flatten<T> = T extends []
  ? []
  : T extends [infer H, ...infer T]
  ? [...Flatten<H>, ...Flatten<T>]
  : [T]

// 递归终止的条件有两个，一个是深度到了要求，一个是数组中的元素本身不是数组，无法继续展开
// 先处理深度会让最终的结果更简单
type FlattenDepth<
  T extends unknown[],
  Depth extends number = 1,
  Count extends unknown[] = []
> = T extends [infer First, ...infer Rest]
  ? Count['length'] extends Depth // 已经到了要求的深度
    ? T // 不再递归展开
    : First extends unknown[]
    ? // 注意这里 First 被展开了所以使用[...Count, unknown]使数组长度增加1，代表嵌套深度加深
      // 剩余的每个元素递归也需要深度加1，但是这些元素整体组成了 Rest 数组被使用，抵消了嵌套深度增加，所以仍然使用Count
      [
        ...FlattenDepth<First, Depth, [...Count, unknown]>,
        ...FlattenDepth<Rest, Depth, Count>
      ]
    : [First, ...FlattenDepth<Rest, Depth, Count>]
  : T

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<FlattenDepth<[]>, []>>,
  Expect<Equal<FlattenDepth<[1, 2, 3, 4]>, [1, 2, 3, 4]>>,
  Expect<Equal<FlattenDepth<[1, [2]]>, [1, 2]>>,
  Expect<Equal<FlattenDepth<[1, 2, [3, 4], [[[5]]]], 2>, [1, 2, 3, 4, [5]]>>,
  Expect<Equal<FlattenDepth<[1, 2, [3, 4], [[[5]]]]>, [1, 2, 3, 4, [[5]]]>>,
  Expect<Equal<FlattenDepth<[1, [2, [3, [4, [5]]]]], 3>, [1, 2, 3, 4, [5]]>>,
  Expect<
    Equal<FlattenDepth<[1, [2, [3, [4, [5]]]]], 19260817>, [1, 2, 3, 4, 5]>
  >
]
```

1. 映射类型用在基础类型上返回他们本身，用在普通对象上是正常情况，也可以用在数组和元组上因为这两种类型也是对象
1. tuple 类型是数组类型的子类型，只要 tuple 中所有元素类型是数组元素的子类型
1. 数组类型不是 tuple 类型的子类型

```ts
// `[...T]`可以同时数组和元组类型
function matchTupleArray<T extends unknown>(value: [...T])

// readonly修饰可以匹配只读的数组或者元组，也可匹配非只读的数组和元组，加强了限制，反过来则不行
function matchTupleArray<T extends unknown>(value: readonly [...T])
```

## 数字比较

利用元组长度属性实现的数字比较

```ts
type GreaterThan<
  T extends number,
  U extends number,
  Count extends unknown[] = []
> = Count['length'] extends U
  ? Count['length'] extends T
    ? false
    : true
  : Count['length'] extends T
  ? false
  : GreaterThan<T, U, [...Count, unknown]>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<GreaterThan<1, 0>, true>>,
  Expect<Equal<GreaterThan<5, 4>, true>>,
  Expect<Equal<GreaterThan<4, 5>, false>>,
  Expect<Equal<GreaterThan<0, 0>, false>>,
  Expect<Equal<GreaterThan<20, 20>, false>>,
  Expect<Equal<GreaterThan<10, 100>, false>>,
  Expect<Equal<GreaterThan<111, 11>, true>>
]
```

Reverse

```ts
type Reverse<T> = T extends [infer F, ...infer L] ? [...Reverse<L>, F] : T

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Reverse<[]>, []>>,
  Expect<Equal<Reverse<['a', 'b']>, ['b', 'a']>>,
  Expect<Equal<Reverse<['a', 'b', 'c']>, ['c', 'b', 'a']>>
]
```

Zip

```ts
type Zip<T extends unknown[], U extends unknown[]> = [T, U] extends [
  [infer T1, ...infer Rest],
  [infer U1, ...infer R1]
]
  ? [[T1, U1], ...Zip<Rest, R1>]
  : []

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Zip<[], []>, []>>,
  Expect<Equal<Zip<[1, 2], [true, false]>, [[1, true], [2, false]]>>,
  Expect<Equal<Zip<[1, 2, 3], ['1', '2']>, [[1, '1'], [2, '2']]>>,
  Expect<Equal<Zip<[], [1, 2, 3]>, []>>,
  Expect<Equal<Zip<[[1, 2]], [3]>, [[[1, 2], 3]]>>
]
```
