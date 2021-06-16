const { getEventCollection } = require("../mongo");
const { handleAssetsEvent } = require("./assets");

async function handleEvents(events, blockIndexer, extrinsics) {
  if (events.length <= 0) {
    return;
  }

  const eventCol = await getEventCollection();
  const bulk = eventCol.initializeOrderedBulkOp();

  for (let sort = 0; sort < events.length; sort++) {
    const { event, phase, topics } = events[sort];
    const phaseType = phase.type;
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
    }

    const index = parseInt(event.index);
    const meta = event.meta.toJSON();
    const section = event.section;
    const method = event.method;
    const data = event.data.toJSON();

    bulk.insert({
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
    });
  }

  const result = await bulk.execute();
  if (result.result && !result.result.ok) {
    // TODO: 处理插入不成功的情况
  }
}

module.exports = {
  handleEvents,
};
