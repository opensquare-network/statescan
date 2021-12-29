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

  const extrinsicHash = extrinsic.hash.toJSON();
  const { section: extrinsicSection, method: extrinsicMethod } = extrinsic.method;

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
