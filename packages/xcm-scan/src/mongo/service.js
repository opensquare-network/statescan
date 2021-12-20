const {
  getTeleportInCollection,
  getTeleportOutCollection,
} = require("./index");

async function deleteFromHeight(height) {
  let col = await getTeleportInCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: height } });

  col = await getTeleportOutCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: height } });
}

async function insertTeleportOut(teleport) {
  if (!teleport) {
    return;
  }

  const col = await getTeleportOutCollection();
  await col.insertOne(teleport);
}

async function bulkInsertTeleportIns(teleports = []) {
  if (teleports.length <= 0) {
    return;
  }

  const col = await getTeleportInCollection();
  const bulk = col.initializeUnorderedBulkOp();
  for (const teleport of teleports) {
    bulk.insert(teleport);
  }
  await bulk.execute();
}

module.exports = {
  deleteFromHeight,
  insertTeleportOut,
  bulkInsertTeleportIns,
};
