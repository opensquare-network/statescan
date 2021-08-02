const {
  getTeleportCollection,
} = require("../../mongo");
const asyncLocalStorage = require("../../asynclocalstorage");

const Modules = Object.freeze({
  DmpQueue: "dmpQueue",
});

const DmpQueueEvents = Object.freeze({
  ExecutedDownward: "ExecutedDownward",
});

async function updateTeleportCompletion(
  extrinsicHash,
  messageId,
  complete,
  fee,
) {
  const session = asyncLocalStorage.getStore();
  const col = await getTeleportCollection();
  const result = await col.updateOne(
    { extrinsicHash, messageId },
    {
      $set: {
        complete,
        fee,
      }
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
      await updateTeleportCompletion(extrinsicHash, messageId, false, result.incomplete);
    }

    if (result.complete) {
      await updateTeleportCompletion(extrinsicHash, messageId, true, result.complete);
    }
  }

  return true;
}

module.exports = {
  handleExecutedDownwardEvent,
};
