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

kebab-case

```ts
/* _____________ Your Code Here _____________ */
type IsUpperCase<C extends string> = C extends Lowercase<C> ? false : true
type KebabCase<S extends string> = S extends `${infer H}${infer Rest}`
  ? `${Lowercase<H>}${KebabCaseHelper<Rest>}`
  : S

type KebabCaseHelper<S extends string> = S extends `${infer H}${infer Rest}`
  ? IsUpperCase<H> extends true
    ? `-${Lowercase<H>}${KebabCaseHelper<Rest>}`
    : `${H}${KebabCaseHelper<Rest>}`
  : S

type T = KebabCase<'foo-bar'>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<KebabCase<'FooBarBaz'>, 'foo-bar-baz'>>,
  Expect<Equal<KebabCase<'fooBarBaz'>, 'foo-bar-baz'>>,
  Expect<Equal<KebabCase<'foo-bar'>, 'foo-bar'>>,
  Expect<Equal<KebabCase<'foo_bar'>, 'foo_bar'>>,
  Expect<Equal<KebabCase<'Foo-Bar'>, 'foo--bar'>>,
  Expect<Equal<KebabCase<'ABC'>, 'a-b-c'>>,
  Expect<Equal<KebabCase<'-'>, '-'>>,
  Expect<Equal<KebabCase<''>, ''>>,
  Expect<Equal<KebabCase<'😎'>, '😎'>>
]
```

CamelCase

```ts
type PascalCase<S extends string> = S extends `${infer F}_${infer Rest}`
  ? `${Capitalize<Lowercase<F>>}${PascalCase<Rest>}`
  : Capitalize<Lowercase<S>>

type CamelCase<S extends string> = Uncapitalize<PascalCase<S>>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<CamelCase<'foobar'>, 'foobar'>>,
  Expect<Equal<CamelCase<'FOOBAR'>, 'foobar'>>,
  Expect<Equal<CamelCase<'foo_bar'>, 'fooBar'>>,
  Expect<Equal<CamelCase<'foo_bar_hello_world'>, 'fooBarHelloWorld'>>,
  Expect<Equal<CamelCase<'HELLO_WORLD_WITH_TYPES'>, 'helloWorldWithTypes'>>,
  Expect<Equal<CamelCase<'-'>, '-'>>,
  Expect<Equal<CamelCase<''>, ''>>,
  Expect<Equal<CamelCase<'😎'>, '😎'>>
]
```

StartsWith

```ts
type StartsWith<T extends string, U extends string> = T extends `${U}${string}`
  ? true
  : false

type EndsWith<T extends string, U extends string> = T extends `${string}${U}`
  ? true
  : false

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<StartsWith<'abc', 'ac'>, false>>,
  Expect<Equal<StartsWith<'abc', 'ab'>, true>>,
  Expect<Equal<StartsWith<'abc', 'abc'>, true>>,
  Expect<Equal<StartsWith<'abc', 'abcd'>, false>>,
  Expect<Equal<StartsWith<'abc', ''>, true>>,
  Expect<Equal<StartsWith<'abc', ' '>, false>>,
  Expect<Equal<StartsWith<'', ''>, true>>
]
```
