const {
  getBlockCollection,
  getExtrinsicCollection,
  getEventCollection,
} = require("../mongo");

async function saveData(block, extrinsics, events, session) {
  const blockCol = await getBlockCollection();

  const result = await blockCol.insertOne(block, { session });
  if (result.result && !result.result.ok) {
    // TODO: Handle insertion failed
  }

  await saveExtrinsics(extrinsics, session);
  await saveEvents(events, session);
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
  const bulk = eventCol.initializeOrderedBulkOp();
  for (const event of events) {
    bulk.insert(event);
  }

  const result = await bulk.execute(null, { session });
  if (result.result && !result.result.ok) {
    // TODO: handle failure
  }
}

module.exports = {
  saveData,
};
