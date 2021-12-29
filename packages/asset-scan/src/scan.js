const { clearMeta } = require("./store/assetMeta");
const { removeBlockApi } = require("@statescan/common");
const { setLastBlockIndexer } = require("./statistic/date");
const { saveData } = require("./service");
const { handleEvents } = require("./business/event");

async function scanNormalizedBlock(
  block,
  blockEvents,
  author,
  blockIndexer,
  session
) {
  await handleEvents(blockEvents, blockIndexer, block.extrinsics);

  await saveData(blockIndexer, session);

  setLastBlockIndexer(blockIndexer);
  removeBlockApi(blockIndexer.blockHash);
  clearMeta(blockIndexer.blockHash);
}

module.exports = {
  scanNormalizedBlock,
};
