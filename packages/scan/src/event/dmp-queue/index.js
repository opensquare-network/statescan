const {
  getTeleportCollection,
} = require("../../mongo");

const Modules = Object.freeze({
  DmpQueue: "dmpQueue",
});

const DmpQueueEvents = Object.freeze({
  ExecutedDownward: "ExecutedDownward",
});

async function updateTeleportCompletion(
  extrinsicHash,
  complete,
) {
  const col = await getTeleportCollection();
  const result = await col.updateOne(
    { extrinsicHash },
    {
      $set: {
        complete
      }
    }
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

    if (result.imcomplete) {
      await updateTeleportCompletion(extrinsicHash, false);
    }

    if (result.complete) {
      await updateTeleportCompletion(extrinsicHash, true);
    }
  }

  return true;
}

module.exports = {
  handleExecutedDownwardEvent,
};
