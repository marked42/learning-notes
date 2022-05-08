// export default 1

console.log('this: ', this, this === require('./b.js'), this === module)

module.exports = 1
