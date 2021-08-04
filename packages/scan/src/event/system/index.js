const { getAddressCollection } = require("../../mongo");
const { getApi } = require("../../api");
const asyncLocalStorage = require("../../asynclocalstorage");

const Modules = Object.freeze({
  System: "system",
});

const SystemEvents = Object.freeze({
  NewAccount: "NewAccount",
  KilledAccount: "KilledAccount",
});

async function updateOrCreateAddress(blockIndexer, address, killed) {
  const api = await getApi();

  const account = await api.query.system.account.at(
    blockIndexer.blockHash,
    address
  );
  if (account) {
    const session = asyncLocalStorage.getStore();
    const col = await getAddressCollection();
    await col.updateOne(
      { address },
      {
        $set: {
          ...account.toJSON(),
          lastUpdatedAt: blockIndexer,
          ...(killed ? { killed } : {}),
        },
        ...(killed ? {} : { $unset: { killed: true } })
      },
      { upsert: true, session }
    );
  }
}

function isSystemEvent(section) {
  return section === Modules.System;
}

async function handleSystemEvent(
  event,
  eventSort,
  extrinsicIndex,
  extrinsicHash,
  blockIndexer
) {
  const { section, method, data } = event;

  if (!isSystemEvent(section)) {
    return false;
  }

  const eventData = data.toJSON();

  if ([SystemEvents.NewAccount, SystemEvents.KilledAccount].includes(method)) {
    const [address] = eventData;
    await updateOrCreateAddress(
      blockIndexer,
      address,
      method === SystemEvents.KilledAccount ? true : false
    );
  }

  return true;
}

module.exports = {
  handleSystemEvent,
};
