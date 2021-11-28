const { Modules, SystemEvents, BalancesEvents } = require("@statescan/common");

function ignoreInExtrinsicList(call) {
  const { section, method } = call;
  return (
    (section === "parachainSystem" && method === "setValidationData") ||
    (section === "timestamp" && method === "set")
  );
}

function ignoreInEventList(wrappedEvent) {
  const { event, phase } = wrappedEvent;
  const { section, method } = event;

  if (
    Modules.System === section &&
    [SystemEvents.ExtrinsicSuccess, SystemEvents.ExtrinsicFailed].includes(
      method
    )
  ) {
    return true;
  }

  if (
    phase.isNull &&
    Modules.Balances === section &&
    [BalancesEvents.Transfer].includes(method)
  ) {
    return true;
  }

  return false;
}

module.exports = {
  ignoreInExtrinsicList,
  ignoreInEventList,
};
