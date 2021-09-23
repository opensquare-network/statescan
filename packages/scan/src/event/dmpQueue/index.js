const { getTeleportCollection } = require("../../mongo");
const asyncLocalStorage = require("../../asynclocalstorage");

const Modules = Object.freeze({
  DmpQueue: "dmpQueue",
});

const DmpQueueEvents = Object.freeze({
  ExecutedDownward: "ExecutedDownward",
});

async function updateTeleportCompletion(
  blockHeight,
  extrinsicIndex,
  messageId,
  complete
) {
  const session = asyncLocalStorage.getStore();
  const col = await getTeleportCollection();
  await col.updateOne(
    {
      "indexer.blockHeight": blockHeight,
      "indexer.index": extrinsicIndex,
      messageId,
    },
    {
      $set: {
        complete,
      },
    },
    { session }
  );
}

function isDmpQueueEvent(section) {
  return section === Modules.DmpQueue;
}

async function handleExecutedDownwardEvent(
  event,
  eventSort,
  extrinsicIndex,
  extrinsicHash,
  blockIndexer
) {
  const { section, method, data } = event;

  if (!isDmpQueueEvent(section)) {
    return false;
  }

  const eventData = data.toJSON();

  if ([DmpQueueEvents.ExecutedDownward].includes(method)) {
    const [messageId, result] = eventData;

    if (result.incomplete) {
      await updateTeleportCompletion(
        blockIndexer.blockHeight,
        extrinsicIndex,
        messageId,
        false
      );
    }

    if (result.complete) {
      await updateTeleportCompletion(
        blockIndexer.blockHeight,
        extrinsicIndex,
        messageId,
        true
      );
    }
  }

  return true;
}

module.exports = {
  handleExecutedDownwardEvent,
};
