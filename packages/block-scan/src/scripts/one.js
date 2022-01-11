require("dotenv").config();

const { normalizeEvents } = require("../utils/normalize/event");
const { normalizeExtrinsics } = require("../utils/normalize/extrinsic");
const { getBlockIndexer, getApi } = require("@statescan/common");
const { normalizeBlock } = require("../utils/normalize/block");
const { fetchOneBlockFromNode } = require("@statescan/common");
const { chainHeight: { updateHeight, getLatestFinalizedHeight } } = require("@statescan/common");
const {
  getBlockCollection,
  getExtrinsicCollection,
  getEventCollection,
} = require("../mongo");

async function fetchAndSave(height) {
  const blockData = await fetchOneBlockFromNode(height, true);
  const normalizedBlock = normalizeBlock(blockData);

  const col = await getBlockCollection();
  const bulk = col.initializeOrderedBulkOp();
  bulk.find({ "header.number": height }).delete();
  bulk.insert(normalizedBlock);
  await bulk.execute();

  const blockIndexer = getBlockIndexer(blockData.block);
  const normalizedExtrinsics = normalizeExtrinsics(
    blockData.block.extrinsics,
    blockData.events,
    blockIndexer
  );
  const extrinsicCol = await getExtrinsicCollection();
  const extrinsicBulk = extrinsicCol.initializeOrderedBulkOp();
  extrinsicBulk.find({ "indexer.blockHeight": height }).delete();
  for (const extrinsic of normalizedExtrinsics) {
    extrinsicBulk.insert(extrinsic);
  }
  await extrinsicBulk.execute();

  const normalizedEvents = normalizeEvents(
    blockData.events,
    blockIndexer,
    blockData.block.extrinsics
  );
  const eventCol = await getEventCollection();
  const eventBulk = eventCol.initializeOrderedBulkOp();
  eventBulk.find({ "indexer.blockHeight": height }).delete();
  for (const event of normalizedEvents) {
    eventBulk.insert(event);
  }
  await eventBulk.execute();
}

async function main() {
  const myArgs = process.argv.slice(2);
  if ((myArgs || []).length <= 0) {
    console.error("Please specify the block height");
    process.exit(1);
  }

  const arg1 = myArgs[0];
  const height = parseInt(arg1);
  if (isNaN(height)) {
    console.error("Wrong block height");
    process.exit(1);
  }

  await updateHeight();
  const api = await getApi();
  const finalizedHeight = getLatestFinalizedHeight();
  if (height > finalizedHeight) {
    console.error("Block height can not be greater than the finalized height");
    await api.disconnect();
    process.exit(1);
  }

  await fetchAndSave(height);
  console.log(`block ${height} have been saved!`);
  await api.disconnect();
  process.exit(0);
}

main().catch(console.error);
