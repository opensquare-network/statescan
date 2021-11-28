const { getBlockIndexer } = require("@statescan/common/src/block");
const { handleBlockIssuance } = require("../business/batch/issuance");
const { clearIssuance } = require("../store/blockIssuance");
const { handleEvents } = require("../business/event");

async function scanBlock(block, blockEvents) {
  const blockIndexer = getBlockIndexer(block);

  await handleEvents(blockEvents, block.extrinsics, blockIndexer);

  await handleBlockIssuance(blockIndexer);
  clearIssuance(blockIndexer.blockHeight);
}

module.exports = {
  scanBlock,
};
