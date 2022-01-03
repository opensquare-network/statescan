const { BalancesEvents } = require("@statescan/common");
const {
  store: { addAddress },
} = require("@statescan/common");

function addSingleAccountByEvent(event, indexer) {
  const { method, data } = event;
  if (
    ![
      BalancesEvents.Endowed,
      BalancesEvents.BalanceSet,
      BalancesEvents.DustLost,
      BalancesEvents.Reserved,
      BalancesEvents.Unreserved,
      BalancesEvents.Deposit,
      BalancesEvents.Withdraw,
      BalancesEvents.Slashed,
    ].includes(method)
  ) {
    return;
  }

  const [address] = data.toJSON();
  addAddress(indexer.blockHeight, address);
}

module.exports = {
  addSingleAccountByEvent,
};
