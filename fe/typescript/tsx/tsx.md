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

#### 子节点类型

子节点类型使用标签声明的属性类型中一个特殊名称的属性的类型， `JSX.ElementChildrenAttribute`接口只能声明一个属性，这个属性的名称就是子类型的名称。

```ts
declare global {
  namespace JSX {
    interface Element {
      test: any
    }

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

函数组件的属性类型由函数第一个参数的类型决定

```ts
declare global {
  namespace JSX {
    interface Element {}

    interface IntrinsicElements {
      div: any
    }
  }
}

function MyFactoryFunction(props: { foo: number; bar: string }) {
  return <div />
}

// 错误，bar是string类型，传入类数字类型
let a = <MyFactoryFunction foo={1} bar={1} />

export {}
```

#### 子类型

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

#### 属性检查

类组件标签属性类型取决于类定义时某个属性的类型， `JSX.ElementAttributesProperty`接口有且只能有一个属性`props`，类定义的同名属性的类型就是类组件的属性类型。

```ts
declare namespace JSX {
  interface ElementAttributesProperty {
    props // specify the property name to use
  }
}
class MyComponent {
  // specify the property on the element instance type
  props: {
    foo?: string
  }
}

// element attributes type for 'MyComponent' is '{foo?: string}'
;<MyComponent foo="bar" />
```

// TODO:
`JSX.IntrinsicClassAttributes<T>`

#### 子节点类型检查

子节点类型使用标签声明的属性类型中一个特殊名称的属性的类型， `JSX.ElementChildrenAttribute`接口只能声明一个属性，这个属性的名称就是子类型的名称。

```ts
import React from 'react'

declare global {
  namespace JSX {
    interface Element {}

    interface ElementAttributesProperty {
      props: {}
      // test1: number;
    }

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

### 通用属性

对于原生元素标签、函数组件标签、类组件标签通用的属性类型，例如`key`字段，使用接口声明`JSX.IntrinsicAttributes`，通常这个接口中的属性被声明为可选。

TODO: `IntrinsicAttributes`对原生元素不生效？

```ts
declare global {
  namespace JSX {
    interface Element {}

    interface IntrinsicAttributes {
      key: number
    }

    interface IntrinsicElements {
      div: { name?: string }
    }
  }
}

function MyFactoryFunction(props: { foo: number; bar?: string }) {
  return <div />
}

let a = <MyFactoryFunction foo={1} key={1} />
// error

let a1 = <div key={'1'}></div>
let a2 = <div key={1}></div>

export {}
```

## 配置 JSX
