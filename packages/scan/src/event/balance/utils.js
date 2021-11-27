const { Modules } = require("@statescan/utils");

function isBalancesEvent(section) {
  return section === Modules.Balances;
}

module.exports = {
  isBalancesEvent,
};
