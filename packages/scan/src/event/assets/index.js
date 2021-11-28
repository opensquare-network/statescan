const { Modules, AssetsEvents } = require("@statescan/common");
const { addAddresses } = require("../../store/blockAddresses");
const { addAddress } = require("../../store/blockAddresses");
const {
  updateOrCreateApproval,
  updateOrCreateAssetHolder,
  saveNewAssetTransfer,
  updateOrCreateAsset,
  saveAssetTimeline,
  destroyAsset,
} = require("./db");

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

  const eventData = data.toJSON();

  // Save assets
  if (
    [
      AssetsEvents.Created,
      AssetsEvents.ForceCreated,
      AssetsEvents.MetadataSet,
      AssetsEvents.Issued,
      AssetsEvents.Burned,
      AssetsEvents.AssetStatusChanged,
      AssetsEvents.TeamChanged,
      AssetsEvents.OwnerChanged,
      AssetsEvents.AssetFrozen,
      AssetsEvents.AssetThawed,
    ].includes(method)
  ) {
    const [assetId] = eventData;
    await updateOrCreateAsset(blockIndexer, assetId);
    await saveAssetTimeline(
      blockIndexer,
      assetId,
      section,
      method,
      eventData,
      eventSort,
      extrinsicIndex,
      extrinsicHash
    );
  }

  if (method === AssetsEvents.Destroyed) {
    const [assetId] = eventData;
    await saveAssetTimeline(
      blockIndexer,
      assetId,
      section,
      method,
      eventData,
      eventSort,
      extrinsicIndex,
      extrinsicHash
    );
    await destroyAsset(blockIndexer, assetId);
  }

  if (method === AssetsEvents.Transferred) {
    const [assetId] = eventData;
    await updateOrCreateAsset(blockIndexer, assetId);
  }

  // Save transfers
  if (method === AssetsEvents.Transferred) {
    const [assetId, from, to, balance] = eventData;
    await saveNewAssetTransfer(
      blockIndexer,
      eventSort,
      extrinsicIndex,
      extrinsicHash,
      assetId,
      from,
      to,
      balance
    );
  }

  // Save asset holders
  if (
    [
      AssetsEvents.Issued,
      AssetsEvents.Burned,
      AssetsEvents.Frozen,
      AssetsEvents.Thawed,
    ].includes(method)
  ) {
    const [assetId, accountId] = eventData;
    addAddress(blockIndexer.blockHeight, accountId);
    await updateOrCreateAssetHolder(blockIndexer, assetId, accountId);
  }

  if (method === AssetsEvents.Transferred) {
    const [assetId, from, to] = eventData;
    addAddresses(blockIndexer.blockHeight, [from, to]);
    await updateOrCreateAssetHolder(blockIndexer, assetId, from);
    await updateOrCreateAssetHolder(blockIndexer, assetId, to);
  }

  // Save approved
  if (
    [
      AssetsEvents.ApprovedTransfer,
      AssetsEvents.ApprovalCancelled,
      AssetsEvents.TransferredApproved,
    ].includes(method)
  ) {
    const [assetId, owner, delegate] = eventData;
    await updateOrCreateApproval(blockIndexer, assetId, owner, delegate);
  }

  return true;
}

module.exports = {
  handleAssetsEvent,
};
