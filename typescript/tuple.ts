// 返回一个元祖类型的第一个类型, Head<[string, number, boolean]> => string
export type Head<T extends any[]> = T extends [any, ...any[]] ? T[0] : never

// 返回一个元祖类型里的除第一个类型, Tail<[1, 2, 3]> => [2, 3]
export type Tail<T extends any[]> = ((...args: T) => any) extends ((arg1: any, ...tail: infer A) => any) ? A : []

// 判断一个元祖类型元素数量是否 >= 1
export type HasTail<T extends any[]> =
  T extends ([] | [any]) ? false : true


export type Last<T extends any[]> = { 0: Last<Tail<T>>, 1: Head<T> }[HasTail<T> extends true ? 0 : 1]

type a = Last<[1, 2, 3]> // => 3

type h1 = Head<[]>
type h2 = Head<[string]>
type h3 = Head<[any, any]>

type Tail1<T extends any[]> = T extends [infer R, ...(infer U)[]] ? U : []

type t1 = Tail1<[]>
type t2 = Tail1<[string]>
type t3 = Tail1<[any, any]>
type t4 = Tail1<[any, number, number]>

type Length<T extends any[]> = T["length"]
type l = Length<[]>
type l1 = Length<[string]>
type l2 = Length<[string, boolean]>
type l3 = Length<any[]>

type CompareLength<T1 extends any[], T2 extends any[]> = keyof T1 extends keyof T2
  ? keyof T2 extends keyof T1
    ?  0
    : -1
  : 1

type shorter = CompareLength<[string, number], [null, undefined, number]>
type equal = CompareLength<[string, number], [null, undefined]>
type longer = CompareLength<[string, number], [null]>

type concat<T, U extends any[]> = ((arg: T, ...args: U) => void) extends ((...args: infer R) => void)
  ? R : never
type a1 = concat<number, [string, boolean]>
