const { getAddressCollection } = require("../mongo");
const asyncLocalStorage = require("../asynclocalstorage");
const { getApi } = require("../api");
const { logger } = require("../logger");
const { getAccountStorageKey } = require("./accountStorageKey");

async function handleMultiAddress(blockIndexer, addrs = [], registry) {
  if (addrs.length <= 0) {
    return;
  }

  const uniqueAddrs = [...new Set(addrs)];
  const api = await getApi();
  const keys = uniqueAddrs.map(getAccountStorageKey);
  const result = await api.rpc.state.queryStorageAt(
    keys,
    blockIndexer.blockHash
  );
  const accountInfoHexArr = (result || []).map((i) => i.toHex());

  const accounts = uniqueAddrs.reduce((result, address, idx) => {
    const accountInfoHex = accountInfoHexArr[idx];
    if (!accountInfoHex) {
      return result;
    }

    const accountInfo = registry.createType(
      "AccountInfo",
      accountInfoHex,
      true
    );
    result.push({ address, info: accountInfo.toJSON() });
    return result;
  }, []);

  if (accounts.length <= 0) {
    return;
  }

  const session = asyncLocalStorage.getStore();
  const col = await getAddressCollection();
  const bulk = col.initializeUnorderedBulkOp();
  for (const account of accounts) {
    bulk
      .find({ address: account.address })
      .upsert()
      .updateOne({
        $set: {
          ...account.info,
          data : {
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

  logger.info(`${uniqueAddrs.length} addresses have been updated`);
}

module.exports = {
  handleMultiAddress,
};
