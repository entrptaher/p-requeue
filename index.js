const pRetry = require('p-retry');
const PQueue = require('p-queue');

let gQueue;
/**
 * Create/Update global queue from provided object
 * @param  {Object} queue Options to pass to new Queue object or Queue Instance
 * @return {Any}
 */
function createQueue(queue) {
  if (queue instanceof PQueue) {
    gQueue = queue;
  } else if (typeof queue === 'object' && !gQueue) {
    gQueue = new PQueue(queue);
  }
}

/**
 * Add function to queue
 * @param {Object}   queue             an instance or Option to pass to new PQueue instance
 * @param {Function} fn                Function to add to queue
 * @param {Boolean}   breakCondition    Breaks immidietely if true
 * @param {Object}   [retryCondition]   Option to pass to retry module
 * @return {Promise}
 */
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
