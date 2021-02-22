declare global {
    namespace JSX {
        interface Element {

        }

        interface IntrinsicAttributes {
            key: number;
        }

        interface IntrinsicElements {
            div: { name?: string };
        }
    }
}


function MyFactoryFunction(props: { foo: number, bar?: string }) {
    return <div />
}

let a = <MyFactoryFunction foo={1} key={1} />
// error

let a1 = <div key={'1'}></div>
let a2 = <div key={1}></div>

export { }
