const { handleExtrinsics } = require("../business/extrinsic");
const { getBlockIndexer } = require("@statescan/common");

async function scanBlock(block, blockEvents) {
  const blockIndexer = getBlockIndexer(block);

  await handleExtrinsics(block.extrinsics, blockEvents, blockIndexer);
}

module.exports = {
  scanBlock,
};
