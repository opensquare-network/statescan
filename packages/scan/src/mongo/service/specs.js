const { getAllVersionChangeHeights } = require("../meta");
const { getRegistryByHeight } = require("../../utils/registry");

let versionChangedHeights = [];
let registryMap = {};

async function updateSpecs() {
  versionChangedHeights = await getAllVersionChangeHeights();
  for (const height of versionChangedHeights) {
    if (registryMap[height]) {
      continue;
    }

    registryMap[height] = await getRegistryByHeight(height);
  }
}

function getSpecHeights() {
  return versionChangedHeights;
}

async function findRegistry(height) {
  const mostRecentChangeHeight = versionChangedHeights.find((h) => h <= height);
  if (!mostRecentChangeHeight) {
    throw new Error(`Can not find registry for height ${height}`);
  }

  const registry = registryMap[mostRecentChangeHeight];
  if (!registry) {
    await updateSpecs();
  }

  return registryMap[mostRecentChangeHeight];
}

module.exports = {
  updateSpecs,
  getSpecHeights,
  findRegistry,
};
