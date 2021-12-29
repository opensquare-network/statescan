const { updateOrCreateApproval } = require("../../../mongo/services/asset");
const { getAssetsApprovals } = require("../../common/approvals");

async function handleTransferredApproved(
  event,
  eventSort,
  extrinsic,
  extrinsicIndex,
  blockIndexer
) {
  const eventData = event.data.toJSON();
  const [assetId, owner, delegate] = eventData;

  const approval = await getAssetsApprovals(
    blockIndexer.blockHash,
    assetId,
    owner,
    delegate
  );

  await updateOrCreateApproval(blockIndexer, assetId, owner, delegate, approval);

}

module.exports = {
  handleTransferredApproved,
};
