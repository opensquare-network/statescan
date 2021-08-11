const { getAssetTransferCollection } = require("../../mongo");
const asyncLocalStorage = require("../../asynclocalstorage");
const { addAddresses } = require("../../utils/blockAddresses");
const { addAddress } = require("../../utils/blockAddresses");
const { updateOrCreateAddress } = require("../../utils/updateOrCreateAddress");

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
  const result = await col.insertOne(
    {
      indexer: blockIndexer,
      eventSort,
      extrinsicIndex,
      extrinsicHash,
      from,
      to,
      balance,
    },
    { session }
  );
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
    addAddresses([from, to]);
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
    addAddresses([from, to]);
  }

  if (
    [
      BalancesEvents.Reserved,
      BalancesEvents.Unreserved,
      BalancesEvents.BalanceSet,
    ].includes(method)
  ) {
    const [address] = eventData;
    addAddress(address);
  }

  return true;
}

module.exports = {
  handleBalancesEvent,
};
