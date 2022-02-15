// const person = {
//   firstName: 'Jackie',
//   lastName: 'Chen',
// }

// let firstName
// const { firstName } = {}

// let t = { a: 1 }
// Object.setPrototypeOf(t, { b: 2 })
// let { a, b, c } = t
// console.log(a, b, c)

// 理
function ownX({ ...properties }) {
  console.log(properties)
  return properties.x
}
const obj = Object.create({ x: 1, y: 2 })
const obj = { x: 1, y: 2 }
console.log(obj)
console.log(ownX(obj)) // undefined

const { x, ...rest } = obj
console.log('rest: ', rest)
