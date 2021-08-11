const { getAddressCollection } = require("../mongo");
const asyncLocalStorage = require("../asynclocalstorage");
const { getApi } = require("../api");
const { logger } = require("../logger");

async function updateOrCreateAddress(blockIndexer, address) {
  const session = asyncLocalStorage.getStore();
  const col = await getAddressCollection();
  const api = await getApi();

  const account = await api.query.system.account.at(
    blockIndexer.blockHash,
    address
  );
  if (account) {
    await col.updateOne(
      { address },
      {
        $set: {
          ...account.toJSON(),
          lastUpdatedAt: blockIndexer,
        },
      },
      { upsert: true, session }
    );
  }
}

async function handleMultiAddress(blockIndexer, addrs = []) {
  if (addrs.length <= 0) {
    return;
  }

  const uniqueAddrs = [...new Set(addrs)];

  // TODO: query in batch, insert in batch
  const promises = [];
  for (const addr of uniqueAddrs) {
    promises.push(updateOrCreateAddress(blockIndexer, addr));
  }

  await Promise.all(promises);
  logger.info(`${uniqueAddrs.length} addresses have been updated`);
}

module.exports = {
  updateOrCreateAddress,
  handleMultiAddress,
};
