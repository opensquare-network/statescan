const { getAddresses, clearAddresses } = require("../store/blockAddresses");
const { busLogger } = require("../logger");

async function updateRawAddrs(indexer, col) {
  const addrs = getAddresses(indexer.blockHeight);
  if (addrs.length <= 0) {
    return;
  }

  const bulk = col.initializeUnorderedBulkOp();
  for (const addr of addrs) {
    bulk
      .find({ address: addr })
      .upsert()
      .updateOne({ $set: { updated: false } });
  }

  await bulk.execute();
  clearAddresses(indexer.blockHeight);
  busLogger.info(
    `${addrs.length} raw addresses updated at height ${indexer.blockHeight}`
  );
}

module.exports = {
  updateRawAddrs,
};
