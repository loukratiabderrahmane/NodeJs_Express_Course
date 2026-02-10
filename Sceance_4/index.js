const LogEvents = require('./LogEvents')

const EventEmitter = require('events')

class MyEmitter extends EventEmitter {}

// initialze object
const myEmitter = new MyEmitter();

// add listener for the log event
myEmitter.on('log', (msg) => LogEvents(msg))

setTimeout(()=>{
    // Emit event
    myEmitter.emit('log', 'Log event emitted!')
}, 2000)