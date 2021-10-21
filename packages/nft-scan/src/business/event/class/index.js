const { handleMetadataCleared } = require("./metadataCleared");
const { handleForceCreated } = require("./forceCreated");
const { handleDestroyed } = require("./destroyed");
const { handleMetadataSet } = require("./metadataSet");
const { handleCreated } = require("./created");
const { Modules, UniquesEvents } = require("../../common/constants");

async function handleEvent(event, indexer, blockEvents, extrinsic) {
  const { section, method } = event;
  if (Modules.Uniques !== section) {
    return;
  }

  if (UniquesEvents.ForceCreated === method) {
    await handleForceCreated(...arguments);
  } else if (UniquesEvents.Created === method) {
    await handleCreated(...arguments);
  } else if (UniquesEvents.ClassMetadataSet === method) {
    await handleMetadataSet(...arguments);
  } else if (UniquesEvents.Destroyed === method) {
    await handleDestroyed(...arguments);
  } else if (UniquesEvents.ClassMetadataCleared === method) {
    await handleMetadataCleared(...arguments);
  }
}

module.exports = {
  handleEvent,
};
