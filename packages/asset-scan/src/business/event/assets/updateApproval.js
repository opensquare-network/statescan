const { addAssetAddresses } = require("../../common/store/blockAssetAddresses");
const { updateOrCreateApproval } = require("../../../mongo/services/asset");
const { getAssetsApprovals } = require("../../common/approvals");

async function updateApproval(event, indexer) {
  const eventData = event.data.toJSON();
  const [assetId, owner, delegate, destination] = eventData;

  addAssetAddresses(indexer.blockHeight, assetId, [
    owner,
    delegate,
    destination,
  ]);

  const approval = await getAssetsApprovals(
    indexer.blockHash,
    assetId,
    owner,
    delegate
  );

  await updateOrCreateApproval(indexer, assetId, owner, delegate, approval);
}

module.exports = {
  updateApproval,
};
