const {
  getAddressCollection,
  getAssetTransferCollection,
} = require("../../mongo");
const { getApi } = require("../../api");
const asyncLocalStorage = require("../../asynclocalstorage");

const Modules = Object.freeze({
  Balances: "balances",
});

const BalancesEvents = Object.freeze({
  Transfer: "Transfer",
  Reserved: "Reserved",
  Unreserved: "Unreserved",
  ReserveRepatriated: "ReserveRepatriated",
  BalanceSet: "BalanceSet",
});

async function saveNewTransfer(
  blockIndexer,
  eventSort,
  extrinsicIndex,
  extrinsicHash,
  from,
  to,
  balance
) {
  const session = asyncLocalStorage.getStore();
  const col = await getAssetTransferCollection();
  const result = await col.insertOne({
    indexer: blockIndexer,
    eventSort,
    extrinsicIndex,
    extrinsicHash,
    from,
    to,
    balance,
  }, { session });
}

async function updateOrCreateAddress(blockIndexer, address) {
  const session = asyncLocalStorage.getStore();
  const col = await getAddressCollection();
  const exists = await col.findOne(
    { address, "lastUpdatedAt.blockHeight": blockIndexer.blockHeight },
    { session },
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

function isBalancesEvent(section) {
  return section === Modules.Balances;
}

async function handleBalancesEvent(
  event,
  eventSort,
  extrinsicIndex,
  extrinsicHash,
  blockIndexer
) {
  const { section, method, data } = event;

  if (!isBalancesEvent(section)) {
    return false;
  }

  const eventData = data.toJSON();

  if ([BalancesEvents.Transfer].includes(method)) {
    const [from, to, value] = eventData;
    await updateOrCreateAddress(blockIndexer, from);
    await updateOrCreateAddress(blockIndexer, to);
    await saveNewTransfer(
      blockIndexer,
      eventSort,
      extrinsicIndex,
      extrinsicHash,
      from,
      to,
      value
    );
  }

  if ([BalancesEvents.ReserveRepatriated].includes(method)) {
    const [from, to, balance] = eventData;
    await updateOrCreateAddress(blockIndexer, from);
    await updateOrCreateAddress(blockIndexer, to);
  }

  if (
    [
      BalancesEvents.Reserved,
      BalancesEvents.Unreserved,
      BalancesEvents.BalanceSet,
    ].includes(method)
  ) {
    const [address] = eventData;
    await updateOrCreateAddress(blockIndexer, address);
  }

  return true;
}

module.exports = {
  handleBalancesEvent,
};
