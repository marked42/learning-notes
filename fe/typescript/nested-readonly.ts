type NestedReadonly<T> = {
  readonly [K in keyof T]: NestedReadonly<T[K]>
}

type isSame<T1, T2> = T1 extends T2 ? (T2 extends T1 ? true : false) : false

let a = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3,
    }
  }
}

type ExpectedType = {
  readonly a: number;
  readonly b: {
    readonly c: number;
    readonly d: {
      readonly e: number;
    }
  }
}

type same = isSame<ExpectedType, NestedReadonly<typeof a>>

type k1  = keyof (string)
type k2  = keyof (number)
type k3  = keyof (boolean)
// "valueOf"
type k4  = keyof (Boolean)

// TODO:
// keyof (string | number | boolean) 直接求值，共同的键值只有一个”valueOf"
// k = "valueOf"
type k  = keyof (string | number | boolean)

// 在映射类型中变成了三个 "toString" | "toLocaleString" | "valueOf"
// M = {
//   toString: "toString",
//   toLocaleString: "toLocalString",
//   valueOf: "valueOf",
// }
type M = {
  [K in keyof (string | number | boolean)]: K;
}
type M1 = {
  [K in keyof string]: K;
}
type M2 = {
  [K in keyof number]: K;
}
type M3 = {
  [K in keyof boolean]: K;
}

type M4 = {
  [K in keyof (null | undefined)]: string;
}

type NestedReadonlyV2<T> = {
  readonly [K in keyof T]: T[K] extends object ? NestedReadonlyV2<T[K]> : T[K];
}

type same2 = isSame<ExpectedType, NestedReadonlyV2<typeof a>>
