const {
  getBlockNativeTransfers,
  clearNativeTransfers,
} = require("../store/blockNativeTokenTransfers");
const {
  getBlockCollection,
  getExtrinsicCollection,
  getEventCollection,
  getAssetTransferCollection,
} = require("../mongo");

async function saveData(indexer, block, extrinsics, events, session) {
  const blockCol = await getBlockCollection();

  const result = await blockCol.insertOne(block, { session });
  if (result.result && !result.result.ok) {
    // TODO: Handle insertion failed
  }

  await saveExtrinsics(extrinsics, session);
  await saveEvents(events, session);
  await saveNativeTokenTransfers(indexer.blockHeight, session);
}

async function saveExtrinsics(extrinsics = [], session) {
  if (extrinsics.length <= 0) {
    return;
  }

  const col = await getExtrinsicCollection();
  const bulk = col.initializeUnorderedBulkOp();
  for (const extrinsic of extrinsics) {
    bulk.insert(extrinsic);
  }

  const result = await bulk.execute(null, { session });
  if (result.result && !result.result.ok) {
    // TODO: handle failure
  }
}

async function saveEvents(events = [], session) {
  if (events.length <= 0) {
    return;
  }

  const eventCol = await getEventCollection();
  const bulk = eventCol.initializeUnorderedBulkOp();
  for (const event of events) {
    bulk.insert(event);
  }

  const result = await bulk.execute(null, { session });
  if (result.result && !result.result.ok) {
    // TODO: handle failure
  }
}

async function saveNativeTokenTransfers(blockHeight, session) {
  const transfers = getBlockNativeTransfers(blockHeight);
  if (transfers.length <= 0) {
    return;
  }

  const col = await getAssetTransferCollection();
  const bulk = col.initializeUnorderedBulkOp();
  for (const transfer of transfers) {
    bulk.insert(transfer);
  }

  const result = await bulk.execute(null, { session });
  if (result.result && !result.result.ok) {
    // TODO: handle failure
  }
  clearNativeTransfers(blockHeight);
}

module.exports = {
  saveData,
};
