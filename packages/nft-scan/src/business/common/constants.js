const Modules = Object.freeze({
  Uniques: "uniques",
});

const UniquesEvents = Object.freeze({
  Created: "Created",
  ForceCreated: "ForceCreated",
  Destroyed: "Destroyed",
  ClassFrozen: "ClassFrozen",
  ClassThawed: "ClassThawed",
  OwnerChanged: "OwnerChanged",
  TeamChanged: "TeamChanged",
  AssetStatusChanged: "AssetStatusChanged", // asset class status changed, should save old and new status
  ClassMetadataSet: "ClassMetadataSet",
  ClassMetadataCleared: "ClassMetadataCleared",
  AttributeSet: "AttributeSet",
  AttributeCleared: "AttributeCleared",
});

module.exports = {
  Modules,
  UniquesEvents,
};
