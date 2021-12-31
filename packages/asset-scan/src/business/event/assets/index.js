const { handleTransferredApproved } = require("./transferedApproved");
const { Modules, AssetsEvents } = require("@statescan/common");
const { updateAssetAndTimeline } = require("./updateAssetAndTimeline");
const { handleDestroyed } = require("./destroyed");
const { handleTransferred } = require("./transferred");
const { saveAssetAddress } = require("./saveAssetAddress");
const { updateApproval } = require("./updateApproval");

function isAssetsEvent(section) {
  return section === Modules.Assets;
}

async function handleAssetsEvent(event, indexer, extrinsic) {
  const { section, method } = event;
  if (!isAssetsEvent(section)) {
    return;
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
    ].includes(method)
  ) {
    await updateAssetAndTimeline(...arguments);
  } else if (AssetsEvents.Destroyed === method) {
    await handleDestroyed(...arguments);
  } else if ([AssetsEvents.Issued, AssetsEvents.Burned].includes(method)) {
    await updateAssetAndTimeline(...arguments);
    await saveAssetAddress(...arguments);
  } else if ([AssetsEvents.Frozen, AssetsEvents.Thawed].includes(method)) {
    await saveAssetAddress(...arguments);
  } else if (AssetsEvents.Transferred === method) {
    await handleTransferred(...arguments);
  } else if (
    [AssetsEvents.ApprovedTransfer, AssetsEvents.ApprovalCancelled].includes(
      method
    )
  ) {
    await updateApproval(...arguments);
  } else if (AssetsEvents.TransferredApproved === method) {
    await handleTransferredApproved(event, indexer);
  }
}

module.exports = {
  handleAssetsEvent,
};
