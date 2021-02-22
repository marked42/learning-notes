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

JSX 语法可能对应原生（intrinsic elements）和自定义组件两种情况，分别对应不同的类型。

1. 小写字母开头的 JSX 标签对应原生元素，被编译成`React.createElement("div")`，对应 HTML 原生的标签。
1. 大写字母开头的 JSX 标签对应自定义组件，被编译成`React.createElement(Component)`，对应自定义的组件（函数或者类）

### 原生元素

原生元素标签`<foo/>`对应`JSX.IntrinsicElements`接口中的属性`foo`，`<bar/>`没有对应没有对应属性会报错。

```tsx
declare namespace JSX {
  interface IntrinsicElements {
    foo: { bar?: boolean };
  }
}

<foo bar /> // ok
<bar /> // error
```

### 自定义组件

自定义组件可能对应一个函数或者类，这两种情况无法区分所以 TS 会首先使用同名函数进行解析，不成功再使用同名类进行解析，两种情况都没有的话报错。

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

类组件要求类的实例类型（instance type）必须是`JSX.ElementClass`的子类型。

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
<NotAValidFactoryFunction /> // error
```

### 属性检查

`JSX.ElementAttributesProperty`

`JSX.IntrinsicAttributes`

`JSX.IntrinsicClassAttributes<T>`

JSX 标签上的属性值类型检查需要满足几个层次的约束。

1. 原生元素的属性满足`JSX.IntrinsicElements.prop`类型约束
1. 所有 JSX 标签都需要的属性类型（例如`key`）定义在接口中
   `JSX.IntrinsicAttributes` 。

### 子节点类型检查

`JSX.ElementChildrenAttribute`

## React

```tsx
FunctionComponent<P>

```
