const { handleEvents } = require("../business/event");

function extractBlockTime(extrinsics) {
  const setTimeExtrinsic = extrinsics.find(
    (ex) => ex.method.section === "timestamp" && ex.method.method === "set"
  );
  if (setTimeExtrinsic) {
    const { args } = setTimeExtrinsic.method.toJSON();
    return args.now;
  }
}

function getBlockIndexer(block) {
  const blockHash = block.hash.toHex();
  const blockHeight = block.header.number.toNumber();
  const blockTime = extractBlockTime(block.extrinsics);

  return {
    blockHeight,
    blockHash,
    blockTime,
  };
}

async function scanBlock(block, blockEvents) {
  const blockIndexer = getBlockIndexer(block);

  await handleEvents(blockEvents, block.extrinsics, blockIndexer);
}

module.exports = {
  scanBlock,
};
