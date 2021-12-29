const { BalancesEvents } = require("@statescan/common");
const { isBalancesEvent } = require("./utils");
const { addNativeTransfer } = require("../../../store/blockNativeTokenTransfers");

async function handleBalancesEvent(
  event,
  eventSort,
  extrinsic,
  extrinsicIndex,
  blockIndexer
) {
  const { section, method, data } = event;

  if (!isBalancesEvent(section)) {
    return false;
  }

  if ([BalancesEvents.Transfer].includes(method)) {
    const eventData = data.toJSON();
    const [from, to, value] = eventData;

    const extrinsicHash = extrinsic.hash.toJSON();
    const { section: extrinsicSection, method: extrinsicMethod } = extrinsic.method;

    addNativeTransfer(blockIndexer.blockHeight, {
      indexer: blockIndexer,
      eventSort,
      extrinsicIndex,
      extrinsicHash,
      module: extrinsicSection,
      method: extrinsicMethod,
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
