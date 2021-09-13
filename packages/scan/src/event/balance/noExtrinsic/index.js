const { handleTransfer } = require("./transfer");
const { isBalancesEvent, BalancesEvents } = require("../utils");

async function handleBalancesEventWithoutExtrinsic(
  event,
  eventSort,
  blockIndexer
) {
  const { section, method } = event;
  if (!isBalancesEvent(section)) {
    return false;
  }

  if ([BalancesEvents.Transfer].includes(method)) {
    await handleTransfer(...arguments);
  }
}

module.exports = {
  handleBalancesEventWithoutExtrinsic,
};
