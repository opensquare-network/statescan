const { getBlockIndexer } = require("../block/getBlockIndexer");
const { GenericBlock } = require("@polkadot/types");
const { findRegistry } = require("../specs");
const { toDecimal128 } = require("../utils");
const { getOnChainAccounts } = require("../utils/getOnChainAccounts");
const { getRawAddressCollection, getAddressCollection } = require("../mongo");

async function getNotUpdatedAddresses() {
  const col = await getRawAddressCollection();
  const addrObjs = await col.find({ updated: false }).limit(500).toArray();
  return (addrObjs || []).map((obj) => obj.address);
}

async function updateAddresses(indexer, addrs = []) {
  if (addrs.length <= 0) {
    return;
  }

  const accounts = await getOnChainAccounts(indexer, addrs);
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
  } while ((addrs || []).length > 0);
}

async function updateAllRawAddrs(blockInDb) {
  const registry = await findRegistry(blockInDb.height);
  const block = new GenericBlock(registry, blockInDb.block.block);
  const blockIndexer = getBlockIndexer(block);

  await updateAllRawAddrsInDB(blockIndexer);
}

module.exports = {
  updateAllRawAddrs,
};
