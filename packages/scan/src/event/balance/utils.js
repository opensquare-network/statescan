const { Modules } = require("@statescan/common");

function isBalancesEvent(section) {
  return section === Modules.Balances;
}

module.exports = {
  isBalancesEvent,
};
