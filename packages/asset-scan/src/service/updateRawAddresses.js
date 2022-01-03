const { getRawAddressCollection } = require("../mongo");
const {
  store: { getAddresses },
  busLogger,
} = require("@statescan/common");

async function updateRawAddresses(indexer) {
  const addrs = getAddresses(indexer.blockHeight);
  if (addrs.length < 1) {
    return;
  }

  const col = await getRawAddressCollection();
  const bulk = col.initializeUnorderedBulkOp();
  for (const addr of addrs) {
    bulk
      .find({ address: addr })
      .upsert()
      .updateOne({ $set: { updated: false } });
  }

  await bulk.execute();
  busLogger.info(
    `${addrs.length} raw addresses updated at height ${indexer.blockHeight}`
  );
}

module.exports = {
  updateRawAddresses,
};
