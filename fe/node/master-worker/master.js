const fork = require('child_process').fork
const path = require('path')
const cpus = require('os').cpus()

console.log('test')
console.log('cpus: ', cpus.length)
for (let i = 0; i < cpus.length; i++) {
  console.log('fork: ', fork(path.resolve(__dirname, './worker.js')))
}
