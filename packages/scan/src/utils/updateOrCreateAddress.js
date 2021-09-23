const { getAddressCollection } = require("../mongo");
const asyncLocalStorage = require("../asynclocalstorage");
const { getRawAddressCollection } = require("../mongo");
const { getLatestFinalizedHeight } = require("../chain");
const { getOnChainAccounts } = require("./getOnChainAccounts");
const { logger } = require("../logger");
const { toDecimal128 } = require(".");

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

  await bulk.execute(null, { session });
}

async function handleMultiAddress(blockIndexer, addrs = []) {
  if (addrs.length <= 0) {
    return;
  }

  const session = asyncLocalStorage.getStore();

  const finalizedHeight = getLatestFinalizedHeight();
  if (finalizedHeight - blockIndexer.blockHeight > 100) {
    await saveToRawAddrs(addrs, session);
    logger.info(
      `${addrs.length} addresses updated at height ${blockIndexer.blockHeight}`
    );
    return;
  }

  const accounts = await getOnChainAccounts(blockIndexer, addrs);
  if (accounts.length <= 0) {
    return;
  }

  const col = await getAddressCollection();
  const bulk = col.initializeUnorderedBulkOp();
  for (const account of accounts) {
    bulk
      .find({ address: account.address })
      .upsert()
      .updateOne({
        $set: {
          ...account.info,
          data: {
            free: toDecimal128(account.info.data.free),
            reserved: toDecimal128(account.info.data.reserved),
            miscFrozen: toDecimal128(account.info.data.miscFrozen),
            feeFrozen: toDecimal128(account.info.data.feeFrozen),
          },
          lastUpdatedAt: blockIndexer,
        },
      });
  }
  await bulk.execute(null, { session });

  logger.info(`${accounts.length} addresses have been updated`);
}

module.exports = {
  handleMultiAddress,
};
