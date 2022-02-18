// function ownX({ ...properties }) {
//   console.log('properties: ', properties)
//   return properties.x
// }
// const obj = Object.create({ x: 1 })
// console.log(ownX(obj)) // undefined

// const proto = { a: 1 }
// const obj = Object.create(proto, {
//   b: {
//     value: 2,
//     enumerable: true,
//   },
//   c: {
//     value: 3,
//     enumerable: false,
//   },
// })

// const { ...prop } = obj
// // prop: { b: 2 }
// console.log('prop: ', prop)

// const original = {
//   get foo() {
//     return 123
//   },
// }

// // { foo: 123 }
// const spread = { ...original }
// const assign = Object.assign({}, original)

// console.log(spread, assign)

// const [, ...a] = [1, 2, { a: 1, b: 2 }]

// const [, ...{ length }] = [1, 2, { a: 1, b: 2 }]

// console.log(length)

// let a = 1

// ;[a = 2, a = 3] = [a]

// console.log('a: ', a)

;[{ a }]
