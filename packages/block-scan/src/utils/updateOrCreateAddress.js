const { getRawAddressCollection } = require("../mongo");
const {
  logger,
} = require("@statescan/common");

async function saveToRawAddrs(addrs = [], indexer) {
  if (addrs.length <= 0) {
    return;
  }

  const col = await getRawAddressCollection();
  const bulk = col.initializeUnorderedBulkOp();
  for (const addr of addrs) {
    bulk
      .find({
        address: addr
      })
      .upsert()
      .updateOne({
        $setOnInsert: {
          indexer
        },
        $set: { updated: false },
      });
  }

  await bulk.execute();
}

async function handleMultiAddress(blockIndexer, addrs = []) {
  if (addrs.length <= 0) {
    return;
  }

  await saveToRawAddrs(addrs, blockIndexer);
  logger.info(
    `${addrs.length} addresses updated at height ${blockIndexer.blockHeight}`
  );
}

module.exports = {
  handleMultiAddress,
};
