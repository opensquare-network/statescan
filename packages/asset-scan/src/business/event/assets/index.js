const { updateAssetAndTimeline } = require("./updateAssetAndTimeline");
const { Modules, AssetsEvents } = require("@statescan/common");
const { handleBurned } = require("./burned");
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

async function handleAssetsEvent(event, indexer, extrinsic) {
  const { section, method } = event;
  if (!isAssetsEvent(section)) {
    return false;
  }

  if (
    [
      AssetsEvents.Created,
      AssetsEvents.ForceCreated,
      AssetsEvents.MetadataSet,
      AssetsEvents.AssetStatusChanged,
      AssetsEvents.TeamChanged,
      AssetsEvents.OwnerChanged,
      AssetsEvents.AssetFrozen,
      AssetsEvents.AssetThawed,
      AssetsEvents.Issued,
    ].includes(method)
  ) {
    await updateAssetAndTimeline(...arguments);
  } else if (AssetsEvents.Destroyed === method) {
    await handleDestroyed(...arguments);
  } else if (AssetsEvents.Frozen === method) {
    await handleFrozen(...arguments);
  } else if (AssetsEvents.Burned === method) {
    // todo: we need update the burned account asset balance
    // fixme: 1. update the burned account balance; 2. don't have to save timeline
    await handleBurned(...arguments);
  } else if (AssetsEvents.Transferred === method) {
    await handleTransferred(...arguments);
  } else if (AssetsEvents.ApprovedTransfer === method) {
    await handleApprovedTransfer(...arguments);
  } else if (AssetsEvents.ApprovalCancelled === method) {
    await handleApprovalCancelled(...arguments);
  } else if (AssetsEvents.TransferredApproved === method) {
    await handleTransferredApproved(...arguments);
  } else if (AssetsEvents.Thawed === method) {
    /**
     * fixme:
     * this event present no effect with asset detail change, so we should not save it to timeline and don't have
     * to update the asset
     */
    await handleThawed(...arguments);
  }

  return true;
}

module.exports = {
  handleAssetsEvent,
};
