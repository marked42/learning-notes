namespace Conditional {
  interface Student {
    name: string;
    friends: string[];
    teachers: string[];
  }

  // 实现一个FilterArrayKeys<T>，返回T中所有值是数组类型的键的集合
  // 从Student中找出值是数组类型的键名称类型 FilterArrayKeys
  // ArrayKeys应该是 "friends" | "teachers"
  // type ArrayKeys = FilterArrayKeys<Student>

  namespace NonDistributive {
    // T[K]是值的类型，但是这种形式不发生分配
    type FilterArrayKeys<T, K extends keyof T = keyof T> = T[K] extends any[] ? K : never;

    // ArrayKeys = never
    type ArrayKeys = FilterArrayKeys<Student, keyof Student>
  }

  namespace Distributive {
    // 为了发生分配，使用K嵌套一层即可
    type FilterArrayKeys<T, K extends keyof T = keyof T> = K extends any
      ? T[K] extends any[] ? K : never
      : never

    // ArrayKeys = "friends" | "teachers"
    type ArrayKeys = FilterArrayKeys<Student>
  }

  namespace UnionToIntersection {
    namespace Impl1 {
      // ok
      type UnionToIntersection<U> =
        (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

      // never
      type inter = UnionToIntersection<string | number>

      // 分配条件类型扩展为
      // 1. (
      //   string extends any ? (k: string) => void : never
      //   | number extends any ? (k: number) => void : never
      // ) extends ((k: infer I) => void) ? I : never
      // 2. ((k: string) => void | (k: number) => void) extends ((k: infer I) => void) ? I : never
      // 3. 函数并集，入参逆变
      // ((k: string & number) => void) extends ((k: infer I) => void) ? I : never
      // 4. 推导出 I extends (string & number) 所以 I = string & number = never
    }

    namespace Impl2 {
      // error
      type UnionToIntersection1<U> =
        ((k: U) => void) extends ((k: infer I) => void) ? I : never

      type inter1 = UnionToIntersection1<string | number>

      // 不发生分配条件类型
      // 1. ((k: string | number) => void) extends ((k: infer I) => void) ? I : never
      // 2. 推导出 I extends string | number，所以 I = string | number
    }

    namespace Impl3 {
      // error
      type UnionToIntersection2<U> = U extends any
        ? ((k: U) => void) extends ((k: infer I) => void) ? I : never
        : never

      type inter2 = UnionToIntersection2<string | number>

      // 1. 发生条件类型分配
      //   | string extends any
      //     ? ((k: string) => void) extends ((k: infer I) => void)) ? I : never
      //     : never
      //   | number extends any
      //     ? ((k: number) => void) extends ((k: infer I) => void)) ? I : never
      //     : never
      // 2. 替换
      //     | ((k: string) => void) extends ((k: infer I) => void)) ? I : never
      //     | ((k: number) => void) extends ((k: infer I) => void)) ? I : never
      // 3. 每个infer I参数是独立的，分别推导为对应类型
      //     | string
      //     | string
    }

    namespace Impl4 {
      // error，
      type UnionToIntersection<U> =
        (U extends any ? () => U: never) extends (() => infer I) ? I : never

      type inter = UnionToIntersection<string | number>

      // 1. (string | number extends any ? () => string | number : never) extends (() => infer I) ? I : never
      // 2. (() => string | number) extends (() => infer I) ? I : never
      // 3. string | number extends I
      // 4. I = string | number
    }
  }
}
