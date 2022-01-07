const { getRawAddressCollection } = require("./mongo/account");
const {
  removeBlockApi,
  db: { updateRawAddrs },
} = require("@statescan/common");
const { saveData } = require("./service");
const { handleEvents } = require("./event");
const { handleExtrinsics } = require("./extrinsic");
const { normalizeEvents } = require("./utils/normalize/event");
const { normalizeExtrinsics } = require("./utils/normalize/extrinsic");
const { extractBlock } = require("./block");

async function scanNormalizedBlock(block, blockEvents, author, blockIndexer) {
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

  await updateRawAddrs(blockIndexer, await getRawAddressCollection());

  await saveData(
    blockIndexer,
    extractedBlock,
    extractedExtrinsics,
    extractedEvents
  );

  removeBlockApi(blockIndexer.blockHash);
}

module.exports = {
  scanNormalizedBlock,
};
