const { handleAssetsEvent } = require("./assets");
const { handleBalancesEvent } = require("./balance");

async function handleEvents(events, blockIndexer, extrinsics) {
  if (events.length <= 0) {
    return;
  }

  for (let eventSort = 0; eventSort < events.length; eventSort++) {
    let indexer = {
      ...blockIndexer,
      eventIndex: eventSort,
    };

    const { event, phase } = events[eventSort];
    let extrinsic;
    if (!phase.isNone) {
      const extrinsicIndex = phase.value.toNumber();
      indexer = {
        ...indexer,
        extrinsicIndex,
      };
      extrinsic = extrinsics[extrinsicIndex];

      await handleAssetsEvent(event, indexer, extrinsic);
    }

    await handleBalancesEvent(event, indexer, extrinsic);
  }
}

module.exports = {
  handleEvents,
};
