type Head<T extends any[]> = T extends [any, ...infer A] ? T[0] : never

type Params<T extends (...args: any) => any> = T extends (
  ...args: infer A
) => any
  ? A
  : never

const foo = (name: string, age: number, single: boolean) => true

type test08 = Params<typeof foo>
type test09 = Head<[1, 2, string, number]>
type test10 = Head<Params<typeof foo>>

type Tail<T extends any[]> = T extends [any, ...infer Tail] ? Tail : never

type test11 = Tail<[1, 2, string, number]>
type test12 = Tail<Params<typeof foo>>
type test13 = Tail<test12>
type test131 = Tail<test13>
type test132 = Tail<test131>

type HasTail<T extends any[]> = T extends [] | [any] ? false : true

type params = [1, 2, string]
type test14 = HasTail<params>
type test15 = HasTail<Tail<params>>
type test16 = HasTail<Tail<Tail<params>>>

type ObjectInfer<O> = O extends { a: infer A } ? A : never

const object = { a: 'hello' }
type test17 = ObjectInfer<typeof object>
type test18 = ObjectInfer<number>

type FunctionInfer<F> = F extends (...args: infer A) => infer R ? [A, R] : never
const fn01 = (a: number, b: string) => true
type test19 = FunctionInfer<typeof fn01>

type ClassInfer<C> = C extends Promise<infer P> ? P : never
const promise = new Promise<string>(() => {})
type test20 = ClassInfer<typeof promise>

type ArrayInfer<A> = A extends (infer E)[] ? E : never
const array = [0, 'data', 1, 'data']
type test21 = ArrayInfer<typeof array>
type F = typeof array[number]

type TupleInfer<T> = T extends [infer A, ...infer U] ? [A, U] : never
type test22 = TupleInfer<[string, boolean, number]>

const toCurry01 = (name: string, age: number, single: boolean) => true
const curried01 = (name: string) => (age: number) => (single: boolean) => true

type CurryV0<P extends any[], R> = (
  arg0: Head<P>
) => HasTail<P> extends true ? CurryV0<Tail<P>, R> : R

declare function curryV0<P extends any[], R>(
  f: (...args: P) => R
): CurryV0<P, R>

const value = curryV0(toCurry01)
type R = typeof value

const toCurry02 = (name: string, age: number, single: boolean) => true
const curried02 = curryV0(toCurry02)
const test23 = curried02('jane')(26)(true)

type Last<T extends any[]> = {
  0: Last<Tail<T>>
  1: Head<T>
}[HasTail<T> extends true ? 0 : 1]

type Last1<T extends any[]> = HasTail<T> extends true ? Last<Tail<T>> : Head<T>
type test29 = Last1<[1, 2, 3, 4]>

type Length<T extends any[]> = T['length']
type test30 = Length<[]>
type test31 = Length<[string]>
type test32 = Length<[string, number]>

// type Prepend<E, T extends any[]> = [E, ...T]
type Prepend<E, T extends any[]> = ((head: E, ...args: T) => any) extends (
  ...args: infer U
) => any
  ? U
  : T

type test34 = Prepend<string, []>
type test35 = Prepend<string, [1, 2]>

type Drop<
  N extends number,
  T extends any[],
  I extends any[] = []
> = Length<I> extends N ? T : Drop<N, Tail<T>, Prepend<any, I>>

type test39 = Drop<2, [1, 2, 3, 4]>
type test40 = Drop<Length<test39>, test39>

type CurryV4<P extends any[], R> = <T extends any[]>(
  ...args: T
) => Length<Drop<Length<T>, P>> extends 0 ? R : CurryV4<Drop<Length<T>, P>, R>

declare function curryV4<P extends any[], R>(
  f: (...args: P) => R
): CurryV4<P, R>

const toCurry08 = (name: string, age: number, single: boolean) => true
const curried08 = curryV4(toCurry08)
const test43 = curried08('jane')(26)(true)
const test44 = curried08('jane', 26, true)
const test45 = curried08('jane', 26)(4000)

type testargs = [string, number, boolean, ...any[]]
type test46 = Length<testargs>

const toCurry09 = (
  name: string,
  age: number,
  single: boolean,
  ...rest: string[]
) => true

const curried = curryV4(toCurry09)
const test47 = curried('jane', 26)(true)
const test48 = curried('jane', 26)(true)('jae', 1)

type T1 = Length<[string, number, boolean]>
type T2 = Length<[string, number, boolean, ...any[]]>
type T3 = Length<[...any[]]>
