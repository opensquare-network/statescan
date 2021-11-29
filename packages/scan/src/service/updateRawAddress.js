const {
  logger,
  getBlockIndexer,
  env: { getUpdateAddrStep },
} = require("@statescan/common");
const { toDecimal128, bigAdd } = require("../utils");
const { getOnChainAccounts } = require("../utils/getOnChainAccounts");
const { getRawAddressCollection, getAddressCollection } = require("../mongo");

async function getNotUpdatedAddresses() {
  const updateAddrStep = getUpdateAddrStep();
  const col = await getRawAddressCollection();
  const addrObjs = await col
    .find({ updated: false })
    .limit(updateAddrStep)
    .toArray();
  return (addrObjs || []).map((obj) => obj.address);
}

async function updateAddresses(indexer, addrs = []) {
  if (addrs.length <= 0) {
    return;
  }

  const accounts = await getOnChainAccounts(indexer, addrs);
  if (accounts.length <= 0) {
    throw new Error("Can not get on chain accounts from given addrs");
  }

  const col = await getAddressCollection();
  const bulk = col.initializeUnorderedBulkOp();
  for (const account of accounts) {
    const total = bigAdd(
      account.info.data.free || 0,
      account.info.data.reserved || 0
    );
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
            total: toDecimal128(total),
          },
          lastUpdatedAt: indexer,
        },
      });
  }

  await bulk.execute();

  const rawCol = await getRawAddressCollection();
  const rawBulk = rawCol.initializeUnorderedBulkOp();
  for (const addr of addrs) {
    rawBulk.find({ address: addr }).updateOne({ $set: { updated: true } });
  }
  await rawBulk.execute();
}

async function updateAllRawAddrsInDB(indexer) {
  let addrs = await getNotUpdatedAddresses();
  do {
    await updateAddresses(indexer, addrs);
    addrs = await getNotUpdatedAddresses();
    logger.info(
      `${(addrs || []).length} addrs updated at ${indexer.blockHeight}`
    );
  } while ((addrs || []).length > 0);
}

async function updateAllRawAddrs(block) {
  const blockIndexer = getBlockIndexer(block);

  try {
    await updateAllRawAddrsInDB(blockIndexer);
  } catch (e) {
    logger.error("error when updateAllRawAddrsInDB", e);
  }
}

module.exports = {
  updateAllRawAddrs,
};
