const { BalancesEvents } = require("@statescan/common");
const { isBalancesEvent } = require("./utils");
const { addNativeTransfer } = require("../../../store/blockNativeTokenTransfers");

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
    addNativeTransfer(blockIndexer.blockHeight, {
      indexer: blockIndexer,
      eventSort,
      extrinsicIndex,
      extrinsicHash,
      from,
      to,
      balance: value, // FIXME: value should be converted to decimal 128(call toDecimal128)
      listIgnore: false,
    });
  }
}

module.exports = {
  handleBalancesEvent,
};
