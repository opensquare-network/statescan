const { getTeleportCollection } = require("../../mongo");
const asyncLocalStorage = require("../../asynclocalstorage");

const Modules = Object.freeze({
  PolkadotXcm: "polkadotXcm",
});

const PolkadotXcmEvents = Object.freeze({
  Attempted: "Attempted",
});

async function updateTeleportCompletion(blockHeight, extrinsicIndex, complete) {
  const session = asyncLocalStorage.getStore();
  const col = await getTeleportCollection();
  await col.updateOne(
    { "indexer.blockHeight": blockHeight, "indexer.index": extrinsicIndex },
    {
      $set: {
        complete,
      },
    },
    { session }
  );
}

function isPolkadotXcmEvent(section) {
  return section === Modules.PolkadotXcm;
}

async function handleXcmAttemptedEvent(
  event,
  eventSort,
  extrinsicIndex,
  extrinsicHash,
  blockIndexer
) {
  const { section, method, data } = event;

  if (!isPolkadotXcmEvent(section)) {
    return false;
  }

  const eventData = data.toJSON();

  if ([PolkadotXcmEvents.Attempted].includes(method)) {
    const [result] = eventData;

    if (result.incomplete) {
      await updateTeleportCompletion(
        blockIndexer.blockHeight,
        extrinsicIndex,
        false
      );
    }

    if (result.complete) {
      await updateTeleportCompletion(
        blockIndexer.blockHeight,
        extrinsicIndex,
        true
      );
    }
  }

  return true;
}

module.exports = {
  handleXcmAttemptedEvent,
};
