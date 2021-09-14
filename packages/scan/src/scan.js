const { setLastBlockIndexer } = require("./statistic/date");
const { saveData } = require("./service");
const { handleEvents } = require("./event");
const { getAddresses, clearAddresses } = require("./store/blockAddresses");
const { handleMultiAddress } = require("./utils/updateOrCreateAddress");
const { handleExtrinsics } = require("./extrinsic");
const { normalizeEvents } = require("./utils/normalize/event");
const { normalizeExtrinsics } = require("./utils/normalize/extrinsic");
const { extractBlock } = require("./block");

async function scanNormalizedBlock(
  block,
  blockEvents,
  author,
  blockIndexer,
  session
) {
  const extractedBlock = extractBlock(block, blockEvents, author);
  const extractedExtrinsics = normalizeExtrinsics(
    block.extrinsics,
    blockEvents,
    blockIndexer
  );
  const extractedEvents = normalizeEvents(
    blockEvents,
    blockIndexer,
    block.extrinsics
  );
  await handleExtrinsics(block.extrinsics, blockEvents, blockIndexer);
  await handleEvents(blockEvents, blockIndexer, block.extrinsics);

  await handleMultiAddress(
    blockIndexer,
    getAddresses(blockIndexer.blockHeight)
  );
  clearAddresses(blockIndexer.blockHeight);

  await saveData(
    blockIndexer,
    extractedBlock,
    extractedExtrinsics,
    extractedEvents,
    session
  );

  setLastBlockIndexer(blockIndexer);
}

module.exports = {
  scanNormalizedBlock,
};
