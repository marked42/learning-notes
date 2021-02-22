declare global {
  namespace JSX {
    interface IntrinsicElements {
      foo: { name: string, children: string, key: number; };
      // [elemName: string]: any
    }
  }
}

const value = () => {
  return <foo name={"tom"} key={1}>test</foo >
}

export { }
