const {
  handleBalancesEventWithoutExtrinsic,
} = require("./balance/noExtrinsic");
const { handleAssetsEvent } = require("./assets");
const { handleBalancesEvent } = require("./balance");

async function handleEvents(events, blockIndexer, extrinsics) {
  if (events.length <= 0) {
    return;
  }

  for (let eventSort = 0; eventSort < events.length; eventSort++) {
    const { event, phase } = events[eventSort];
    if (!phase.isNull) {
      const extrinsicIndex = phase.value.toNumber();
      const extrinsic = extrinsics[extrinsicIndex];

      await handleAssetsEvent(
        event,
        eventSort,
        extrinsic,
        extrinsicIndex,
        blockIndexer
      );
      await handleBalancesEvent(
        event,
        eventSort,
        extrinsic,
        extrinsicIndex,
        blockIndexer
      );
    } else {
      await handleEventWithoutExtrinsic(event, eventSort, blockIndexer, events);
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
