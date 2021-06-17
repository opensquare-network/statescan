const {
  getAddressCollection,
  getAssetTransferCollection,
} = require("../../mongo");
const { getApi } = require("../../api");

const Modules = Object.freeze({
  Balances: "balances",
});

const BalancesEvents = Object.freeze({
  Transfer: "Transfer",
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
  const col = await getAssetTransferCollection();
  const result = await col.insertOne({
    indexer: blockIndexer,
    eventSort,
    extrinsicIndex,
    extrinsicHash,
    from,
    to,
    balance,
  });
}

async function updateOrCreateAddress(blockHash, address) {
  const api = await getApi();

  const account = await api.query.system.account.at(blockHash, address);
  if (account) {
    const col = await getAddressCollection();
    await col.updateOne(
      { address },
      {
        $set: {
          ...account.toJSON(),
        },
      },
      { upsert: true }
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

  if (method === BalancesEvents.Transfer) {
    const [from, to, value] = eventData;
    await updateOrCreateAddress(blockIndexer.blockHash, from);
    await updateOrCreateAddress(blockIndexer.blockHash, to);
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

  return true;
}

module.exports = {
  handleBalancesEvent,
};
