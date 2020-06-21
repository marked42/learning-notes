namespace FnIntersection {
  type F1 = (a: string, b: string) => string | number;
  type F2 = (a: number, b: number) => number | boolean;

  let fNumber: F1 & F2 = (a: string | number, b: string | number): number => { return 1 }
  // 返回类型错误
  // let fString: F1 & F2 = (a: string | number, b: string | number): string => { return '1' }
  // let fBoolean: F1 & F2 = (a: string | number, b: string | number): boolean => { return true }

  let fNumber1: F1 & F2 = (a: any, b: any): number => { return 1 }

  fNumber1('hello', 'world')
  fNumber1(1, 3)

  fNumber('hello', 'world')
  fNumber(1, 3)
  // typescript可以从重载中选出一个从而检测出这个调用是不合法的。
  // fNumber(1, 'test')

  type IntersectionFun<F1 extends (a: any, b: any) => any, F2 extends (a: any, b: any) => any>
    = (
        a: Parameters<F1>[0] | Parameters<F2>[0],
        b: Parameters<F1>[1] | Parameters<F2>[1],
      ) => ReturnType<F1> & ReturnType<F2>
}
