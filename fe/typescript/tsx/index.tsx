// declare namespace JSX {
//   interface IntrinsicElements {
//     foo: { name: string, children: number, key: number; };
//     // [elemName: string]: any
//   }

//   // interface Element {
//   //   name: number;
//   // }
//   // interface ElementClass { }

//   // interface IntrinsicAttributes {
//   //   key?: number | string;
//   // }

//   // interface ElementAttributesProperty { props: {}; }
//   // interface ElementChildrenAttribute { children: {}; }

//   // interface IntrinsicClassAttributes<T> {

//   // }
// }

// const value = <foo name={'1'} key={1}>{1}</foo>

declare namespace global {

  namespace JSX {
    interface IntrinsicElements {
      foo: { name: string, children: number | string, key: number; };
      // [elemName: string]: any
    }
  }
}

export const value = <foo name={'1'} key={1}>{1}</foo>
const value1 = () => {
  return <foo name={"tom"} key={1}>test</foo >
}
