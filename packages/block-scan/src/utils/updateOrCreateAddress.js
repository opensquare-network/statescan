const asyncLocalStorage = require("../asynclocalstorage");
const { getRawAddressCollection } = require("../mongo");
const {
  logger,
  chainHeight: { getLatestFinalizedHeight },
} = require("@statescan/common");

async function saveToRawAddrs(addrs = [], session) {
  if (addrs.length <= 0) {
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

  await bulk.execute({ session });
}

async function handleMultiAddress(blockIndexer, addrs = []) {
  if (addrs.length <= 0) {
    return;
  }

  const session = asyncLocalStorage.getStore();

  const finalizedHeight = getLatestFinalizedHeight();
  if (
    !process.env.UPDATE_ADDR_IN_TIME &&
    finalizedHeight - blockIndexer.blockHeight > 100
  ) {
    await saveToRawAddrs(addrs, session);
    logger.info(
      `${addrs.length} addresses updated at height ${blockIndexer.blockHeight}`
    );
    return;
  }
}

module.exports = {
  handleMultiAddress,
};
