const {
  getBlockCollection,
  getExtrinsicCollection,
  getEventCollection,
} = require("../mongo");

async function saveData(indexer, block, extrinsics, events) {
  const blockCol = await getBlockCollection();

  const result = await blockCol.insertOne(block);
  if (result.result && !result.result.ok) {
    // TODO: Handle insertion failed
  }

  await saveExtrinsics(extrinsics);
  await saveEvents(events);
}

async function saveExtrinsics(extrinsics = []) {
  if (extrinsics.length <= 0) {
    return;
  }

  const col = await getExtrinsicCollection();
  const bulk = col.initializeUnorderedBulkOp();
  for (const extrinsic of extrinsics) {
    bulk.insert(extrinsic);
  }

  const result = await bulk.execute();
  if (result.result && !result.result.ok) {
    // TODO: handle failure
  }
}

async function saveEvents(events = []) {
  if (events.length <= 0) {
    return;
  }

  const eventCol = await getEventCollection();
  const bulk = eventCol.initializeUnorderedBulkOp();
  for (const event of events) {
    bulk.insert(event);
  }

  const result = await bulk.execute();
  if (result.result && !result.result.ok) {
    // TODO: handle failure
  }
}

module.exports = {
  saveData,
};
