const Modules = Object.freeze({
  System: "system",
  Balances: "balances",
});

const SystemEvents = Object.freeze({
  NewAccount: "NewAccount",
  KilledAccount: "KilledAccount",
  ExtrinsicSuccess: "ExtrinsicSuccess",
  ExtrinsicFailed: "ExtrinsicFailed",
});

const BalancesEvents = Object.freeze({
  Transfer: "Transfer",
  Reserved: "Reserved",
  Unreserved: "Unreserved",
  ReserveRepatriated: "ReserveRepatriated",
  BalanceSet: "BalanceSet",
});

module.exports = {
  Modules,
  SystemEvents,
  BalancesEvents,
};
