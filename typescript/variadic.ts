interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
  tick:()=>void;
}

function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {//这个和泛型中使用类类型相同，
  return new ctor(hour, minute);//需要类型为ClockInterface的两个参数的构造器类，只是二者写法有点区别
}

class DigitalClock implements ClockInterface {//这边实现的接口不能是直接的构造器
  constructor(h: number, m: number) { }
  tick() {
      console.log("beep beep");
  }
}
class AnalogClock implements ClockInterface {
  constructor(h: number, m: number) { }
  tick() {
      console.log("tick tock");
  }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);

type TTuple = [string, number];
type Res = TTuple[number];
// type Res2 = TTuple[string];

type KeyType1 = keyof any

interface Collection<T extends string, U> {
  // [prop: 1]: U;
  ['a'](): void;
  [1](): void;
  ['1'](): void;
  // [Symbol.iterator](): void;
}

let obj: Collection<string, string> = {
  a() {

  },
  ['1']() {
    return 'string'
  },
  [1]() {
    return 'number'
  },
}
