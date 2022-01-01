const { BalancesEvents } = require("@statescan/common");
const {
  store: { addAddresses },
} = require("@statescan/common");

function addTwoAccountsByEvent(event, indexer) {
  const { method, data } = event;
  if (
    ![BalancesEvents.Transfer, BalancesEvents.ReserveRepatriated].includes(
      method
    )
  ) {
    return;
  }

  const [from, to] = data.toJSON();
  addAddresses(indexer.blockHeight, [from, to]);
}

module.exports = {
  addTwoAccountsByEvent,
};
