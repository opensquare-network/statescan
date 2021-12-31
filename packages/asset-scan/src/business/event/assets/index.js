const { Modules, AssetsEvents } = require("@statescan/common");
const { updateAssetAndTimeline } = require("./updateAssetAndTimeline");
const { handleDestroyed } = require("./destroyed");
const { handleTransferred } = require("./transferred");
const { updateAssetHolder } = require("./updateAssetHolder");
const { updateApproval } = require("./updateApproval");

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
    ].includes(method)
  ) {
    await updateAssetAndTimeline(...arguments);
  } else if (AssetsEvents.Destroyed === method) {
    await handleDestroyed(...arguments);
  } else if (
    [
      AssetsEvents.Issued,
      AssetsEvents.Burned,
    ].includes(method)
  ) {
    await updateAssetAndTimeline(...arguments);
    await updateAssetHolder(...arguments);
  } else if (
    [
      AssetsEvents.Frozen,
      AssetsEvents.Thawed,
    ].includes(method)
  ) {
    await updateAssetHolder(...arguments);
  } else if (AssetsEvents.Transferred === method) {
    await handleTransferred(...arguments);
  } else if (
    [
      AssetsEvents.ApprovedTransfer,
      AssetsEvents.ApprovalCancelled,
      AssetsEvents.TransferredApproved,
    ].inlcudes(method)
  ) {
    await updateApproval(...arguments);
  }

  return true;
}

module.exports = {
  handleAssetsEvent,
};
