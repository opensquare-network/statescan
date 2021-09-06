const { addAddress } = require("../../store/blockAddresses");

const Modules = Object.freeze({
  System: "system",
});

const SystemEvents = Object.freeze({
  NewAccount: "NewAccount",
  KilledAccount: "KilledAccount",
});

function isSystemEvent(section) {
  return section === Modules.System;
}

async function handleSystemEvent(
  event,
  eventSort,
  extrinsicIndex,
  extrinsicHash,
  blockIndexer
) {
  const { section, method, data } = event;

  if (!isSystemEvent(section)) {
    return false;
  }

  const eventData = data.toJSON();

  if ([SystemEvents.NewAccount, SystemEvents.KilledAccount].includes(method)) {
    const [address] = eventData;
    addAddress(blockIndexer.blockHeight, address);
  }

  return true;
}

module.exports = {
  handleSystemEvent,
};
