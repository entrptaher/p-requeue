const PQueue = require('p-queue');
const queue = new PQueue({ concurrency: 1 });

function goodFn() {
  return new Promise(function(resolve, reject) {
    setTimeout(() => {
      resolve('Should Resolve');
    }, 1000);
  });
}

function errorFn() {
  return new Promise(function(resolve, reject) {
    setTimeout(() => {
      reject('Should Throw');
    }, 100);
  });
}

const addToQueue = require('./index.js');
for (var i = 0; i < 5; i++) {
  addToQueue(queue, goodFn).then(r => console.log(r));
  // addToQueue(queue, errorFn);
}
