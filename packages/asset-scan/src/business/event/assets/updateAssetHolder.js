const { updateOrCreateAssetHolder } = require("../../../mongo/services/asset");
const { getAssetsAccount } = require("../../common/accountStorage");

async function updateAssetHolder(event, indexer, extrinsic) {
  const eventData = event.data.toJSON();
  const [assetId, accountId] = eventData;

  const accountAsset = await getAssetsAccount(
    indexer.blockHash,
    assetId,
    accountId
  );
  await updateOrCreateAssetHolder(indexer, assetId, accountId, accountAsset);
}

module.exports = {
  updateAssetHolder,
};
