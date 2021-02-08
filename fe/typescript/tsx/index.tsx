declare namespace JSX {
  interface IntrinsicElements {
    fuck: any;
    // [elemName: string]: any
  }

  interface Element { }
  interface ElementClass { }

  interface IntrinsicAttributes {
    key?: number | string;
  }

  interface ElementAttributesProperty { props: {}; }
  interface ElementChildrenAttribute { children: {}; }

  interface IntrinsicClassAttributes<T> {

  }
}

// Fuck 是函数组件，
function test() {
  return <Fuck name={1} key={/s/}>tes</Fuck>
}

function Fuck(props: { children: string, name: number }) {
  return <a>a</a>
}
