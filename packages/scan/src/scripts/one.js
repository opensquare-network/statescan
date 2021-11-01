require("dotenv").config();

const { normalizeEvents } = require("../utils/normalize/event");
const { normalizeExtrinsics } = require("../utils/normalize/extrinsic");
const { getBlockIndexer } = require("../block/getBlockIndexer");
const { normalizeBlock } = require("../utils/normalize/block");
const { getBlockFromNode } = require("../block/fetchBlock");
const { getApi } = require("../api");
const { updateHeight, getLatestFinalizedHeight } = require("../chain");
const {
  getBlockCollection,
  getExtrinsicCollection,
  getEventCollection,
  getAssetCollection,
  getAssetTransferCollection,
} = require("../mongo");

async function fetchAndSave(height) {
  const blockData = await getBlockFromNode(height);
  const normalizedBlock = normalizeBlock(blockData);

  const col = await getBlockCollection();
  const bulk = col.initializeOrderedBulkOp();
  bulk.find({ "header.number": height }).delete();
  bulk.insert(normalizedBlock);
  await bulk.execute();

  const blockIndexer = getBlockIndexer(blockData.block.block);
  const normalizedExtrinsics = normalizeExtrinsics(
    blockData.block.block.extrinsics,
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
    blockData.block.block.extrinsics
  );
  const eventCol = await getEventCollection();
  const eventBulk = eventCol.initializeOrderedBulkOp();
  eventBulk.find({ "indexer.blockHeight": height }).delete();
  for (const event of normalizedEvents) {
    eventBulk.insert(event);
  }
  await eventBulk.execute();

  await saveBusiness(blockData, blockIndexer);
}

async function saveBusiness({ block, events }, blockIndexer) {
  const transfers = [];

  const assetCol = await getAssetCollection();
  let sort = 0;
  for (const rawEvent of events) {
    const { event, phase } = rawEvent;
    if (!phase.isNull) {
      const phaseValue = phase.value.toNumber();
      const extrinsic = block.block.extrinsics[phaseValue];
      const extrinsicHash = extrinsic.hash.toHex();
      const extrinsicIndex = phaseValue;

      const { section, method, data } = event;
      if (section === "assets" || method === "Transferred") {
        const [assetId, from, to, balance] = data.toJSON();
        const asset = await assetCol.findOne({ assetId, destroyedAt: null });
        if (!asset) {
          continue;
        }

        transfers.push({
          indexer: blockIndexer,
          eventSort: sort,
          extrinsicIndex,
          extrinsicHash,
          asset: asset._id,
          from,
          to,
          balance,
        });
      } else if (section === "balances" && method === "Transfer") {
        const [from, to, balance] = data.toJSON();
        transfers.push({
          indexer: blockIndexer,
          eventSort: sort,
          extrinsicIndex,
          extrinsicHash,
          from,
          to,
          balance,
        });
      }
    }

    sort++;
  }

  const transferCol = await getAssetTransferCollection();
  const bulk = transferCol.initializeOrderedBulkOp();
  bulk.find({ "indexer.blockHeight": blockIndexer.blockHeight }).delete();
  for (const transfer of transfers) {
    bulk.insert(transfer);
  }

  await bulk.execute();
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
