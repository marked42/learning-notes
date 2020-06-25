  // TODO:
  // https://zhuanlan.zhihu.com/p/91144493?utm_source=wechat_session&utm_medium=social&utm_oi=32148677459968
  // TODO: ?
  type v1 = number extends {} ? true : false
namespace Flatten {
  let obj = {
    a: 1,
    b: {
      c: 'string',
      d: {
        e: [1,2],
        f: {},
      },
    },
  }

  let expected = {
    a: 1,
    c: 'string',
  }

  // 类型T是对象类型
  type isObject<T> = T extends object ? true : never
  type o1 = isObject<null>

  // 类型T是空对象类型
  type isEmptyObject<T> = keyof T extends never ? true : false
  // type PrimitiveTypes = string | number | boolean | null | undefined | symbol
  // type isPrimitive<T> = T extends

  // 找到所有属性值不是对象的键的集合
  type NonObjectPropKeys<T> = NonObjectPropKeysHelper<T, keyof T>
  type NonObjectPropKeysHelper<T, K extends keyof T> = K extends any
    ? (T[K] extends any[] ? K : T[K] extends object ? never : K)
    : never
  type nonObjectPropKeys = NonObjectPropKeys<typeof obj>

  // 反转条件类型，找到所有属性值是对象的键的集合
  type ObjectPropKeys<T> = ObjectPropKeysHelper<T, keyof T>
  type ObjectPropKeysHelper<T, K extends keyof T> = K extends any
    ? (T[K] extends any[] ? never : T[K] extends object ? K : never)
    : never
  type objectPropKeys = ObjectPropKeys<typeof obj>

  type NonObjectPropKeysWithMappedType<T> = {
    [K in keyof T]: T[K] extends any[] ? K : T[K] extends object ? never : K
  }[keyof T]
  type nonObjectKeysWithMappedType = NonObjectPropKeysWithMappedType<typeof obj>

  type ObjectPropKeysWithMappedType<T> = {
    [K in keyof T]: T[K] extends object ? K : never
  }[keyof T]
  type objectKeysWithMappedType = ObjectPropKeysWithMappedType<typeof obj>


  //
  type NonObjectPicks<T> = Pick<T, NonObjectPropKeys<T>>
  type nonObjectPicks = NonObjectPicks<typeof obj>

  type ObjectPicks<T> = Pick<T, ObjectPropKeys<T>>
  type objectPicks = ObjectPicks<typeof obj>

  type ObjectValues<T> = ObjectPicks<T>[keyof ObjectPicks<T>]


  type ValueOf<T> = T[keyof T]
  type v1 = ValueOf<ObjectPicks<typeof obj>>

  // type Obj<T> = T extends object ? T : never
  type v3 = typeof obj[keyof typeof obj]

  type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

  type t = ValueOf<typeof obj>
  type Obj<T> = T extends object ? T : never

  type t1 = Obj<typeof obj[keyof typeof obj]>
  type T = typeof obj
  type answer = NonObjectPicks<T> & UnionToIntersection<Obj<T[keyof T]>>

  // let a: typeof expectedObj = expectedObj as answer

  type TObj = typeof obj
  // type Flatten<T> = NonObjectPicks<T> & UnionToIntersection<Flatten<Obj<T[keyof T]>>>
  // type UTo<T> = UnionToIntersection<Obj<T[keyof T]>>
  // type ins = UTo<TObj>

  let obj1 = {
    // a: 1,
    // b: [2],
    c: {
      d: 1,
      f: 2,
    },
    h: {
      g: 1,
    }
  }
  type Flatten<T> = {
    "default": T extends object
      ? NonObjectPicks<T> & UnionToIntersection<Flatten<ObjectValues<T>>>
      : never
    "other": never
  }[
    T extends object
      ? "default"
      : "other"
  ]
  type ValueOrArray<T> = T | Array<ValueOrArray<T>>;


  type Flatten3<T> = {
    "default": T extends object
      ? NonObjectPicks<T> & UnionToIntersection<Flatten3<ObjectValues<T>>>
      : never
  }[T extends any ? "default" : "default"]
  type empty = Flatten3<{}>
  type empty2 = Flatten3<never>
  type empty3 = UnionToIntersection<never>
  type empty1 = ObjectValues<{ a: 1, b:2 }>

  type Flatten8<T> = {
    "default": T extends object
      ? NonObjectPicks<T> & UnionToIntersection<Flatten8<ObjectValues<T>>>
      : never
    "empty": {},
  }[keyof T extends never ? "empty" : "default"]
  // type Flatten3<T> = {
  //   "default": NonObjectPicks<T> & UnionToIntersection<Flatten3<ObjectValues<T>>>
  // }[T extends any ? "default" : "default"]
  // type Flatten4<T> = {
  //   "default": T extends object
  //     ? NonObjectPicks<T> & UnionToIntersection<Flatten4<ObjectValues<T>>>
  //     : never
  // }["default"]
  type vv = NonObjectPicks<{}>
  type vv2 = NonObjectPicks<never>
  type vv1 = ObjectValues<{}>
  type vv3 = Flatten3<typeof obj>
  let v3 : vv3;
  type vv4 = Flatten8<typeof obj1>
  let v4 : vv4;

  type a00 = keyof {}

  type v = Exclude<string[] | number | {}, string[] | number>


}
