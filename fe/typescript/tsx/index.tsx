// import React from 'react'

// declare global {
//   namespace JSX {
//     interface Element { }

//     interface ElementAttributesProperty {
//       props: {};
//       // test1: number;
//     }

//     interface ElementChildrenAttribute {
//       children: {}
//     }

//     interface IntrinsicElements {
//       [key: string]: any;
//     }
//   }
// }


// interface PropsType {
//   children: JSX.Element
//   name: string
// }

// class Component extends React.Component<PropsType, {}> {
//   render() {
//     return (
//       <h2>
//         {this.props.children}
//       </h2>
//     )
//   }
// }
// // OK
// let a =
//   <Component name="foo">
//     <h1>Hello World</h1>
//   </Component>;

// // Error: children is of type JSX.Element not array of JSX.Element
// let b = <Component name="bar">
//   <h1>Hello World</h1>
//   <h2>Hello World</h2>
// </Component>

// // Error: children is of type JSX.Element not array of JSX.Element or string.
// let c = <Component name="baz">
//   <h1>Hello</h1>
//   World
// </Component>

// export { }
