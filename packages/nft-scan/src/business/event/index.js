const { handleEvent: handleClassEvent } = require("./class");
const { handleEvent: handleInstanceEvent } = require("./instance");

async function handleEvents(events, extrinsics, blockIndexer) {
  for (let sort = 0; sort < events.length; sort++) {
    const { event, phase } = events[sort];

    let indexer = {
      ...blockIndexer,
      eventIndex: sort,
    };

    let extrinsic;
    if (!phase.isNone) {
      const extrinsicIndex = phase.value.toNumber();
      indexer = {
        ...indexer,
        extrinsicIndex,
      };
      extrinsic = extrinsics[extrinsicIndex];
    }

    await handleClassEvent(event, indexer, events, extrinsic);
    await handleInstanceEvent(event, indexer, events, extrinsic);
  }
}

module.exports = {
  handleEvents,
};
