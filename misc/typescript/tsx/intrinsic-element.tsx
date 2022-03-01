// declare global {
//   namespace JSX {
//     interface Element {
//       test: any;
//     }

//     interface ElementChildrenAttribute {
//       children: any;
//     }

//     interface IntrinsicElements {
//       div: { children: Element | number | string | Array<string | number | Element> };
//     }
//   }
// }

// // 子类型 字符串
// let a1 = <div>1</div>;
// // 子类型 数字
// let a2 = <div>{1}</div>
// // 子类型 Element
// let a3 = <div><div>1</div></div>
// // 允许多个子类型 对应 children: Array<string | number | Element>
// let a4 = <div>
//   {1}
//   1
//   <div>1</div>
// </div>;

// export { }
