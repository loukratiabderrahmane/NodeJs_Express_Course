/*
const os = require('os')

console.log(os.type())
console.log(os.version())
console.log(os.homedir())

console.log(__filename)
console.log(__dirname)

const path = require('path')

console.log(path.dirname(__filename))
console.log(path.basename(__filename))
console.log(path.extname(__filename))

console.log(path.parse(__filename))
*/ 

// --------Work with Modules--------

// const math = require('./math')

// console.log(math.add(3,5))

// OR

const {add, substract, multiply, divide} = require('./math')
console.log(add(3,5))
console.log(substract(3,5))
console.log(multiply(3,5))
console.log(divide(3,5))