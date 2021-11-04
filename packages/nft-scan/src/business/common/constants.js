const Modules = Object.freeze({
  Uniques: "uniques",
});

const UniquesEvents = Object.freeze({
  // class events
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
  Redeposited: "Redeposited",

  // instance events
  Issued: "Issued",
  Transferred: "Transferred",
  ApprovedTransfer: "ApprovedTransfer",
  ApprovalCancelled: "ApprovalCancelled",
  Burned: "Burned",
  Frozen: "Frozen",
  Thawed: "Thawed",
  MetadataSet: "MetadataSet",
  MetadataCleared: "MetadataCleared",

  // shared events
  AttributeSet: "AttributeSet",
  AttributeCleared: "AttributeCleared",
});

const TimelineItemTypes = Object.freeze({
  extrinsic: "extrinsic",
  event: "event",
});

module.exports = {
  Modules,
  UniquesEvents,
  TimelineItemTypes,
};
