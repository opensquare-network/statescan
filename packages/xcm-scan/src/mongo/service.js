const { getTeleportCollection } = require("./index");

async function bulkInsertTeleports(teleports = []) {
  if (teleports.length <= 0) {
    return;
  }

  const col = await getTeleportCollection();
  const bulk = col.initializeUnorderedBulkOp();
  for (const teleport of teleports) {
    bulk.insert(teleport);
  }
  await bulk.execute();
}

async function insertTeleport(teleport) {
  if (!teleport) {
    return;
  }

  const col = await getTeleportCollection();
  await col.insertOne(teleport);
}

async function deleteFromHeight(height) {
  const col = await getTeleportCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: height } });
}

module.exports = {
  bulkInsertTeleports,
  insertTeleport,
  deleteFromHeight,
};
