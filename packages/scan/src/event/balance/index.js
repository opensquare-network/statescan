const { isBalancesEvent, BalancesEvents } = require("./utils");
const { addNativeTransfer } = require("../../store/blockNativeTokenTransfers");
const { addAddresses } = require("../../store/blockAddresses");
const { addAddress } = require("../../store/blockAddresses");

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
