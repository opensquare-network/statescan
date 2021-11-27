const findLast = require("lodash.findlast");
const { getAllVersionChangeHeights } = require("../../mongo/meta");
const { getApi, getProvider } = require("@statescan/utils");
const { hexToU8a, isHex } = require("@polkadot/util");

let versionChangedHeights = [];

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
}

async function updateSpecs(toScanHeight) {
  versionChangedHeights = await getAllVersionChangeHeights();
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
  updateSpecs,
  getSpecHeights,
  findRegistry,
  setSpecHeights,
};
