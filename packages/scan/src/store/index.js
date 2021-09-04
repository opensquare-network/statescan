const { getBlockCollection, getExtrinsicCollection } = require("../mongo");

async function saveData(block, extrinsics, session) {
  const blockCol = await getBlockCollection();

  const result = await blockCol.insertOne(block, { session });
  if (result.result && !result.result.ok) {
    // TODO: Handle insertion failed
  }

  await saveExtrinsics(extrinsics, session);
}

async function saveExtrinsics(extrinsics, session) {
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

module.exports = {
  saveData,
};
