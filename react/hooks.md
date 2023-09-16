# Hooks

1. [React Drag and Drop](https://www.robinwieruch.de/react-drag-and-drop/)

- [ ] [Managing State](https://react.dev/learn/managing-state)
- [ ] [Epic React Articles](https://epicreact.dev/articles/)
- [ ] [React as a UI Runtime](https://overreacted.io/react-as-a-ui-runtime/)
- [ ] [Writing Resilient Components](https://overreacted.io/writing-resilient-components/)
- [ ] [React Articles](https://www.robinwieruch.de/categories/react/1/)
- [ ] [React Josh](https://www.joshwcomeau.com/tutorials/react/)

## 入门 用法介绍

1. [Introducing Hooks](https://legacy.reactjs.org/docs/hooks-intro.html)
1. [Making Sense of React Hooks](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889)
1. [React Today and Tomorrow and 90% Cleaner React With Hooks](https://www.youtube.com/watch?v=dpw9EHDh2bM)

```js
function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      console.log(`You clicked ${count} times`)
    }, 3000)
  })

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}

export default Counter
```

## Render

函数式组件的状态 props, state, effects 每次渲染都是隔离的
each render has separate props, state, event handler

## Functional Component vs Class Component

1. [How Are Function Components Different from Classes?](https://overreacted.io/how-are-function-components-different-from-classes/)

## State Design

redundant state -> derived state

`checked`依赖但是独立于`columns`。

```jsx
const [columns, setColumns] = useState([
  {
    name: 'first',
    checked: true,
  },
  {
    name: 'second',
    checked: true,
  },
  {
    name: 'third',
    checked: false,
  },
])
const getCheckedColumns = () => {
  return columns.filter((c) => c.checked)
}
const checked = getCheckedColumns()
const [checkedColumns] = useState(checked)
```

1. state re-initialization
1. derived state vs state synchronization

[Kent](https://kentcdodds.com/blog)

1. [Before You Memo](https://overreacted.io/before-you-memo/)
1. [https://kentcdodds.com/blog/optimize-react-re-renders](https://kentcdodds.com/blog/optimize-react-re-renders)

1. [5 Tips to Help You Avoid React Hooks Pitfalls](https://kentcdodds.com/blog/react-hooks-pitfalls)

## Data Fetching

fetching / query change / loading indicator / error handling / cancel / reducer hook

1. [How to fetch data with React Hooks](https://www.robinwieruch.de/react-hooks-fetch-data/)

## Ref vs State

Ref 与 State 的区别，ref 只有一个，记录最新值。可以在之前的一次 Render 中的延迟回调函数访问最新的值，和 Class 组件行为一致。

1. [How Are Function Components Different from Classes?](https://overreacted.io/how-are-function-components-different-from-classes/)

```js
function Counter() {
  const [count, setCount] = useState(0)

  const latestCount = useRef(count)

  useEffect(() => {
    // Set the mutable latest value
    latestCount.current = count
    setTimeout(() => {
      // Read the mutable latest value
      console.log(`You clicked ${latestCount.current} times`)
    }, 3000)
  })

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}

export default Counter
```

## useMemo and useCallback

1. [When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback)
1. [Understanding useMemo and useCallback](https://www.joshwcomeau.com/react/usememo-and-usecallback/)

## Effects

in functional component, effects is delayed after render, so effects executed after first render, cleanup executed in after second render

副作用与依赖的三种情况

1. 没有任何依赖
1. 依赖任意 props/state
1. 指定依赖 `[]`

典型例子 missing deps 造成死循环

```js
function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [count])

  return <h1>{count}</h1>
}
```

从`setCount(count + 1)` 修改为`setCount(count => count + 1)`

```js
function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [count])

  return <h1>{count}</h1>
}
```

更复杂场景使用 reducer

1. [A Complete Guide to useEffect](https://overreacted.io/a-complete-guide-to-useeffect/)
1. [Using the effect Hook](https://legacy.reactjs.org/docs/hooks-effect.html#effects-with-cleanup)

### `useInterval`

[Making setInterval Declarative with React Hooks](https://overreacted.io/making-setinterval-declarative-with-react-hooks)

### Multiple instances of React

1. [Hooks + multiple instances of React #13991](https://github.com/facebook/react/issues/13991)

## transitive deps

依赖传播问题，函数作为数据流的一部分。

1. 将函数定义放到 effect 中，避免依赖传播 （函数作为依赖）
1. 将依赖提取为函数参数，使用纯函数定义
1. useCallback

## eslint-plugin-react-hook

1. [exhaustive-deps](https://github.com/facebook/react/issues/14920)

## hooks 最初设计

hooks 设计的背后理念

1. [RFC: React Hooks #68](https://github.com/reactjs/rfcs/pull/68#issuecomment-439314884)

## 内部原理

1. [React hooks: not magic, just arrays](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e)
1. [Why Do React Hooks Rely on Call Order?](https://overreacted.io/why-do-hooks-rely-on-call-order/)

1. [Why React Re-Renders](https://www.joshwcomeau.com/react/why-react-re-renders/)

## 源码

1. [ReactHooks.js](https://github.com/facebook/react/blob/ce43a8cd07c355647922480977b46713bd51883e/packages/react/src/ReactHooks.js)
1. [How Does React Tell a Class from a Function?](https://overreacted.io/how-does-react-tell-a-class-from-a-function/)
1. [How Does setState Know What to Do?](https://overreacted.io/how-does-setstate-know-what-to-do/)

## Concurrent

https://bytedance.feishu.cn/wiki/wikcnvnPX5QWWC5kePvdCeYxEke#dsA6uz

- [ ] [bind](https://benediktmeurer.de/2015/12/25/a-new-approach-to-function-prototype-bind/)
