const {
  getTeleportCollection,
} = require("../../mongo");
const asyncLocalStorage = require("../../asynclocalstorage");

const Modules = Object.freeze({
  PolkadotXcm: "polkadotXcm",
});

const PolkadotXcmEvents = Object.freeze({
  Attempted: "Attempted",
});

async function updateTeleportCompletion(
  extrinsicHash,
  complete,
) {
  const session = asyncLocalStorage.getStore();
  const col = await getTeleportCollection();
  const result = await col.updateOne(
    { extrinsicHash },
    {
      $set: {
        complete
      }
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
      await updateTeleportCompletion(extrinsicHash, false);
    }

    if (result.complete) {
      await updateTeleportCompletion(extrinsicHash, true);
    }
  }

  return true;
}

module.exports = {
  handleXcmAttemptedEvent,
};
