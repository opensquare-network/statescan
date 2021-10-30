const { getAllVersionChangeHeights } = require("../mongo/meta");
const findLast = require("lodash.findlast");
const { getApi } = require("../api");

let versionChangedHeights = [];
let apiMap = {};

async function updateSpecs() {
  versionChangedHeights = await getAllVersionChangeHeights();
}

function getSpecHeights() {
  return versionChangedHeights;
}

// For test
function setSpecHeights(heights = []) {
  versionChangedHeights = heights;
}

async function findBlockApiByHeight(blockHeight) {
  const mostRecentChangeHeight = findLast(
    versionChangedHeights,
    (h) => h <= blockHeight
  );
  if (!mostRecentChangeHeight) {
    throw new Error(`Can not find registry for height ${blockHeight}`);
  }

  let targetApi = apiMap[mostRecentChangeHeight];
  if (!targetApi) {
    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(mostRecentChangeHeight);
    targetApi = await api.at(blockHash);
    apiMap[mostRecentChangeHeight] = targetApi;
  }

  return targetApi;
}

module.exports = {
  updateSpecs,
  getSpecHeights,
  findBlockApiByHeight,
  setSpecHeights,
};
