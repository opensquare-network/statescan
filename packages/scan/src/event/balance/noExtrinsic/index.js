const { BalancesEvents } = require("../../../utils/constants");
const { handleTransfer } = require("./transfer");
const { isBalancesEvent } = require("../utils");

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
