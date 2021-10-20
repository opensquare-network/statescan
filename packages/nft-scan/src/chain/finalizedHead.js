const { getApi } = require("../api");

let latestHeight = null;

async function subscribeFinalizedHeight() {
  const api = await getApi();

  await new Promise((resolve) => {
    api.rpc.chain.subscribeFinalizedHeads((header) => {
      latestHeight = header.number.toNumber();
      resolve();
    });
  });
}

function getLatestHeight() {
  return latestHeight;
}

module.exports = {
  subscribeFinalizedHeight,
  getLatestHeight,
};
