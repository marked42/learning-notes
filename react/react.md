# React

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