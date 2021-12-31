const { clearMeta } = require("./business/common/store/assetMeta");
const { clearAsset } = require("./business/common/store/asset");
const { removeBlockApi } = require("@statescan/common");
const { setLastBlockIndexer } = require("./statistic/date");
const { flushData } = require("./service");
const { handleEvents } = require("./business/event");

async function scanNormalizedBlock(block, blockEvents, blockIndexer) {
  await handleEvents(blockEvents, blockIndexer, block.extrinsics);

  await flushData(blockIndexer);

  setLastBlockIndexer(blockIndexer);
  removeBlockApi(blockIndexer.blockHash);
  clearMeta(blockIndexer.blockHash);
  clearAsset(blockIndexer.blockHash);
}

module.exports = {
  scanNormalizedBlock,
};
