# React

- [React](#react)
  - [`setState()`](#setstate)
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

`setState(newState)` does a shallow merge with `oldState` and `newState`, avoid using deeply nested state which could cause unexpected behaviour.

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

However, other child `TodoItems` not changed should not be rendered again. Uneccessary re-renders can be avoided with `shouldComponentUpdate()` or `React.PureComponent`.

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

Extract part of component props and pass them down. It allows users to assign default props like 'id', 'className', 'htmlFor' etc... for html element to high order component, and lower component could inherit assigned value from high order component. This pattern allows users to manipulate lower component properties from high order component.

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

Maybe consider put `passedDownProps` at first so that any duplicate props from high order component would not overwrite props of lower component by accident. Or use this pattern only for default props of html element, so that it's propbably always being done on purpose.

```javascript
const props = { ...passedDownProps, options: numbers };
```

### Conditional Rendering

```jsx
// renders if  condition is true
{condition && <span>Rendered when `truthy`</span> }

// renders if  condition is false
{condition || <span>Rendered when `falsey`</span> }

// renders if by condition
{condition
  ? <span>Rendered when `truthy`</span>
  : <span>Rendered when `falsey`</span>
}

// renders if by condition
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

When passing props from parent compoent to descendant components across multiple levels, manual property passing down is is cumbersome and makes parent component and child components highly coupled together. React provides context property to do it automatically.

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

Then any component can access context from parents by declaring static  `contextTypes` property to declare which context properties it intends to receive. Access context props with `this.context` property in sub components.

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

Context makes parent properties easily accessible to descendant components, but it's easily to be used inappropriately which makes descendant components harder to test. So use it only if with obvious benefits.

```jsx

```