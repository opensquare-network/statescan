const { addTwoAccountsByEvent } = require("./twoAccount");
const { addSingleAccountByEvent } = require("./singleAccount");
const { handleTransfer } = require("./transfer");
const { Modules, BalancesEvents } = require("@statescan/common");

async function handleBalancesEvent(event, indexer, extrinsic) {
  const { section, method } = event;

  if (section !== Modules.Balances) {
    return false;
  }

  addSingleAccountByEvent(...arguments);
  addTwoAccountsByEvent(...arguments);

  if (BalancesEvents.Transfer === method) {
    await handleTransfer(...arguments);
  }
}

module.exports = {
  handleBalancesEvent,
};
