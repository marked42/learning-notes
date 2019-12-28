# Typescript

## terminology

Ambient

> We call declarations that don’t define an implementation “ambient”.

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

## 声明合并

Typescript中每个声明会在命名空间、类型、值三个范围内创建实体。

| Declaration Type | Namespace | Type  | Value |
| ---------------- | :-------: | :---: | :---: |
| Namespace        |     x     |       |   x   |
| Class            |           |   x   |   x   |
| Enum             |           |   x   |   x   |
| Interface        |           |   x   |       |
| Type Alias       |           |   x   |       |
| Function         |           |       |   x   |
| Variable         |           |       |   x   |

### 接口合并

同一个名称的接口在一个模块中可以有多处定义，最终会被合成一个接口定义。同一个对象属性名称可以有多处定义，但是类型必须都相同。同名的函数允许有多个，被视为同一个函数的不同重载类型。靠后的接口定义优先级更高，在合并的接口中**整体**排在前边。唯一的特殊情况是接口的多个重载函数中，如果函数中有参数是某个字符串字面量类型，该函数定义排在最前边。

### 命名空间合并

同名的命名多处定义也会合并，靠后的命名空间优先级更高，合并后位于靠前的位置，但是这只针对导出的命名空间对象，未导出的对象还是只在声明所在的命名空间内可见。

### 命名空间与类、函数、枚举合并

命名空间和类、函数、枚举都声明了一个值，编译到JS对应一个普通的对象，所以命名空间可以和同名类、函数、枚举合并。但是命名空间不能与普通变量合并，因为编译出的结果不兼容。命名空间编译成一个普通对象会被添加声明的属性，但是如果同时作为一个变量则可以随意赋值，破坏了命名空间包含的属性。同理类、函数、枚举也不能合并，因为一个普通变量只能是其中一种类型而不可能同时成立。

## 枚举

### 数字与字符串枚举

枚举值可以是数字或者字符串，数字类型的枚举适用于区分若干个不同类型，但并不关心具体具体值；字符串枚举在需要查看枚举值的时候使用，通常使用说明性的文字内容作为枚举值。数字枚举和字符串枚举类型允许混合使用，但是除非必须通常不要混合使用数字和字符串类型枚举。

如果枚举值没有指定初始值的话必须是第一个枚举或者前面跟了一个有初始值的数字枚举，数字枚举值根据之前的值递增决定。字符串类型没有明确的递增规则所以必须显示指定初始值。枚举值在编译期间就需要计算确定，因此只能使用数字或者字符串字面量或者常量表达式（由数字、字符串、其他枚举值组成）。

数字枚举和字符串枚举运行时行为稍有差异，数字枚举编译时有反向映射，即从枚举值（数字）到枚举名称（字符串）的映射，字符串枚举值没有反向映射。手动指定枚举值的话可能出现多个枚举的值相同的情况，编译器对此不做限制，但是使用时避免出现这种情况。多对一的正向映射其反向映射只有最后一个枚举值生效，这种不一致的情况可能造成误判。

枚举类型同时也可以作为命名空间使用，在同名的命名空间上声明枚举类型的静态函数，编译到js时枚举类型和命名空间都只是个普通的变量。

```ts
enum Direction {
  // 初始化为0
  Up,
  // 递增初始化为1
  Down,
  Left,

  // 手动指定为1，允许重复的枚举值，编译器对次不做检查
  Right = Down,
}

namespace Direction {
  export function isUp(direction: Direction): boolean {
    return direction === Direction.Up;
  }
}

// false
Direction[Direction.Down] === "Down";
// true
Direction[Direction.Down] === "Right";
// true
Direction[Direction.Right] === "Right";

// 编译的js
var Direction;
(function (Direction) {
    // 初始化为0
    Direction[Direction["Up"] = 0] = "Up";
    // 递增初始化为1
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    // 手动指定为1，允许重复的枚举值，编译器对次不做检查
    Direction[Direction["Right"] = 1] = "Right";
})(Direction || (Direction = {}));
(function (Direction) {
    function isUp(direction) {
        return direction === Direction.Up;
    }
    Direction.isUp = isUp;
})(Direction || (Direction = {}));
```

### 常量枚举

使用`const enum`语法声明常量枚举，常量枚举默认情况下不会编译生成对应的Javascript对象，所用使用到枚举值的地方被内联替换为常量值。使用命令行参数`--preserveConstEnums`可以指定为常量枚举编译生成对应的Javascript对象。

```ts
const enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right]
```

### 开放式枚举

一个模块中同一个枚举可以多处定义，只要这些定义不重复，同时多处定义只允许有最多有一个定义的第一个枚举值没初始化。和命名空间处理方法相同，为每处定义生成对应的Javascript代码，将所有枚举值聚合到一个普通Javascript对象上。通常在多个脚本文件（都属于全局模块）中使用开放式枚举，一个模块文件中也可如此使用，但是通常来说没有必要。

```ts
enum Color {
  Red,
  Green,
  Blue
}

enum Color {
  DarkRed = 3,
  DarkGreen,
  DarkBlue
}

// 对应js
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {}));
(function (Color) {
    Color[Color["DarkRed"] = 3] = "DarkRed";
    Color[Color["DarkGreen"] = 4] = "DarkGreen";
    Color[Color["DarkBlue"] = 5] = "DarkBlue";
})(Color || (Color = {}));
//# sourceMappingURL=enum.js.map
```

### 枚举类型信息

每个声明的枚举值同时是一个类型，而枚举类型是所有单个枚举值类型的联合类型（union type）。

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

直接枚举名称作为类型时实际上使用的是普通的Javascript对象类型（数字或者字符串），使用`typeof`关键字来明确使用其对应的枚举类型信息。

```ts
enum LogLevel {
    ERROR, WARN, INFO, DEBUG
}

/**
 * This is equivalent to:
 * type LogLevelStrings = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
 */
type LogLevelStrings = keyof typeof LogLevel;

function printImportant(key: LogLevelStrings, message: string) {
    const num = LogLevel[key];
    if (num <= LogLevel.WARN) {
       console.log('Log level key is: ', key);
       console.log('Log level value is: ', num);
       console.log('Log level message is: ', message);
    }
}
printImportant('ERROR', 'This is a message');
```

## 模块和命名空间

### 术语变化

模块（Module)和命名空间（namespace）在Typescript1.5之前叫做外部模块（External Module）和内部模块（Internal Module）。

```ts
// > ts 1.5
namespace X {}

// <= ts 1.5
module X {}
```

### 模块

[模块](https://www.typescriptlang.org/docs/handbook/modules.html)用来将一组变量、函数、类和接口等**聚合**且**封闭**在一个作用域内，从而不与其他模块冲突。ts将一个具有顶层`import`/`export`语句的代码文件认为是一个模块，否则该文件被认为是存在全局范围（global），文件内的所有对象可以在任何地方被引用。

模块内部使用`export`语句导出变量、函数、类、接口等定义，供其他模块使用。

```ts
// export declaration 声明语句前直接使用`export`导出：
export interface StringValidator {
    isAcceptable(s: string): boolean;
}

// export statements 单独的导出语句，可以重命名
export { Random }
export { Random as rand}

// reexport 对导入的模块中内容重新导出
export { Random } from './math'
export { Random as rand } from './math'
export * from './math'  // 一次性导出所有内容

// 默认导出，在模块只需要导出一个对象时使用
export default Math
```

使用`import`导入从其他模块中导入对象到当前模块。

```ts
// 导入一个对象
import { Random } from './math'
import { Random as rand } from './math'

// namespaced import 所有对象导入到一个命名空间下
import * as Math from './math'

// default import 默认导入，必须配合默认导出使用
import math from './math'

// 副作用导入，导入模块不引用任何模块中的对象，而是为了模块副作用生效
import './math'
```

#### import/export assignment

Common JS和AMD中使用`exports`对象进行导出，使用`exports = something`和`module.exports = something`对导出对象整体进行设置，效果和ES Module中的默认导出一致，但是这两种语法不相互兼容。ts提供了`export =`和`import = required()`语法来对应到Common JS和AMD的默认导出。

在编译选项`module`是`es6`时不能使用`export =`和`import = required()`语句，会报语法错误。

#### optional module loading

从模块中导入对象只在类型声明中使用的话，ts只使用了对象的类型信息，这时模块不会被真的导入，也不会生成对应的导入语句。

#### Ambient Module

为了给使用js编写的库提供类型信息，可以用`declare module`语法声明模块中对象的类型信息，每个模块的类型定义信息通常定义于`.d.ts`文件。使用`/// <reference path="node.d.ts"/>`（Triple Slash）引用`.d.ts`文件即可在当前文件中引入该模块的类型定义信息。

只声明模块而不包含任何类型声明时，从该模块引入的任何对象类型都是`any`。

```ts
// Shorthand Ambient modules
declare module "hot-new-module";
```

模块名称可以包含**通配符**，用来对一类（前缀或者后缀限定）的文件提供类型声明。例如`.jpg`文件被导入时，是一个有`src`属性的对象。

```ts
declare module '*.jpg' {
  const src: string;
  export default src;
}
```

UMD模块既可以当成全局使用，也可以作为模块使用，但二者能同时成立。模块定义如下：

```ts
export function isPrime(x: number): boolean;
export as namespace mathLib;
```

在另一个模块文件中使用

```ts
import { isPrime } from "math-lib";
isPrime(2);

// 错误：模块内不能使用全局定义
mathLib.isPrime(2);
```

在全局环境（不包含`import`/`export`的js文件）只能使用全局定义。

```js
mathLib.isPrime(2);
```

### 模块解析

相对路径模块

1. `/`、`./`、`../`开头的模块名称，不会解析成ambient module declaration
1. 绝对路径模块会已`baseUrl`或者路径映射（path mapping）的方式解析，可以解析成ambient module declaration

Typescript模块解析和Node.js保持一致，区别在于

1. 搜索文件.ts/.tsx/.d.ts，
1. 在`package.json`文件中由`types`字段指定模块主文件位置。
1. 另外增加node_modules文件夹下的@types文件夹搜索
1. baseUrl: 命令行参数或者`tsconfig.json`文件指定的一个相对或者绝对路径
1. path mapping配置

```json
{
  "compilerOptions": {
    "baseUrl": ".", // This must be specified if "paths" is.
    "paths": {
      "jquery": ["node_modules/jquery/dist/jquery"] // This mapping is relative to "baseUrl"
    }
  }
}
```

使用--traceResolution参数显示模块解析过程。

### 命名空间

[命名空间](https://www.typescriptlang.org/docs/handbook/namespaces.html)用来将逻辑上相关的一组变量、类、接口等聚合在一起，放到同一个命名空间下。命名空间内的变量通常只在该命名空间下可见，在外部使用同样要用`export`进行导出。

命名空间通常在**全局模块**下使用，可以位于同一个源文件也可以分散在多个源文件中，文件之间的依赖关系使用Triple Slash引用表示。默认情况下ts会为属于同一个命名空间的多个.ts文件生成对应一一对应的.js文件，由于.ts文件之间存在依赖关系，所以在.html文件中引入多个.js文件时需要将被依赖的文件放在前面。通过`--outFile`参数可以指定将结果输出到一个js文件中。

命名空间被编译成一个普通的js对象，该对象上的属性对应了命名空间中导出的类、变量、函数。命名空间实际上就是一个普通的Javascript全局对象。

在一个模块文件中使用的命名空间不会突破模块的范围，因此跨多个模块的同名命名空间是独立的，不会被自动合并在一起。但是在一个模块文件内多个位置使用相同的命名空间，这些不同的定义是会被合并在一起的。因为模块本身有命名空间所具有的封装的作用，所以模块内部通常不使用命名空间。在模块功能较多需要隔离的时候更倾向拆分为多个模块而不是使用命名空间。

只有在**全局模块**下才使用命名空间进行隔离，因为全局空间不对应具体的某个文件，这时只能使用命名空间而没法使用模块。

典型的在模块文件中使用命名空间的错误做法：

```ts
// 在一个模块文件中将所有内容包含在一个命名空间中，模块本身有一层封装，命名空间Foo又添加了一层（重复且无用）
export namespace Foo {}

// 多个模块文件中，命名空间Foo不会被合并
export namespace Foo {}
```

命名空间可以方便的为一些暴露**全局对象**的三方库添加类型定义，例如D3。

```ts
declare namespace D3 {
    export interface Selectors {
        select: {
            (selector: string): Selection;
            (element: EventTarget): Selection;
        };
    }

    export interface Event {
        x: number;
        y: number;
    }

    export interface Base extends Selectors {
        event: Event;
    }
}

declare var d3: D3.Base;
```

### 别名

别名（alias）使用`import q = x.y.z`可以为命名空间或者模块中导出的对象起一个别名，方便使用。

## 编译环境

### 默认全局环境

Typescript编译环境默认都带有一个`lib.d.ts`文件，其中定了常见的浏览器宿主环境和Javascript规定的API的类型定义，默认使用这个定义文件为全局环境提供常见的定义信息。如果想要细粒度控制全局环境中的类型信息可以使用`--noLib`命令行参数或者在tsconfig.json的`lib: false`配置来禁用`lib.d.ts`文件。使用`--lib`参数或者配置文件编译选项`lib: string[]`来指定具体使用的全局API定义，Typescript中默认包含了很多预先定义好的类型定义文件。

```bash
tsc --target es5 --lib dom,es6
```

或者

```json
"compilerOptions": {
    "lib": ["dom", "es6"]
}
```

可用的类型定义文件大致如下：

1. JavaScript 功能
    - es5
    - es6
    - es2015
    - es7
    - es2016
    - es2017
    - esnext
1. 运行环境
    - dom
    - dom.iterable
    - webworker
    - scripthost
1. ESNext 功能选项
    - es2015.core
    - es2015.collection
    - es2015.generator
    - es2015.iterable
    - es2015.promise
    - es2015.proxy
    - es2015.reflect
    - es2015.symbol
    - es2015.symbol.wellknown
    - es2016.array.include
    - es2017.object
    - es2017.sharedmemory
    - esnext.asynciterable

注意使用较新的API时Typescript只提供了类型定义信息，相关Polyfill要另外引入，否则无法使用。

### 三方库全局环境

寻找一个[三方库全局环境的类型定义](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#types-typeroots-and-types)时首先会去库本身的目录`./node_modules/lib-name`下去查找自带的类型定义文件，即`.ts`、`.tsx`、`d.ts`或者`package.json`的`types`字段指定的文件。对于Javascript实现的不带有类型定义文件的库，社区项目Definitely Typed为大多数库提供了定义文件，这些文件位于`./node_modules/@types`文件夹下。使用如下命令为JQuery安装类型定义文件：

```bash
npm install @types/jquery --save-dev
```

库类型文件查找的过程是从当前目录向上直到项目根目录，在每个目录下查找`./node_modules/@types/lib-name`目录对应库`lib-name`的类型定义。其中项目所在目录名称@types可用typeRoots选项配置，要引入的库`lib-name`由`types`选项配置。

```json
{
   "compilerOptions": {
       // 类型定义库目标目录名，可以有多个，此字段不存在时默认使用 '@types'
       "typeRoots" : ["./typings"],

       // 要引入的类型定义库名称，此字段不存在时目录下所有库都会被引入
       // 需要精确控制库类型定义时使用此字段明确要引入的库类型定义，其他库不会引入，使用空数组完全禁用库类型自动引入
       "types" : ["node", "lodash", "express"]
   }
}
```

一个类型定义库目录可能是包含一个`index.d.ts`文件或者一个`package.json`文件其中`types`字段指定了类型定义文件名。
