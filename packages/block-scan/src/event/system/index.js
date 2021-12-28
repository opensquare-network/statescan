const {
  Modules,
  SystemEvents,
  store: { addAddress },
} = require("@statescan/common");

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
