const {
  queryAndSaveAssetAccountsToDb,
} = require("../../../service/asset/syncAssetAddresses");
const {
  destroyAsset,
  saveAssetTimeline,
} = require("../../../mongo/services/asset");
const { getAssetsMetadata } = require("../../common/metadata");
const { getAssetsAsset } = require("../../common/assetStorage");

async function handleDestroyed(event, indexer, extrinsic) {
  await queryAndSaveAssetAccountsToDb(indexer);

  const { section, method, data } = event;
  const eventData = data.toJSON();
  const [assetId] = eventData;

  const extrinsicHash = extrinsic.hash.toJSON();

  const asset = await getAssetsAsset(indexer.blockHash, assetId);
  const metadata = await getAssetsMetadata(indexer.blockHash, assetId);

  await saveAssetTimeline(
    indexer,
    assetId,
    section,
    method,
    eventData,
    extrinsicHash,
    asset,
    metadata
  );
  await destroyAsset(indexer, assetId);
}

module.exports = {
  handleDestroyed,
};
