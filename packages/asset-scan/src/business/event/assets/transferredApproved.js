const { updateOrCreateApproval } = require("../../../mongo/services/asset");
const { getAssetsApprovals } = require("../../common/approvals");

async function handleTransferredApproved(event, indexer) {
  const eventData = event.data.toJSON();
  const [assetId, owner, delegate] = eventData;

  const approval = await getAssetsApprovals(
    indexer.blockHash,
    assetId,
    owner,
    delegate
  );

  await updateOrCreateApproval(indexer, assetId, owner, delegate, approval);
}

module.exports = {
  handleTransferredApproved,
};
