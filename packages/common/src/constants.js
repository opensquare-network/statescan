const Modules = Object.freeze({
  System: "system",
  Balances: "balances",
  Assets: "assets",
  Uniques: "uniques",
  DmpQueue: "dmpQueue",
  ParachainSystem: "parachainSystem",
});

const SystemEvents = Object.freeze({
  NewAccount: "NewAccount",
  KilledAccount: "KilledAccount",
  ExtrinsicSuccess: "ExtrinsicSuccess",
  ExtrinsicFailed: "ExtrinsicFailed",
});

const BalancesEvents = Object.freeze({
  Transfer: "Transfer",
  Reserved: "Reserved",
  Unreserved: "Unreserved",
  ReserveRepatriated: "ReserveRepatriated",
  BalanceSet: "BalanceSet",
});

const AssetsEvents = Object.freeze({
  // Asset state
  Created: "Created",
  MetadataSet: "MetadataSet",
  MetadataCleared: "MetadataCleared",
  ForceCreated: "ForceCreated",
  AssetStatusChanged: "AssetStatusChanged",
  TeamChanged: "TeamChanged",
  OwnerChanged: "OwnerChanged",
  AssetFrozen: "AssetFrozen",
  AssetThawed: "AssetThawed",
  Destroyed: "Destroyed",

  // Account
  Transferred: "Transferred",
  Frozen: "Frozen",
  Thawed: "Thawed",
  ApprovedTransfer: "ApprovedTransfer",
  ApprovalCancelled: "ApprovalCancelled",
  TransferredApproved: "TransferredApproved",

  // Asset & Account
  Issued: "Issued",
  Burned: "Burned",
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

const DmpQueueEvents = Object.freeze({
  ExecutedDownward: "ExecutedDownward",
});

const ParachainSystemMethods = Object.freeze({
  setValidationData: "setValidationData",
});

module.exports = {
  Modules,
  SystemEvents,
  BalancesEvents,
  AssetsEvents,
  UniquesEvents,
  TimelineItemTypes,
  DmpQueueEvents,
  ParachainSystemMethods,
};
