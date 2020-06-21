namespace FnUnion {
  type F1 = (a: string, b: string) => string | number;
  type F2 = (a: number, b: number) => number | boolean;

  namespace E1 {
    // F1符合 (a: string, b: string) => string | number
    let fUnion: F1 | F2 = (a: string , b: string): number => {
      return 1
    }
    fUnion('hello', 'world')
    fUnion(1, 3)
    fUnion(1, 'test')
  }

  namespace E2 {
    // F2符合 (a: number, b: number) => number | boolean
    let fUnion: F1 | F2 = (a: number, b: number): number => {
      return 1
    }
    fUnion('hello', 'world')
    fUnion(1, 3)
    fUnion(1, 'test')
  }

  namespace E3 {
    // (a: never, b: never) => string : number | boolean
    let fUnion: F1 | F2 = (a: number | string, b: number | string): any => {
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
