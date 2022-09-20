const { ignoreInEventList } = require("../checkSystem");

function normalizeEvents(events, blockIndexer, extrinsics) {
  if (events.length <= 0) {
    return;
  }

  let result = [];
  for (let sort = 0; sort < events.length; sort++) {
    const wrappedEvent = events[sort];
    const listIgnore = ignoreInEventList(wrappedEvent);

    const { event, phase, topics } = wrappedEvent;
    const phaseType = phase.type;
    let [phaseValue, extrinsicHash] = [null, null];

    if (!phase.isNone) {
      phaseValue = phase.value.toNumber();
      const extrinsic = extrinsics[phaseValue];
      extrinsicHash = extrinsic.hash.toHex();
    }

    const index = parseInt(event.index);
    const meta = event.meta.toJSON();
    const section = event.section;
    const method = event.method;
    const data = event.data.toJSON();

    const isExtrinsicEvent = !phase.isNone;

    result.push({
      indexer: blockIndexer,
      extrinsicHash,
      phase: {
        type: phaseType,
        value: phaseValue,
      },
      sort,
      index,
      section,
      method,
      meta,
      data,
      topics,
      isExtrinsicEvent,
      listIgnore,
    });
  }

  return result;
}

module.exports = {
  normalizeEvents,
};
