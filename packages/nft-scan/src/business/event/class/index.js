const { handleAttributeCleared } = require("./attributeCleared");
const { handleAttributeSet } = require("./attributeSet");
const { handleThawed } = require("./thawed");
const { handleFrozen } = require("./frozen");
const { handleMetadataCleared } = require("./metadataCleared");
const { handleForceCreated } = require("./forceCreated");
const { handleDestroyed } = require("./destroyed");
const { handleMetadataSet } = require("./metadataSet");
const { handleCreated } = require("./created");
const { handleTeamChanged } = require("./teamChanged");
const { handleAssetStatusChanged } = require("./assetStatusChanged");
const { handleOwnerChanged } = require("./ownerChanged");
const { handleRedeposited } = require("./redeposited");
const { Modules, UniquesEvents } = require("@statescan/common");

async function handleEvent(event, indexer, blockEvents, extrinsic) {
  const { section, method } = event;
  if (Modules.Uniques !== section) {
    return;
  }

  if (UniquesEvents.ForceCreated === method) {
    await handleForceCreated(...arguments);
  } else if (UniquesEvents.Created === method) {
    await handleCreated(...arguments);
  } else if (UniquesEvents.AttributeCleared === method) {
    await handleAttributeCleared(...arguments);
  } else if (UniquesEvents.AttributeSet === method) {
    await handleAttributeSet(...arguments);
  } else if (
    [
      UniquesEvents.ClassMetadataSet,
      UniquesEvents.CollectionMetadataSet,
    ].includes(method)
  ) {
    await handleMetadataSet(...arguments);
  } else if (
    [UniquesEvents.ClassFrozen, UniquesEvents.CollectionFrozen].includes(method)
  ) {
    await handleFrozen(...arguments);
  } else if (
    [UniquesEvents.ClassThawed, UniquesEvents.CollectionThawed].includes(method)
  ) {
    await handleThawed(...arguments);
  } else if (UniquesEvents.Destroyed === method) {
    await handleDestroyed(...arguments);
  } else if (
    [
      UniquesEvents.ClassMetadataCleared,
      UniquesEvents.CollectionMetadataCleared,
    ].includes(method)
  ) {
    await handleMetadataCleared(...arguments);
  } else if (UniquesEvents.TeamChanged === method) {
    await handleTeamChanged(...arguments);
  } else if (
    [UniquesEvents.AssetStatusChanged, UniquesEvents.ItemStatusChanged] ===
    method
  ) {
    await handleAssetStatusChanged(...arguments);
  } else if (UniquesEvents.OwnerChanged === method) {
    await handleOwnerChanged(...arguments);
  } else if (UniquesEvents.Redeposited === method) {
    await handleRedeposited(...arguments);
  }
}

module.exports = {
  handleEvent,
};
