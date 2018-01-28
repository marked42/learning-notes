# React

- [React](#react)
    - [`setState()`](#setstate)
        - [Shallow State Merge](#shallow-state-merge)
        - [Batched State Change](#batched-state-change)
    - [`React.Children`](#reactchildren)
        - [Counting Children](#counting-children)
        - [Looping over Children](#looping-over-children)
        - [Convert Children to Array](#convert-children-to-array)
        - [Single Child](#single-child)
        - [Editing Children](#editing-children)
    - [Performance Optimization](#performance-optimization)
        - [Anti Patterns](#anti-patterns)
        - [Tools](#tools)
            - [Chrome DevTools](#chrome-devtools)
            - [why-did-you-update](#why-did-you-update)
            - [React Developer Tools for Chrome](#react-developer-tools-for-chrome)
    - [Patterns](#patterns)
        - [Pass Down Props](#pass-down-props)
        - [Conditional Rendering](#conditional-rendering)
        - [Container Components](#container-components)
        - [Render Callback and Render Props Pattern](#render-callback-and-render-props-pattern)
        - [Context and Provider Pattern](#context-and-provider-pattern)

## `setState()`

### Shallow State Merge

`setState(updater)` does a shallow merge with `this.state` and `updater`, avoid using deeply nested state which could cause unexpected behaviour.

Wrong Usage:

```javascript
state = { options: { type: 'All', format: 'json' } }

setState({ options: { type: 'None' }})
// expected nextState: { options: { type: 'None' } }
// actual nextState:   { options: { type: 'None', format: 'json'} }
```

Correct Usage:

```javascript
state = { type: 'All', format: 'json' }

setState({ type: 'None' })
// nextState is { type: 'None', format: 'json' }
```

### Batched State Change

Core philosophy of React is that UI depends on state. `this.state` corresponds to `state`, function `f` is what React library is about: it provides a mapping from `state` to `UI`. Once state of a React component is set, React maps `state` to `UI` and re-renders the UI automatically.

```math
UI = f(state)
```

We can access state by `this.state` directly, however we should **not** change state directly with `this.state = newState` because state change is designed to be batched for performance consideration. What's important is to drive UI to update on state change, so changing state solely without triggering UI update makes no sense and this is what manipulating state directly (`this.state = newState`) does for us.

It would be perfect for us if UI updates instantly on every single state change without degrading performance. But that's not gonna work in real world cause UI updates, aka DOM changes, are expensive. Core part of React is virtual DOM and diffing algorithm which is used to reduce DOM changes as less as possible to avoid poor performance.

In considerations of problems above, `setState()` is designed to batch multiple state changes and apply resulting state once in proper time. Then it triggers UI updates on actual state change. It's possible for React designers to place logics of triggering UI updates inside setters of `this.state`. But a seemingly innocent object property assignement `this.state = newState` actually causes UI updates would be a brain-damaged design both for developers and users.

There's another consideration on batched state change. We can design `setState()` to change `this.state` instantly and it's natural that multiple `setState()` calls will update state in an accumulative way. Then UI is triggered to update by last `setState()` call properly according to accumulatively changed state. But this design has two drawbacks.

1. There exists a short period of time that UI and state are inconsistent with each other until component finishes re-rendering.
1. User may want to compare between previous state and next state for some purposes. Previous state is lost after first `setState()` call in this solution.

So the final solution used by React is to keep `this.state` unchanged between UI updates and batch multiple state changes. Then in proper time when UI needs to be updated, next state is calculated from unchanged `this.state` and multiple batched state changes. Both `this.state` and calculated next state is provided as argument in component lifecycle methods for user to access.

- `shouldComponentUpdate(nextProps, nextState)`
- `componentWillUpdate(nextProps, nextState)`
- `componentDidUpdate(nextProps, nextState)`

After all this discussion, it won't surprise us that 3 `setState()` calls in example below increment `this.state.count` by 1 rather than 3. Because every `setState()` call set `this.state.count` to same value `unchangedCount + 1`, and 3 batched `this.setState({count: unchangedCount + 1})` calls give us the same result as single one. By the way, it's the same notion as HTTP _idempotant_ method in this case.

```js
function incrementMultiple() {
  this.setState({count: this.state.count + 1});
  this.setState({count: this.state.count + 1});
  this.setState({count: this.state.count + 1});
}

// equivalent to this
function incrementMultiple() {
  const unchnagedCount = this.state.count
  this.setState({count: unchnagedCount + 1});
  this.setState({count: unchnagedCount + 1});
  this.setState({count: unchnagedCount + 1});
}
```

Use multiple `setState()` calls that changes differnt part of state, you can notice that they're actually batched up.

```js
// batched state change result:
// { firstName: 'Morgan', lastName: 'Cheng' }
function setUserFullName() {
  this.setState({firstName: 'Morgan'})
  this.setState({LastName: 'Cheng'});
}
```

Besides the normal usage that `setState(updater)` accepts a single `updater` object, it actually accepts an optional callback function as second argument, which will be executed once `setState` is completed and the component is re-rendered. But it's recommended by official documentation to use lifecycle method `componentDidMount()` instead of this calllback function. Try **not** to change state inside callback function cause its effect on state is uncertain.

```js
setState(updater: object, callback?: () => void)
```

`setState` also accpets a function as first argument like below.

```js
setState(updater: (prevState, props) => stateChange, callback?: () => void)
```

`updater` function accepts accumulatively changed state which is the result of preivous `setState()` calls as first argument `prevState`. This ensures every state change happens on the result of previous state changes.This is actually a typical usage of _thunk_ function.

A naive code for demonstration would be like below.
It batched state changes that happens within the duration of first `setState()` call and `batchedStateChangeLimit` milliseconds later. This time restriction is not exactly same as actual situation due to inherent limitation of JavaScript timer function.

```js
function setState(updater, callback) {
  if (this._updaters === null ||
    this._updaters === undefined) {
      this._updaters = []
    }
  this._updaters.push(updater)

  if (this._updateTimer === undefined) {
    const batchedStateChangeLimit = 100
    this._updateTimer = setTimeout(() => {
      // calculate next state
      const nextState = this._updaters.reduce(
        (prevState, updater) => {
          // handle function updater
          if (typeof updater === 'function') {
            return updater(prevState, this.props)
          }

          // handle object updater
          // shallow merges this.state and updater object
          return shallowMerge(this.state, updater)
        },
        // this.state is inital object for all updaters
        this.state
      )

      // trigger component update and provide this.state and 
      // nextState as arguments to component lifecycle methods
      // callback is not processed here

      // after state changes are applied, clear timer and
      // preivous updaters to prepare for another round
      this._updateTimer = undefined
      this._updaters = []
    }, batchedStateChangeLimit)
  }
}
```

Key points to take away is:

1. At the first `setState()` call, a timeout callback is set to ensure state change will be applied with a maximum delay of `batchedStateChangeLimit` milliseconds.
1. First and following updaters are stored internally.
1. When state changes are finally applied, `nextState` is calculated from `this.state` and stored updaters of either function or object type. Then `this.state` and `nextState` is provided as arguments of component lifecycle methods.
1. After component is updated, clear internally recorded updaters and timers to start another round.

Consider this example of mixed usage of object updaters and function updaters below. It would be clear that `this.state.count` will be incremented by 2 instead of 4.

```js
function incrementMultiple() {
  const count = this.state.count

  // nextState.count = count + 1
  this.setState(increment);

  // nextState.count = count + 2
  this.setState(increment);

  // nextState.count = count + 1
  this.setState({count: .count + 1});

  // nextState.count = count + 2
  this.setState(increment);
}
```

References

1. [`setState()` API Reference](https://reactjs.org/docs/react-component.html#setstate)
1. [setState：这个API设计到底怎么样](https://zhuanlan.zhihu.com/p/25954470)
1. [setState何时同步更新状态](https://zhuanlan.zhihu.com/p/26069727)
1. [`setState()` Gate](https://medium.com/javascript-scene/setstate-gate-abc10a9b2d82#.ftefj7nn2)

## `React.Children`

`React.Children` helper functions provides us a way to handle children of any type, such as array, function, object etc, wherease `this.props.children` is quite limited in usage.

### Counting Children

Component `ChildrenCounter` displays number of its children.

```js
class ChildrenCounter extends React.Component {
  render() {
    return <p>React.Children.count(this.props.children)</p>
  }
}
```

`React.Children.count` returns correct number of children all the time. On the contrary, if childen is of string, `this.props.children.length` returns string length instead of child number.

### Looping over Children

Likely, `React.Children.map` and `React.Children.forEach` provides similiar functions like `Array.prototype.map` and `Array.prototype.forEach` and they apply to children of any type.

### Convert Children to Array

Likely, converts children to array.

```js
class Sorts extends React.Component {
  render() {
    const children = React.Children.toArray(this.props.children)

    return <p>{children.sort().join(' ')}</p>
  }
}

<Sort>
  {'bananas'}{'oranges'}{'apples'}
</Sort>

// sorted result
apples bananas oranges
```

### Single Child

Use `React.Children.only()` to enforce a single child. It throws error if component has more than one child, otherwise it returns the single child correctly.

```js
import React from 'react'
import PropTypes from 'prop-types'

// Executioner receives a single children that is a function
class Executioner extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
  }

  render() {
    return React.Children.only(this.props.children)()
  }
}
```

### Editing Children

Since we have access to component children with `this.props.children` and react children helper functions, we can do some transformations to children according to our needs.

Consider this `RadioGroup` containing multiple `RadioButton` child components.

```js
render() {
  return (
    <RadioGroup>
      <RadioButton value='first'>first</RadioButton>
      <RadioButton value='second'>second</RadioButton>
      <RadioButton value='third'>third</RadioButton>
    </RadioGroup>
  )
}
```

There exists an issue that child `RadioButton` components need to be grouped together for mutual exclusiveness, which is the typical behaviour for radio button. We can achieve this by setting same `name` attribute value for all children manually. But that's tedious and error prone. `React.cloneElement()` comes in handy for us.

```js
class RadioGroup extends React.Component {
  renderChildrenInSameGroup = () =>
    React.Children.map(this.props.children, child =>
      // clone element from child then set new name prop
      React.cloneElement(child, {
        name: this.props.name,
      })
    )

  render() {
    return (
      <div className='group'>
        {this.renderChildrenInSameGroup()}
      </div>
    )
  }
}
```

## Performance Optimization

To implement a todo list, there're two components involved.

1. TodoItem - Represents single todo item.
1. TodoList - Todo list that wraps all todo items inside it.

```jsx
const TodoList = (items) => {
  return (
    <div>
      {items.map(({id, marked}) => (
        <TodoItem key={id} id={id} marked={marked} />
      )}
    </div>
  )
}

const markItem = id => ({ type: 'MARK', id})

export default connect(undefined, { markItem })(TodoList)
```

Naive redux store state for this todo app would be that all todo items stored in one array.

```json
{
  "todos": [
    { "id": "1", "marked": true },
    { "id": "2", "marked": true },
    { "id": "3", "marked": false }
  ]
}
```

In this case, `todosReducer` should be like below to handle `MARK` action.

```javascript
function todosReducer(state = initialState, action) {
  switch (action.type) {
    case "MARK":
      return state.map(
        item => action.id !== todo.id ? todo :
          { ...item, marked : action.marked}
      )
    default:
      return state
  }
}
```

When `marked` data for single todo item changes.

1. `TodoList` component receives new todo array returned by `todoReducer`, so `TodoList` component is rendered again.
1. When parent component `TodoList` is rendered again, it triggers all child `TodoItem` components to be rendered again.

However, other unchanged child `TodoItem` should not be rendered again. Uneccessary re-renders can be avoided with `shouldComponentUpdate()` or `React.PureComponent`.

```javascript
class Item extends Component {
  // Item is rendered again only when 'marked' prop changes
  shouldComponentUpdate(nextProps) {
    return this.props.marked !== nextProps.marked
  }
}

// PureComponent implements shouldComponentUpdate to render component
// again only when any component prop changes.
class Item extends React.PureComponent {
}
```

Actually, root cause of this problem is that we've mixed single todo item data with todo list data, which viloates the principle of **High Cohesion, Loose Coupling**. Data normalization is the solution for us.

```json
{
  "ids": [ "1", "2", "3" ],
  "items": {
    "1": { "marked": true },
    "2": { "marked": true },
    "3": { "marked": true }
  }
}
```

Todo list data and single todo item data is now separated with each other. Either one can change without affecting the other. New reducer is like this.

```javascript
function ids(state = [], action) {
  return state
}

function items(state = {}, action) {
  switch (action.type) {
    case 'MARK':
      const item = state[action.id]
      return {
        ...state,
        [action.id]: {...item, marked: !item.marked }
      }
    default:
      return state
  }
}
```

When single item changes.

1. `TodoList` component will not be rendered again cause its data doesn't change.
1. Only `TodoItem` whose data changes will be updated.

We don't even need to implement `shouldComponentUpdate()` for `TodoItem` in this case since `TodoList` doesn't change so it will not trigger unchanged child `TodoItem` components to render again. For other cases that changes data of `TodoList`, `shouldComponentUpdate()` is still needed to prevent unecessray re-renders.

### Anti Patterns

Do not use object literals or array literals for property since every time it's accessed, a new instance is generated which incurs component re-render.

```javascript
<RadioGroup options={this.props.options || []} />
```

Do not use in-place `bind` function or arrow function since new instance is generated each time. Prepare it beforehand.

```jsx
// eslint react/jsx-no-bind
<Button onClick={this.update.bind(this)} />
<Button onClick={() => { console.log("Click"); }} />
```

### Tools

#### Chrome DevTools

[Blog Post](https://building.calibreapp.com/debugging-react-performance-with-react-16-and-chrome-devtools-c90698a522ad)

> 1. Open your app and append the query param: `react_perf`. For example, `http://localhost:3000?react_perf`.
> 1. Open the Chrome DevTools Performance tab and press Record.
> 1. Perform the actions that you want to analyze.
> 1. Stop recording.
> 1. Inspect the visualization under User Timing.

#### why-did-you-update

1. Install with npm: `npm -i --save-dev why-did-you-update`.
1. Add this snippet anywhere in your app.
    ```javascript
    import React from 'react'
    if (process.env.NODE_ENV !== 'production') {
      const {whyDidYouUpdate} = require('why-did-you-update')
      whyDidYouUpdate(React)
    }
    ```

#### React Developer Tools for Chrome

## Patterns

### Pass Down Props

Use destructure to extract part of a object.

```javascript
const props = { a: 1, b: 2, c: 3}

// a = 1, others = { b: 2, c: 3}
const {a, ...others} = props
```

Extract part of component props and pass them down. It allows users to assign default props like 'id', 'className', 'htmlFor' etc... for html element to parent component, and child component could inherit assigned value from parent component. This pattern allows users to pass properties down to child component by setting parent component properties..

```javascript
import React, { Component } from "react"

const Select = ({ options, ...passedDownProps }) => (
  <select {...passedDownProps}>
    {options.map(option => (
      <option key={option.value} value={option.value}>
        {option.text}
      </option>
    ))}
  </select>
)

const Example = ({numbers, ...passedDownProps}) => {
  const props = { options: numbers, ...passedDownProps }

  return <Select {...props} />
}

const Root = () => {
  const props = {
    numbers: [{ value: 1, text: "I" }],
    className: "selector",
  };

  return <Example {...props}>
}
```

1. `Root` passes `{numbers, className}` to `Example`
1. `Example` uses `numbers` as `options` and passes `{options, className}` to `Select`.
1. `Select` uses `options` property to generate multiple option tags. other properties which is `className` in this case are extracted as `passedDownProps` and passed down to built-in html component `select`

Notice that passed-down properties should not clash with or overwrite other properties, that would cause unexpected behaviour.

```javascript
const Root = () => {
  const props = {
    numbers: [{ value: 1, text: "I" }],
    options: [{ value: 1, text: "First" }],
    className: "selector",
  };

  return <Example {...props}/>
}
```

1. `Root` passes property `options` to `Example`
1. `Exmaple` receives `numbers` and `passedDownProps = {options, className}`, this causes `options` of `passedDownProps` to overwrite `options` from `numbers`
    ```javascript
    const props = { options: numbers, ...passedDownProps };
    ```

Maybe consider put `passedDownProps` at first so that any duplicate props from high order component would not overwrite props of lower component by accident. Or use this pattern only for default props of html element, so it would be obvious that properties are overriden on purpose.

```javascript
const props = { ...passedDownProps, options: numbers };
```

### Conditional Rendering

```jsx
// renders if  condition is true
{condition && <span>Rendered when `truthy`</span> }

// renders if  condition is false
{condition || <span>Rendered when `falsey`</span> }

// renders by condition
{condition
  ? <span>Rendered when `truthy`</span>
  : <span>Rendered when `falsey`</span>
}

// renders by condition
{condition ? (
  <span>
    Rendered when `truthy`
  </span>
) : (
  <span>
    Rendered when `falsey`
  </span>
)}
```

### Container Components

A container component focuses on business logic like preparing data. Child component focuses on rendering views without considering business logic like data preparation. Container component passes data to child component and generate actual views. It separates business logic and user interface in favor of single responsiblity.

```jsx
class CommentListContainer extends React.Component {
  constructor() {
    super()
    this.state = { comments: [] }
  }

  componentDidMount() {
    fetch('http://destination/path').then(
      comments => this.setState({comments})
    )
  }

  render() {
    return <CommentList comments={this.state.comments} />
  }
}
```

### Render Callback and Render Props Pattern

Component contains a 'render' property, which is a function that can render some acutal component.

```jsx
class DaobahRP extends React.Component {
  state = { loading : true }

  componentDidMount() {
    fetch('https://swapi.co/api/planets/5')
      .then(res => res.json)
      .then(
        planet => this.state({ loading: false, planet })
        error => this.state({ loading: false, error })
      )
  }

  render() {
    return this.props.render(this.state)
  }
}

export default () => {
  <DagobahRP
    render={({ loading, error, planet })} => {
      if (loading) {
        return <LoadingView />
      } else if (planet) {
        return <PlanetView {...planet} />
      } else {
        return <ErrorView />
      }
    }
  >
}
```

Another way is too receive a function as child, which is accessible with `this.props.children` and use it to render actual components.

```jsx
import React, { Component, PropTypes } from 'react'
import fetchUser from 'twitter'
class Twitter extends Component {
  state = {
    user: null,
  }
  static propTypes = {
    username: PropTypes.string.isRequired,
  }
  componentDidMount () {
    fetchUser(this.props.username)
      .then((user) => this.setState({user}))
  }
  render () {
    return this.props.children(this.state.user)
  }
}

// use it like this
<Twitter username='tylermcginnis33'>
  {(user) => user === null
    ? <Loading />
    : <Badge info={user} />}
</Twitter>
```

### Context and Provider Pattern

When passing props from parent component to descendant components across multiple levels, passing down properties manually is cumbersome and makes parent component and child components highly coupled together. React provides context property to do it automatically.

First we need a context provider, which must implements function `getChildContext()` to provide context to any components in subtree.

```jsx
class MessageList extends React.Component {
  getChildContext() {
    return { color: 'purple' }
  }

  render() {
    const children = this.props.messages.map((message) =>
      <Message text={message.text} />
    )

    return <div>{children}</div>
  }
}
```

Then any component can access context from parents by declaring static  `contextTypes` property to declare which context properties it intends to receive. Use `this.context` to get context properties in descendant components.

```jsx
// MessageList -> Message -> Button
// Button component is a grandchild of MessageList component
class Button extends React.Component {
  // receive context property 'color' of type PropTypes.string
  static contextTypes = {
    color: PropTypes.string.
  }

  render() {
    return (
      <button style={{background: this.context.color}}>
        {this.props.children}
      </button>
    )
  }
}
```

In stateless component, context is accessed a little differently.

```jsx
const Button = ({children}, context) => {
  <button style={{background: context.color}}>
  {children}
  </button>
}

Button.contextTypes = {color: PropTypes.string}
```

Context pattern is used in libraries like _react-redux_, _react-router v4_.

Context makes parent properties easily accessible to descendant components, but implicity context dependency also makes descendant components logic obsecure and harder to test. So use it only if with obvious benefits.

```jsx

```