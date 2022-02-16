// function ownX({ ...properties }) {
//   console.log('properties: ', properties)
//   return properties.x
// }
// const obj = Object.create({ x: 1 })
// console.log(ownX(obj)) // undefined

const proto = { a: 1 }
const obj = Object.create(proto, {
  b: {
    value: 2,
    enumerable: true,
  },
  c: {
    value: 3,
    enumerable: false,
  },
})

const { ...prop } = obj
// prop: { b: 2 }
console.log('prop: ', prop)
