const {
  getTeleportCollection,
} = require("../../mongo");

const Modules = Object.freeze({
  PolkadotXcm: "polkadotXcm",
});

const PolkadotXcmEvents = Object.freeze({
  TeleportAssets: "teleportAssets",
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

function isPolkadotXcmEvent(section) {
  return section === Modules.PolkadotXcm;
}

async function handleExecutedDownwardEvent(
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

  if ([PolkadotXcmEvents.TeleportAssets].includes(method)) {
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
