# TemplateLiteral

[4.1](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#template-literal-types)

https://javascript.plainenglish.io/how-to-use-typescript-template-literal-types-like-a-pro-2e02a7db0bac
https://michalzalecki.com/typescript-template-literal-types/
https://adrianfaciu.dev/posts/template-literal-types/

https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html
https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-8.html#improved-inference-for-infer-types-in-template-string-types
https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#template-string-types-as-discriminants

```ts
// `${infer H}{infer T}` 是如何推导出H和T的？
// H匹配第一个字符？
type TrimLeft<S extends string> = S extends `${infer H}${infer T}`
  ? H extends ' ' | '\n' | '\t'
    ? TrimLeft<T>
    : S
  : S

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<TrimLeft<'str'>, 'str'>>,
  Expect<Equal<TrimLeft<' str'>, 'str'>>,
  Expect<Equal<TrimLeft<'     str'>, 'str'>>,
  Expect<Equal<TrimLeft<'     str     '>, 'str     '>>,
  Expect<Equal<TrimLeft<'   \n\t foo bar '>, 'foo bar '>>,
  Expect<Equal<TrimLeft<''>, ''>>,
  Expect<Equal<TrimLeft<' \n\t'>, ''>>
]

// 不生效 TODO: 解释原因
type TrimRight<S extends string> = S extends `${infer H}${infer T}`
  ? T extends ' ' | '\n' | '\t'
    ? TrimLeft<H>
    : S
  : S

// 正确写法
type WS = ' ' | '\t' | '\n'
type TrimLeft<S extends string> = S extends `${WS}${infer T}` ? TrimLeft<T> : S

type Union = `${WS}Hello`

type Trim<S extends string> = S extends
  | `${WS}${infer Rest}`
  | `${infer Rest}${WS}`
  ? Trim<Rest>
  : S
```

Replace

```ts
type Replace<
  S extends string,
  From extends string,
  To extends string
> = From extends ''
  ? S
  : S extends `${infer H}${From}${infer T}`
  ? `${H}${To}${T}`
  : S

type ReplaceAll<
  S extends string,
  From extends string,
  To extends string
> = From extends ''
  ? S
  : S extends `${infer H}${From}${infer T}`
  ? // 替换过后可能拼接处肯能形成匹配 ReplaceAll<`${H}${To}${T}`, From, To>
    `${H}${To}${ReplaceAll<T, From, To>}`
  : S
```

LengthOfString 匹配第一个字符

```ts
type LengthOfString<
  S extends string,
  Length extends unknown[] = []
> = S extends ''
  ? Length['length']
  : S extends `${infer H}${infer T}`
  ? LengthOfString<T, [...Length, T]>
  : never

type V = LengthOfString<'kumiko'>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<LengthOfString<''>, 0>>,
  Expect<Equal<LengthOfString<'kumiko'>, 6>>,
  Expect<Equal<LengthOfString<'reina'>, 5>>,
  Expect<Equal<LengthOfString<'Sound! Euphonium'>, 16>>
]
```

Absolute 去除几个特殊字符

```ts
type Absolute<
  T extends number | string | bigint,
  S = `${T}`
> = S extends `${infer H}${'-' | '_' | 'n'}${infer T}`
  ? Absolute<T, `${H}${T}`>
  : S

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Absolute<0>, '0'>>,
  Expect<Equal<Absolute<-0>, '0'>>,
  Expect<Equal<Absolute<10>, '10'>>,
  Expect<Equal<Absolute<-5>, '5'>>,
  Expect<Equal<Absolute<'0'>, '0'>>,
  Expect<Equal<Absolute<'-0'>, '0'>>,
  Expect<Equal<Absolute<'10'>, '10'>>,
  Expect<Equal<Absolute<'-5'>, '5'>>,
  Expect<Equal<Absolute<-1_000_000n>, '1000000'>>,
  Expect<Equal<Absolute<9_999n>, '9999'>>
]
```

StringToUnion

```ts
type StringToUnion<T extends string> = T extends `${infer C}${infer T}`
  ? C | StringToUnion<T>
  : never

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<StringToUnion<''>, never>>,
  Expect<Equal<StringToUnion<'t'>, 't'>>,
  Expect<Equal<StringToUnion<'hello'>, 'h' | 'e' | 'l' | 'l' | 'o'>>,
  Expect<
    Equal<
      StringToUnion<'coronavirus'>,
      'c' | 'o' | 'r' | 'o' | 'n' | 'a' | 'v' | 'i' | 'r' | 'u' | 's'
    >
  >
]
```
