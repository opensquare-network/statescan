const { getAddressCollection } = require("../mongo");
const asyncLocalStorage = require("../asynclocalstorage");
const { getApi } = require("../api");

async function updateOrCreateAddress(blockIndexer, address) {
  const session = asyncLocalStorage.getStore();
  const col = await getAddressCollection();
  const exists = await col.findOne(
    { address, "lastUpdatedAt.blockHeight": blockIndexer.blockHeight },
    { session }
  );
  if (exists) {
    // Yes, we have the address info already up to date
    return;
  }

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

  const promises = [];
  for (const addr of uniqueAddrs) {
    promises.push(updateOrCreateAddress(blockIndexer, addr));
  }

  await Promise.all(promises);
}

module.exports = {
  updateOrCreateAddress,
  handleMultiAddress,
};
