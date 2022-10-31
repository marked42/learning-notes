# 经典问题

## Permutation（排列）

[问题](https://github.com/type-challenges/type-challenges/blob/main/questions/00296-medium-permutation/README.md)

```ts
type perm = Permutation<'A' | 'B' | 'C'>
// ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']
```

获取一组元素的全排列，采用分治和递归的方法，N 个元素的全排列问题可以按照第一个元素的可能性划分为 N 种情况。

```
// 第一个元素是1, N-1代表除去1以外其他N-1个元素的全排列子问题的解
[1, 子问题(N-1)]
...
// 第一个元素是N, N-1代表除去N以外其他N-1个元素的全排列子问题的解
[N, 子问题(N-1)]
```

上面的第一种情况递归分解子问题 N-1 直到问题规模为零。

```
[1, 2, ..., N, 子问题(0)]
```

子问题(0)的情况是递归情况的出口，解应该是空集，这时候已经找到了一个可能的解`[1, 2, ..., N]`。

```ts
export function permutation(array: string[]): string[][] {
  // 数组为空代表规模为0的子问题，注意要返回有一个空数组元素的元组
  if (array.length === 0) {
    return [[]]
  }

  const result: string[][] = []
  // 遍历数组
  for (let i = 0; i < array.length; i++) {
    const e = array[i]
    const rest = [...array.slice(0, i), ...array.slice(i + 1)]

    // 组合子问题
    // [e, ...permutation(rest)];
    const subProblem = permutation(rest)

    subProblem.forEach((sub) => {
      // 组合
      result.push([e, ...sub])
    })
  }

  return result
}
```

知道了全排列解决方法，看看怎么在类型上实现。

最终的结果是 Union 类型，利用分配条件类型可以结果处理

```ts
// T 'A' | 'B' | 'C'
type Permutation<'A' | 'B' | 'C'> =
    ['A', Permutation<'B', 'C'>] |
    ['B', Permutation<'A', 'C'>] |
    ['C', Permutation<'A', 'B'>]
```

使用 Distributive Conditional Type 来对联合类型（'A' | 'B' | 'C'）中的每个中子类型做遍历。

```ts
type Permutation<T> = T extends unknown ? [T, ...Permutation<?>] : never
```

`?`代表 T 中剔除一个元素外的其他元素，由于条件类型中分配式的处理，T 当前代表了单个的类型，而不是整体的联合类型，需要添加一个参数保留原始的类型信息。

```ts
type Permutation<T, U = T> = T extends unknown
  ? [T, ...Permutation<Exclude<U, T>>]
  : never
```

`unknown`类型的用意是这里什么类型不重要，关键是利用了分配条件类型。

U 就是使用了泛型默认参数保留原始 T，然后利用`Exclude<U, T>`在条件类型中剔除单个元素。

注意这里`[T, ...Permutation<Exclude<U, T>>]`类型中，`Permutation<Exclude<U, T>>`是一个 Union 类型和展开运算符配合使用`...`也会按照分配（distributive）的方式来处理。下面的例子。

```ts
// R 的类型是 [1, 2, 3] | [1, 4, 5]
type R1 = [1, ...([2, 3] | [4, 5])]

// R2的类型是 never
type R2 = [1, ...never]
```

考虑递归的基本情况，当所有元素被剔除后，`Exclude<U, T>`得到了空集，由类型`never`代表，`Permutation<never>`应该返回`[]`，这样`[T, ...Permutation<Exclude<U, T>>]`才能正确递归。

```ts
type IsNever<T> = [T] extends [never] ? true : false
type Permutation<T, U = T> = IsNever<T> extends true
  ? []
  : T extends any
  ? [T, ...Permutation<Exclude<U, T>>]
  : never
```

IsNever 的解释

[解释](https://ghaiklor.github.io/type-challenges-solutions/en/medium-permutation.html)
https://github.com/type-challenges/type-challenges/issues/614

## Combination（组合）

[问题](https://github.com/type-challenges/type-challenges/blob/main/questions/08767-medium-combination/README.md)

```ts
// expected to be `"foo" | "bar" | "baz" | "foo bar" | "foo bar baz" | "foo baz" | "foo baz bar" | "bar foo" | "bar foo baz" | "bar baz" | "bar baz foo" | "baz foo" | "baz foo bar" | "baz bar" | "baz bar foo"`
type Keys = Combination<['foo', 'bar', 'baz']>
```

```ts
type Combination<
  T extends string[],
  U = T[number],
  I = U
> = I extends infer S extends string
  ? S | `${S} ${Combination<T, Exclude<U, I>>}`
  : never
```

[Solution 1](https://ghaiklor.github.io/type-challenges-solutions/en/medium-nomiwase.html)

## TS2589

```ts
type RepeatX<N extends number, T extends any[] = []> = T['length'] extends N
  ? T
  : RepeatX<N, [...T, 'X']>

type T1 = RepeatX<5> // => ["X", "X", "X", "X", "X"]
// TS2589: Type instantiation is excessively deep and possibly infinite.
type T2 = RepeatX<50> // => any
```

它是由泛型实例化递归嵌套过深造成的。
因为泛型 RepeatX 接收了一个数字类型入参 N，并返回了一个长度为 N、元素都是 'X' 的数组类型，所以第 1 个类型 T1 包含了 5 个 "X" 的数组类型。但是第 2 个类型 T2 的类型却是 any，并且提示了 TS2589 类型错误。这是因为 TypeScript 在处理递归类型的时候，最多实例化 50 层，如果超出了递归层数的限制，TypeScript 便不会继续实例化，并且类型会变为 top 类型 any。
对于上面的错误，我们使用 @ts-ignore 注释忽略即可。

## Union 类型的分配式处理

keyof 是个特例 ？

```ts
type S = keyof (Foo | Bar)
type S1 = keyof (Foo & Bar)

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type Foo = {
  a: number
  b: string
}
type Bar = {
  b: number
  c: boolean
}

type WS = ' ' | '\t' | '\n'
// ' Hello' | '\tHello' | '\nHello'
type Union = `${WS}Hello`
```

## Chainable

TODO: 函数的参数类型是如何匹配推导的？
这里第一个参数似乎是直接推导为 K，知道了 K 是"name"，然后通过 ChainableKeys 得到 never

1. 参考 ts-pattern 库

```ts
type Chainable<T = {}> = {
  option<K extends string, V>(
    key: ChainableKeys<T, K, V>,
    value: V
  ): Chainable<Record<K, V> & Omit<T, K>>
  get(): T
}

type ChainableKeys<T, K, V> = K extends keyof T
  ? V extends T[K]
    ? never
    : K
  : K

/* _____________ Test Cases _____________ */
import type { Alike, Expect } from '@type-challenges/utils'

declare const a: Chainable

const result1 = a
  .option('foo', 123)
  .option('bar', { value: 'Hello World' })
  .option('name', 'type-challenges')
  .get()

const result2 = a
  .option('name', 'another name')
  // @ts-expect-error
  .option('name', 'last name')
  .get()

const result3 = a.option('name', 'another name').option('name', 123).get()

type cases = [
  Expect<Alike<typeof result1, Expected1>>,
  Expect<Alike<typeof result2, Expected2>>,
  Expect<Alike<typeof result3, Expected3>>
]

type Expected1 = {
  foo: number
  bar: {
    value: string
  }
  name: string
}

type Expected2 = {
  name: string
}

type Expected3 = {
  name: number
}
```
