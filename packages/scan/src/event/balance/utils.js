const Modules = Object.freeze({
  Balances: "balances",
});

const BalancesEvents = Object.freeze({
  Transfer: "Transfer",
  Reserved: "Reserved",
  Unreserved: "Unreserved",
  ReserveRepatriated: "ReserveRepatriated",
  BalanceSet: "BalanceSet",
});

function isBalancesEvent(section) {
  return section === Modules.Balances;
}

module.exports = {
  BalancesEvents,
  isBalancesEvent,
};
