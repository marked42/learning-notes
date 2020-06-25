namespace FnUnion {
  type F1 = (a: string, b: string) => string | number;
  type F2 = (a: number, b: number) => number | boolean;

  // 赋值语句
  namespace Assign {
    // number 类型赋值给 string | number类型，f被推断为更准确的类型 number
    const f: string | number = 1
  }

  namespace E0 {
    // 函数并集操作，入参逆变，出参协变
    let fUnion2: F1 | F2 = 1 as any
    fUnion2(1 as never, 1 as never)
  }

  namespace E1 {
    // F1符合 (a: string, b: string) => string | number
    let fUnion: F1 | F2 = (a: string , b: string): number | '1' => {
      return 1
    }
    fUnion('hello', 'world')
    fUnion(1, 'test')
    fUnion(1, 3)
  }

  namespace E2 {
    // F2符合 (a: number, b: number) => number | boolean
    let fUnion: F1 | F2 = (a: number, b: number): number => {
      return 1
    }
    fUnion(1, 3)
    fUnion('hello', 'world')
    fUnion(1, 'test')
  }

  namespace E3 {
    // F2符合 (a: number, b: number) => number | boolean
    let fUnion: F1 | F2 = (a: number, b: string): number => {
      return 1
    }
    fUnion(1, 3)
    fUnion('hello', 'world')
    fUnion(1, 'test')
  }

  namespace E4 {
    let fUnion: F1 | F2 = (a: number, b: number | string): number => {
      return 1
    }
    fUnion('hello', 'world')
    fUnion(1, 3)
    fUnion(1, 'test')
  }

  namespace E5 {
    // (a: never, b: never) => string : number | boolean
    // TODO: 为什么没有被推为 (a: number | string, b: number | string)
    let fUnion: F1 | F2 = (a: number | string, b: number | string): number => {
      return 1
    }
    fUnion('hello', 'world')
    fUnion(1, 3)
    fUnion(1, 'test')
  }

  type Union<F1 extends (a: any, b: any) => any, F2 extends (a: any, b: any) => any>
    = (
        a: Parameters<F1>[0] & Parameters<F2>[0],
        b: Parameters<F1>[1] & Parameters<F2>[1],
      ) => ReturnType<F1> | ReturnType<F2>
}
