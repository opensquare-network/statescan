const { Modules } = require("../../utils/constants");

function isBalancesEvent(section) {
  return section === Modules.Balances;
}

module.exports = {
  isBalancesEvent,
};
