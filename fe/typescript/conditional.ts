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

  let A: never = {}
  let B: never = { a: 1 }
  console.log(A)
  console.log(B)
}
