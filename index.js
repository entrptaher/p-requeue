const pRetry = require('p-retry');
const PQueue = require('p-queue');

let gQueue;
function createQueue(queue) {
  if (queue instanceof PQueue) {
    gQueue = queue;
  } else if (typeof queue === 'object' && !gQueue) {
    gQueue = new PQueue(queue);
  }
}

function addToQueue(
  queue,
  fn,
  breakCondition,
  retryCondition = { retries: 5, minTimeout: 0, maxTimeout: 0 }
) {
  createQueue(queue);

  async function run() {
    try {
      return await fn();
    } catch (e) {
      if (!breakCondition) {
        throw new Error(e);
      } else {
        throw new pRetry.AbortError(e);
      }
    }
  }
  return pRetry(() => gQueue.add(run), retryCondition);
}

module.exports = addToQueue;
