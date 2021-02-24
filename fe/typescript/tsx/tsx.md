# JSX 与 Typescript

## TS 中使用 JSX

在 Typescript 中使用 JSX 语法，需要满足两个条件，使用`.tsx`文件并且开启`--jsx`选项（通过命令行参数或者`.tsconfig`中`compilerOptions.jsx`配置）。

| 选项           | 输入     | 输入                                              | 文件后缀 |
| -------------- | -------- | ------------------------------------------------- | -------- |
| `preserve`     | `<div/>` | `<div/>`                                          | .jsx     |
| `react`        | `<div/>` | `React.createElement('div')`                      | .js      |
| `react-native` | `<div/>` | `<div/>`                                          | .js      |
| `react-jsx`    | `<div/>` | `_jsx("div", {}, void 0);`                        | .js      |
| `react-jsxdev` | `<div/>` | `_jsxDEV("div", {}, void 0, false, {...}, this);` | .js      |

其中`react-jsx`和`react-jsxdev`是[TS 4.1](https://devblogs.microsoft.com/typescript/announcing-typescript-4-1/#react-17-jsx-factories)开始引入的新选项，为了支持 React 17 中[新的 JSX 转换](https://zh-hans.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)。

假设源码如下：

```jsx
import React from 'react'

function App() {
  return <h1>Hello World</h1>
}
```

旧的选项`react`将 JSX 语法转换为`React.createElement`，但是 React 库需要手动引入，否则无法使用。ESLint 的插件`eslint-plugin-react`中的有对应的两条规则。

1. `react/react-in-jsx-scope` [防止没有引入 React](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md)
1. `react/jsx-uses-react` [防止将引入的 React 标记为未使用](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-uses-react.md)

新的 JSX 转换有两个出发点，[性能优化](https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md#motivation)和自动引入 React，转换后的代码如下。

```js
// 由编译器引入（禁止自己引入！）
import { jsx as _jsx } from 'react/jsx-runtime'

function App() {
  return _jsx('h1', { children: 'Hello world' })
}
```

## 类型检查

JSX 语法可能对应原生（intrinsic elements）和自定义组件[两种情况](https://reactjs.org/docs/jsx-in-depth.html#html-tags-vs.-react-components)，分别对应不同的类型。

1. 小写字母开头的 JSX 标签对应原生元素，被编译成`React.createElement("div")`，对应 HTML 原生的标签。
1. 大写字母开头的 JSX 标签对应自定义组件，被编译成`React.createElement(Component)`，对应自定义的组件（函数或者类）

### 原生元素

原生元素标签`<foo/>`对应`JSX.IntrinsicElements`接口进行类型检查

#### 标签是否存在

在`JSX.IntrinsicElements`接口中没有对应属性名的标签会报错，`<bar/>`没有对应没有对应属性会报错。

```tsx
declare namespace JSX {
  interface IntrinsicElements {
    foo: any;
  }
}

// 正确
<foo bar/>
// 错误
<bar />
```

#### 属性类型

原生元素标签的属性必须与`JSX.IntrinsicElements`接口中对应属性类型一致。

```tsx
declare namespace JSX {
  interface IntrinsicElements {
    foo: { exist: boolean, name: string };

    bar: { exist?: boolean, name: string };
  }
}

// 正确
<foo name={"tom"} exist/>
<foo name={"tom"} exist={true}/>
<foo name={"tom"} exist={false}/>
// exist不能省略
<foo name={"tom"} />

// 属性名必须是合法的标识符
<foo some-unknown-prop />; // ok, because 'some-unknown-prop' is not a valid identifier

// exist是可选属性时可以省略，此时exist: boolean | undefined
<bar name={"tom"} />
```

### JSX 标签类型

如果不存在接口`JSX.Element`声明时，JSX 标签的类型被推导为`any`。

```tsx
declare namespace JSX {
  interface IntrinsicElements {
    foo: any
  }
}

// any
let v = <foo bar />
```

如果存在`JSX.Element`接口声明，所有 JSX 标签类型被推导为`JSX.Element`，`JSX.Element`只作为一个站位类型使用，其本身声明的具体内容并不重要，通常声明为空接口即可。

```tsx
declare namespace JSX {
  interface Element {}
  interface IntrinsicElements {
    foo: any
  }
}

let v: JSX.Element = <foo bar />
```

`JSX.Element`声明为泛型接口没有意义，而且原生元素标签、函数组件标签、类标签的类型都是`JSX.Element`，并且无法相互区分。

### 自定义组件

自定义组件可能对应一个函数或者类，这两种情况无法区分所以 TS 会首先使用同名函数进行解析，不成功再使用同名类进行解析，两种情况都没有的话报错。

### 函数组件

函数组件被定义为返回类型必须是`JSX.Element`的子类型。函数组件定义就是普通的函数，因此重载等所有函数的功能都适用。

```tsx
type FunctionComponent<R extends JSX.Element> = (props: any, context: any) => R

interface ClickableProps {
  children: JSX.Element[] | JSX.Element
}

interface HomeProps extends ClickableProps {
  home: JSX.Element
}

interface SideProps extends ClickableProps {
  side: JSX.Element | string
}

function MainButton(prop: HomeProps): JSX.Element
function MainButton(prop: SideProps): JSX.Element
function MainButton(prop: ClickableProps): JSX.Element {}
```

#### 属性类型

函数组件的属性类型是两个类型的联合类型。

1. 函数第一个参数的类型
1. `JSX.IntrinsicAttributes`接口。

```ts
declare global {
  namespace JSX {
    interface Element {}

    interface IntrinsicAttributes {
      key?: number
    }

    interface IntrinsicElements {
      div: any
    }
  }
}

function MyFactoryFunction(props: { foo: number; bar: string }) {
  return <div />
}

// 正确
let a1 = <MyFactoryFunction foo={1} bar={'1'} key={1} />
// 正确 key可选
let a2 = <MyFactoryFunction foo={1} bar={'1'} />

// 错误 bar是string类型，传入类数字类型
let a2 = <MyFactoryFunction foo={1} bar={1} key={1} />
// 错误 foo属性缺失
let a2 = <MyFactoryFunction bar="1" key={1} />

export {}
```

### 类组件

类的定义有两个相关的类型，类实例类型（element instance type）和类静态类型（element class type）。

类实例类型是类所有构造函数返回类型的联合类型（union type）。

类组件要求类实例类型（element instance type）必须是`JSX.ElementClass`的子类型，`JSX.ElementClass`默认是`{}`，但是可以用来对类实例类型加强约束，例如要求所有类实例必须有`render`函数。

```tsx
declare namespace JSX {
  interface ElementClass {
    render: any
  }
}

class MyComponent {
  render() {}
}
function MyFactoryFunction() {
  return { render: () => {} }
}

<MyComponent /> // ok
<MyFactoryFunction /> // ok

class NotAValidComponent {}
function NotAValidFactoryFunction() {
  return {}
}

<NotAValidComponent /> // error
// TODO: 这里并没有报错，ElementClass没有约束到函数组件
<NotAValidFactoryFunction /> // error
```

#### 属性类型

类组件的属性由是三个类型的联合类型。

1. 类定义时某个属性的类型， `JSX.ElementAttributesProperty`接口有且只能有一个属性`props`（可以是其他任何名称），类定义时的同名属性`props`的类型就是 JSX 标签属性类型。
1. `JSX.IntrinsicAttributes`
1. `JSX.IntrinsicClassAttributes<T>`，泛型参数`T`是类类型，在 React 中用来定义泛型属性`ref: Ref<T>`。

```ts
declare global {
  namespace JSX {
    interface ElementAttributesProperty {
      props: {}
    }

    // 函数组件和类组件共同
    interface IntrinsicAttributes {
      key: number
    }

    // 类组件独有
    interface IntrinsicClassAttributes<T> {
      ref: T
    }
  }
}

class MyComponent {
  props!: {
    name: string
  }
}

let a = <MyComponent name={'test'} key={1} ref={new MyComponent()} />

export {}
```

对于函数组件标签、类组件标签通用的属性类型，例如`key`字段，使用接口声明`JSX.IntrinsicAttributes`，通常这个接口中的属性被声明为可选。`IntrinsicAttributes`只针对函数组件和类组件，对原生元素不生效。

### 子节点类型

对于原生元素、函数组件、类组件来说，允许的子节点类型检查方式相同。`JSX.ElementChildrenAttribute`接口能且只能声明一个属性，标签属性类型中这个预定义属性的类型就是子节点需要满足的类型约束。

原生元素的例子

```ts
declare global {
  namespace JSX {
    interface Element {}

    interface ElementChildrenAttribute {
      children: any
    }

    interface IntrinsicElements {
      div: {
        children: Element | number | string | Array<string | number | Element>
      }
    }
  }
}

// 子类型 字符串
let a1 = <div>1</div>
// 子类型 数字
let a2 = <div>{1}</div>
// 子类型 Element
let a3 = (
  <div>
    <div>1</div>
  </div>
)
// 允许多个子类型 对应 children: Array<string | number | Element>
let a4 = (
  <div>
    {1}1<div>1</div>
  </div>
)

export {}
```

类组件的例子

```ts
import React from 'react'

declare global {
  namespace JSX {
    interface Element {}

    interface ElementAttributesProperty {
      props: {}
    }

    // 对原生元素无效，只对函数组件和类组件有效
    interface ElementChildrenAttribute {
      children: {}
    }

    interface IntrinsicElements {
      [key: string]: any
    }
  }
}

interface PropsType {
  children: JSX.Element
  name: string
}

class Component extends React.Component<PropsType, {}> {
  render() {
    return <h2>{this.props.children}</h2>
  }
}
// OK
let a = (
  <Component name="foo">
    <h1>Hello World</h1>
  </Component>
)

// Error: children is of type JSX.Element not array of JSX.Element
let b = (
  <Component name="bar">
    <h1>Hello World</h1>
    <h2>Hello World</h2>
  </Component>
)

// Error: children is of type JSX.Element not array of JSX.Element or string.
let c = (
  <Component name="baz">
    <h1>Hello</h1>
    World
  </Component>
)

export {}
```

## 配置 JSX

### jsxFactory

使用命令行或者配置文件中`jsxFactory`字段配置创建组件的函数，默认是`React.createElement`。或者使用文件级别的配置指令。

```ts
/** @jsx h */
```

源码如下

```ts
import { h } from 'preact'
const HelloWorld = () => <div>Hello</div>
```

会被转换为

```ts
'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const preact_1 = require('preact')
const HelloWorld = () => preact_1.h('div', null, 'Hello')
```

注意配置`jsxFactory: Name`之后，TS 使用`Name.JSX`命名空间下接口进行 JSX 类型检查，不再使用默认的命名空间`JSX`。

### jsxFragmentFactory

配置 Fragment 标签使用的名称

```ts
/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment } from 'preact'
const HelloWorld = () => (
  <>
    <div>Hello</div>
  </>
)
```

转换为

```ts
'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const preact_1 = require('preact')
const HelloWorld = () =>
  preact_1.h(preact_1.Fragment, null, preact_1.h('div', null, 'Hello'))
```

### jsxImportSource

`jsx`选项使用`react-jsx`和`react-jsxdev`情况下，`jsxImportSource`配置运行时变量`jsx`和`jsxdev`导入的包名称。

```ts
/** @jsxImportSource preact */
function App() {
  return <h1>Hello World</h1>
}
```

转换为

```ts
'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.App = void 0
// 指定preact为导入包名
const jsx_runtime_1 = require('preact/jsx-runtime')
function App() {
  return jsx_runtime_1.jsx('h1', { children: 'Hello World' }, void 0)
}
exports.App = App
```

## React

[React Typings](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts)

## Babel

Babel 使用插件[@babel/plugin-syntax-jsx](https://babeljs.io/docs/en/babel-plugin-syntax-jsx.html) 识别 JSX 语法，但是本身不做任何转换，JSX 语法转换到普通 JS 语法需要依靠其他插件实现。

## Vue

### JSX 语法支持

Vue2.0 JSX 在 Babel7.x 以前的版本使用 [babel-plugin-transform-vue-jsx](https://github.com/vuejs/babel-plugin-transform-vue-jsx/blob/master/package.json)。Vue2.0 JSX 在 Babel7.x 的版本开始使用[@vue/babel-preset-jsx](https://github.com/vuejs/jsx)，该预设（preset）使用插件[@vue/babel-plugin-transform-vue-jsx](https://github.com/vuejs/jsx/tree/dev/packages/babel-plugin-transform-vue-jsx) 识别 JSX 语法并将其转换为 vue 的`h`函数，另外有若干个插件分别支持特定的语法糖转换，由以下选项配控制。

```ts
// babel.config.js
module.exports = {
  presets: [
    [
      '@vue/babel-preset-jsx',
      {
        // 双向绑定语法转换
        vModel: false,
        // 事件监听语法转换
        vOn: false,
        // 包含 JSX 标签的对象或类方法自动注入 const h = this.$createElement
        injectH: false,
        // 函数转换成 Vue函数组件
        functional: false,
        compositionAPI: false,
      },
    ],
  ],
}
```

注意几个语法糖插件先进行转换，最后由插件`@vue/babel-plugin-transform-vue-jsx`进行 JSX 到普通 JS 的转换。

另外 Vue JSX [属性合并](https://zhuanlan.zhihu.com/p/59434351)依赖库[@vue/babel-helper-vue-jsx-merge-props](https://github.com/vuejs/jsx/tree/dev/packages/babel-helper-vue-jsx-merge-props)，需要单独安装。

### TSX 类型支持

使用库`vue-tsx-support`为 Vue 提供 TSX 类型支持，安装`npm i -D vue-tsx-support`后需要进行配置。

1. 在`tsconfig.json`中配置`jsx`为`preserve`，TS 只做类型检查。
1. `jsxFactory`为`VueTsxSupport`，使用`VueTsxSupport.JSX`中接口进行类型检查。
1. 引入包含`VueTsxSupport.JSX`的类型声明文件`node_modules/vue-tsx-support/enable-check.d.ts`，在`files`字段添加这个文件，或者在源码的入口文件引入此文件。注意不要用`include`字段引入此文件，否则会被`exclude`字段排除。`exclude`默认排除`node_modules`文件夹下的文件，`files`引入的文件不会被`exclude`排除。

具体用法参考[文档](https://github.com/wonderful-panda/vue-tsx-support#writing-component-by-class-style-api-vue-class-component-andor-vue-property-decorator)。
