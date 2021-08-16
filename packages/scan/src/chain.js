const { getApi } = require("./api");

let latestFinalizedHeight = null;
let unsubscribeNewHead = null;

let latestUnFinalizedHeight = null;

function getUnSubscribeNewHeadFunction() {
  return unsubscribeNewHead;
}

async function updateHeight() {
  const api = await getApi();

  unsubscribeNewHead = await api.rpc.chain.subscribeFinalizedHeads((header) => {
    latestFinalizedHeight = header.number.toNumber();
  });

  await api.rpc.chain.subscribeNewHeads((header) => {
    latestUnFinalizedHeight = header.number.toNumber();
  });
}

function getLatestFinalizedHeight() {
  return latestFinalizedHeight;
}

function getLatestUnFinalizedHeight() {
  return latestUnFinalizedHeight;
}

module.exports = {
  getUnSubscribeNewHeadFunction,
  updateHeight,
  getLatestFinalizedHeight,
  getLatestUnFinalizedHeight,
};
