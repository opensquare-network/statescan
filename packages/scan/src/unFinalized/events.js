const { getBlockIndexer } = require("../block/getBlockIndexer");
const { normalizeEvents } = require("../utils/normalize/event");
const { getUnFinalizedEventCollection } = require("../mongo/index");

function getEventDataFromBlockData(data) {
  const block = data.block.block;
  const events = data.events;

  const blockIndexer = getBlockIndexer(block);

  return normalizeEvents(events, blockIndexer, block.extrinsics);
}

function getEventsFromBlockDataArr(blockDataArr = []) {
  return blockDataArr.reduce((result, data) => {
    const events = getEventDataFromBlockData(data);
    return [...result, ...events];
  }, []);
}

async function saveBlocksEventData(blockDataArr = []) {
  const events = getEventsFromBlockDataArr(blockDataArr);

  const col = await getUnFinalizedEventCollection();
  const bulk = col.initializeUnorderedBulkOp();

  bulk.find({}).delete();
  for (const event of events) {
    bulk.insert(event);
  }

  await bulk.execute();
}

module.exports = {
  saveBlocksEventData,
};
