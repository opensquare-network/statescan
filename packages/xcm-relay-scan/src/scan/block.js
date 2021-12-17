const { handleEvents } = require("../business/event");
const { handleExtrinsics } = require("../business/extrinsic");
const { getBlockIndexer } = require("@statescan/common");

async function scanBlock(block, blockEvents) {
  const blockIndexer = getBlockIndexer(block);

  await handleExtrinsics(block.extrinsics, blockEvents, blockIndexer);
  await handleEvents(blockEvents, block.extrinsics, blockIndexer);
}

module.exports = {
  scanBlock,
};
