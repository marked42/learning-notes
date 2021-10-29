console.log(undefined)
// undefined是 configurable/writable/enumerable = false，写入无效
var undefined = 1
console.log(undefined)
