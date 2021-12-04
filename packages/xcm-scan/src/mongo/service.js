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

module.exports = {
  bulkInsertTeleports,
};
