const { getApi } = require("../api");

let latestFinalizedHeight = null;
let latestUnFinalizedHeight = null;

async function updateHeight() {
  const api = await getApi();

  await new Promise((resolve) => {
    api.rpc.chain.subscribeFinalizedHeads((header) => {
      latestFinalizedHeight = header.number.toNumber();
      resolve();
    });
  });

  await new Promise((resolve) => {
    api.rpc.chain.subscribeNewHeads((header) => {
      latestUnFinalizedHeight = header.number.toNumber();
      resolve();
    });
  });
}

function getLatestFinalizedHeight() {
  return latestFinalizedHeight;
}

function getLatestUnFinalizedHeight() {
  return latestUnFinalizedHeight;
}

module.exports = {
  updateHeight,
  getLatestFinalizedHeight,
  getLatestUnFinalizedHeight,
};
