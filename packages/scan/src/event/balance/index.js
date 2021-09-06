const { addNativeTransfer } = require("../../store/blockNativeTokenTransfers");
const { addAddresses } = require("../../store/blockAddresses");
const { addAddress } = require("../../store/blockAddresses");

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
    addAddresses(blockIndexer.blockHeight, [from, to]);
    addNativeTransfer(blockIndexer.blockHeight, {
      indexer: blockIndexer,
      eventSort,
      extrinsicIndex,
      extrinsicHash,
      from,
      to,
      balance: value, // FIXME: value should be converted to decimal 128(call toDecimal128)
    });
  }

  if ([BalancesEvents.ReserveRepatriated].includes(method)) {
    const [from, to, balance] = eventData;
    addAddresses(blockIndexer.blockHeight, [from, to]);
  }

  if (
    [
      BalancesEvents.Reserved,
      BalancesEvents.Unreserved,
      BalancesEvents.BalanceSet,
    ].includes(method)
  ) {
    const [address] = eventData;
    addAddress(blockIndexer.blockHeight, address);
  }
}

module.exports = {
  handleBalancesEvent,
};
