const { updateOrCreateApproval } = require("../../../mongo/services/asset");
const { getAssetsApprovals } = require("../../common/approvals");

async function handleApprovedTransfer(
  event,
  eventSort,
  extrinsic,
  extrinsicIndex,
  blockIndexer
) {
  const { section, method, data } = event;
  const eventData = data.toJSON();
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
  handleApprovedTransfer,
};
