const findLast = require("lodash.findlast");
const {
  meta: { getAllVersionChangeHeights, getScanHeight },
} = require("@statescan/utils");
const { getApi, getProvider } = require("@statescan/utils");
const { hexToU8a, isHex } = require("@polkadot/util");

let versionChangedHeights = [];
let metaScanHeight = 1;

// For test
async function setSpecHeights(heights = []) {
  const api = await getApi();
  for (const height of heights) {
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const provider = getProvider();
    const runtimeVersion = await provider.send("chain_getRuntimeVersion", [
      blockHash,
    ]);
    versionChangedHeights.push({
      height,
      runtimeVersion,
    });
  }

  metaScanHeight = heights[heights.length - 1];
}

async function updateSpecs(toScanHeight) {
  versionChangedHeights = await getAllVersionChangeHeights();
  metaScanHeight = await getScanHeight();
}

function getMetaScanHeight() {
  return metaScanHeight;
}

function getSpecHeights() {
  return versionChangedHeights;
}

async function findRegistry({ blockHash, blockHeight: height }) {
  const spec = findMostRecentSpec(height);
  const api = await getApi();

  let u8aHash = blockHash;
  if (isHex(blockHash)) {
    u8aHash = hexToU8a(u8aHash);
  }

  return (await api.getBlockRegistry(u8aHash, spec.runtimeVersion)).registry;
}

function findMostRecentSpec(height) {
  const spec = findLast(versionChangedHeights, (h) => h.height <= height);
  if (!spec) {
    throw new Error(`Can not find height ${height}`);
  }

  return spec;
}

module.exports = {
  getMetaScanHeight,
  updateSpecs,
  getSpecHeights,
  findRegistry,
  setSpecHeights,
};
