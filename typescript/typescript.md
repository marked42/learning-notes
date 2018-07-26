# Typescript

## Types

1. `any` is super type of any other type
1. `void` type is used as return type of function that doesn't returns. A variable of `void` can only accept `null` and `undefined` as its value.
1. `undefined` and `null` type are type with single valid value `undefined` and `null` respectively. And they are subtypes of normal type like `string`/`number` so that a variable of type `string` can accept `undefined` and `null`. However, when `strictNullCheck` option is enabled, this is not allowed.
1. `never` type is the return type of function when function throws exception or never ends (dead loop), `never` type is subtype of any other type.

![Type graph](./typegraph.jpeg)

## Interface

Interface `SquareConfig` specifies `color` property as optional, so object literal is actually compatible with `SquareConfig`. But it's probably that object literal property `colour` is a misspell instead of intentional naming. So when object literals are used, every property of object literal is checked against target type to avoid careless like typos below and this is called **excess property checks**.

```ts
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
    // ...
}

let mySquare = createSquare({ colour: "red", width: 100 });

// to fix this use a variable instead of object literal
var object = { colour: "red", width: 100 }
let mySquare = createSquare(object)

// or type casting
let mySquare = createSquare({ colour: 'red', width: 100} as SquareConfig)
```

Function Type, Property Type and Indexable Types

```ts
interface Test {
  (name: string): string; // function type as normal function call
  new (gender: boolean): string;  // function type as constructor call

  readonly name?: string; // property declaration

  // 1. indexable type that describes required type of all object properties
  // 2. single property declaration must be compatible with indexable property
  // 3. indexable property of number type must be compatible with indexable property of string type,
  //    because javascript treats number property as internally.
  [prop: number]: string;
  [prop: string]: string;
}
```

Class has two side of types.

1. instance side - all instance class properties including instance class functions
1. static side - all static class properties including class constructor

Class extending interface will only checks **instance side** of class **public properties** against target interface. Static side of class must be checked intentionally.

```ts
interface ClockConstructor {
    new (hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
    tick();
}

function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
    return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface {
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
```

## Class

A common pattern that constructor receives a parameter and use it to initialize a class property instantly.

```ts
class Octopus {
  name: string;
  readonly numberOfLegs: number = 8;

  constructor(theName: string) {
    this.name = theName;
  }
}
```

Parameter property is shorthand syntax for this common pattern, constructor parameter prefixed with accessibility modifier (`public/protected/private`) or `readonly` or both is a parameter property. It's same as declaring a class property of same name and initializes it manually in constructor.

```ts
class Octopus {
    readonly numberOfLegs: number = 8;
    constructor(readonly name: string) {
    }
}
```

Class declarations in typescript creates two things.

1. An type that describes instance object of class
1. A function object that is the constructor of this class, use `new Constructor()` to create class instance.

## Function

```ts
function mix(first: string, second: number = 1, third?: boolean, ...rest: string[]): void {}
// Function signature
(first:string, second:number, third?: boolean, rest: string[]) => void

// default parameter after all required parameter optional
// default parameter before any required parameter is required
function defaultAtLast(first:string, last: number = 1) : void {}
(first: string, last?: number) => void


// use this parameter as first to specify type of `this` in function
function f(this: void) {
  // make sure `this` is unusable in this standalone function
}

interface Callback {
  (this: EventTarget):  void;
}

addEventListener('click', callback: Callback)

// new () => string specifies c is a constructor returning string
function create(c: new() => string): string

```

## Generic

```ts
function create<T>(c: {new(): T; }): T {
    return new c();
}
```

## Enum

Enum value can be number or string, and it's value must be able to determined in compile time.

```ts
enum Direction {
  Left,   // first enum value is considered 0 if value not specified
  Right,  // other enum value will be 1 plus preceding enum value
}
```

When all enum values are constant enum members initialized to

1. number literal (maybe prefixed with unary sign `-`/`+`)
1. string literal

Each enum member becomes a type and enum itself becomes a union type of all enum members.

```ts
enum ShapeKind {
    Circle,
    Square,
}

interface Circle {
    kind: ShapeKind.Circle;
    radius: number;
}

interface Square {
    kind: ShapeKind.Square;
    sideLength: number;
}

let c: Circle = {
    kind: ShapeKind.Square,
    //    ~~~~~~~~~~~~~~~~ Error!
    radius: 100,
}
```

Integer enum members have reverse mapping, which maps from value to numeric key.

```ts
enum Enum {
    A
}
let a = Enum.A;
let nameOfA = Enum[a]; // "A"
```

Enum is compiled as an actual object, so it may be passed around as an normal variable.

```js
var Enum;
(function (Enum) {
    Enum[Enum["A"] = 0] = "A";
})(Enum || (Enum = {}));
var a = Enum.A;
var nameOfA = Enum[a]; // "A"
```

Const enums can only use constant enum expression and are removed completely during compilation. Any use of const enum members are inlined (replace with corresponding constant value).

```ts
const enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right]
```

Uninitialized enum `B` is considered as computed and it's value is not calculated from previous enum value since ambient enums are declared to describe existed enums.

```ts
declare enum Enum {
  A = 1,
  B,
  C = 2
}
```

## Type Compatibility

## Module and Namespace

A file with top level `import`/`export` statements are considered as a module, otherwise it's consider as a script file and its contents are defined on global context and are available to all modules.

```ts
import './math'                         // pure import
import { Random as rand } from './math' // rename import`
import * as Math from './math'          // namespaced import
import math from './math'               // default import

export { Random }
export default Math
export { Random } from './math'     // reexport
export { Random as rand } from './math'     // reexport with renaming
export * from './math'
```

To set exports object as a whole, `export =` and `import =` must be used in pair. `export =` are not compatible with other export statements (including default export), since it specifies exported objects as a whole, other export statements are meaningless used with it.

```ts
// test.ts
export = 'Test'

//
imports Test = required('./test')


// TODO: write the process of resolving import and export statements, modules
// not compatible 模块“{0}”解析为非模块实体，且不能使用此构造导入。
// import * as Math from './math'
// export = { PlusOne }
```

When imported object are used only in type assertions, typescript uses only type information of export object and no `required()` statement will be generated for module. So target module are not loaded actually, otherwise, modules will be loaded. This is called optional module loading. To use type information only of import object, use `typeof` operator.
