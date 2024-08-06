const process = require('process');
const EventEmitter = require('node:events');
const eventEmitter = new EventEmitter();
console.log(eventEmitter);
eventEmitter.on('start', () => {
    console.log('started');
  });
// process.nextTick(() => {
//   console.log('Executed in the next iteration');
// });
 
// console.log('Executed in the current iteration');
// setTimeout(() => {
//     console.log('Executed with setTimeout');
// }, 1000);
// setInterval(() => {
//     console.log('Executed with setInterval');
// }, 1000);
// setImmediate(() => {
//     console.log('Executed with setImmediate');
// });