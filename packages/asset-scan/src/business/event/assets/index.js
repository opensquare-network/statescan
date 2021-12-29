const { Modules, AssetsEvents } = require("@statescan/common");
const { handleAssetFrozen } = require("./assetFrozen");
const { handleAssetStatusChanged } = require("./assetStatusChanged");
const { handleAssetThawed } = require("./assetThawed");
const { handleBurned } = require("./burned");
const { handleCreated } = require("./created");
const { handleForceCreated } = require("./forceCreated");
const { handleIssued } = require("./issued");
const { handleMetadataSet } = require("./metadataSet");
const { handleOwnerChanged } = require("./ownerChanged");
const { handleTeamChanged } = require("./teamChanged");
const { handleDestroyed } = require("./destroyed");
const { handleTransferred } = require("./transferred");
const { handleApprovedTransfer } = require("./approvedTransfer");
const { handleApprovalCancelled } = require("./approvalCancelled");
const { handleTransferredApproved } = require("./transferredApproved");
const { handleFrozen } = require("./frozen");
const { handleThawed } = require("./thawed");

function isAssetsEvent(section) {
  return section === Modules.Assets;
}

async function handleAssetsEvent(
  event,
  eventSort,
  extrinsicIndex,
  extrinsicHash,
  blockIndexer
) {
  const { section, method, data } = event;

  if (!isAssetsEvent(section)) {
    return false;
  }

  if (AssetsEvents.Created === method) {
    await handleCreated(...arguments);
  } else if (AssetsEvents.ForceCreated === method) {
    await handleForceCreated(...arguments);
  } else if (AssetsEvents.MetadataSet === method) {
    await handleMetadataSet(...arguments);
  } else if (AssetsEvents.AssetStatusChanged === method) {
    await handleAssetStatusChanged(...arguments);
  } else if (AssetsEvents.TeamChanged === method) {
    await handleTeamChanged(...arguments);
  } else if (AssetsEvents.OwnerChanged === method) {
    await handleOwnerChanged(...arguments);
  } else if (AssetsEvents.AssetFrozen === method) {
    await handleAssetFrozen(...arguments);
  } else if (AssetsEvents.AssetThawed === method) {
    await handleAssetThawed(...arguments);
  } else if (AssetsEvents.Destroyed === method) {
    await handleDestroyed(...arguments);
  } else if (AssetsEvents.Issued === method) {
    await handleIssued(...arguments);
  } else if (AssetsEvents.Burned === method) {
    await handleBurned(...arguments);
  } else if (AssetsEvents.Transferred === method) {
    await handleTransferred(...arguments);
  } else if (AssetsEvents.ApprovedTransfer === method) {
    await handleApprovedTransfer(...arguments);
  } else if (AssetsEvents.ApprovalCancelled === method) {
    await handleApprovalCancelled(...arguments);
  } else if (AssetsEvents.TransferredApproved === method) {
    await handleTransferredApproved(...arguments);
  } else if (AssetsEvents.Frozen === method) {
    await handleFrozen(...arguments);
  } else if (AssetsEvents.Thawed === method) {
    await handleThawed(...arguments);
  }

  return true;
}

module.exports = {
  handleAssetsEvent,
};
