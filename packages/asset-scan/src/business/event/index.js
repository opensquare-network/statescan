const {
  handleBalancesEventWithoutExtrinsic,
} = require("./balance/noExtrinsic");
const { handleAssetsEvent } = require("./assets");
const { handleBalancesEvent } = require("./balance");

async function handleEvents(events, blockIndexer, extrinsics) {
  if (events.length <= 0) {
    return;
  }

  for (let sort = 0; sort < events.length; sort++) {
    const { event, phase } = events[sort];
    let [phaseValue, extrinsicHash] = [null, null];
    if (!phase.isNull) {
      phaseValue = phase.value.toNumber();
      const extrinsic = extrinsics[phaseValue];
      extrinsicHash = extrinsic.hash.toHex();
      const extrinsicIndex = phaseValue;

      await handleAssetsEvent(
        event,
        sort,
        extrinsicIndex,
        extrinsicHash,
        blockIndexer
      );
      await handleBalancesEvent(
        event,
        sort,
        extrinsicIndex,
        extrinsicHash,
        blockIndexer
      );
    } else {
      await handleEventWithoutExtrinsic(event, sort, blockIndexer, events);
    }
  }
}

async function handleEventWithoutExtrinsic(
  event,
  eventSort,
  blockIndexer,
  blockEvents
) {
  await handleBalancesEventWithoutExtrinsic(...arguments);
}

module.exports = {
  handleEvents,
};
