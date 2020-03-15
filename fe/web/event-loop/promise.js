
let resolvedPromise1 = Promise.resolve()
let resolvePromise = new Promise(resolve => {
  // let resolvedPromise = Promise.resolve()
  // resolve(resolvedPromise)
  resolve(resolvedPromise1)
})

console.log(resolvePromise === resolvedPromise1)
resolvePromise.then(() => {
  console.log('resolvePromise resolved')
})
let resolvedPromiseThen = Promise.resolve().then(res => {
  console.log('promise1')
})
resolvedPromiseThen
  .then(() => {
    console.log('promise2')
  })
  .then(() => {
    console.log('promise3')
  })
