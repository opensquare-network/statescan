const { saveAsset, saveNewAssetTransfer, updateOrCreateAssetHolder } = require("../../../mongo/services/asset");
const { getAssetsMetadata } = require("../../common/metadata");
const { getAssetsAsset } = require("../../common/assetStorage");
const { getAssetsAccount } = require("../../common/accountStorage");

async function handleTransferred(
  event,
  eventSort,
  extrinsic,
  extrinsicIndex,
  blockIndexer
) {
  const eventData = event.data.toJSON();
  const [assetId, from, to, balance] = eventData;

  const extrinsicHash = extrinsic.hash.toJSON();
  const { section: extrinsicSection, method: extrinsicMethod } = extrinsic.method;

  const asset = await getAssetsAsset(blockIndexer.blockHash, assetId);
  const metadata = await getAssetsMetadata(blockIndexer.blockHash, assetId);

  await saveAsset(
    blockIndexer,
    assetId,
    asset,
    metadata
  );

  await saveNewAssetTransfer(
    blockIndexer,
    eventSort,
    extrinsicIndex,
    extrinsicHash,
    extrinsicSection,
    extrinsicMethod,
    assetId,
    from,
    to,
    balance
  );

  const assetOfFromAddress = await getAssetsAccount(
    blockIndexer.blockHash,
    assetId,
    from
  );
  await updateOrCreateAssetHolder(blockIndexer, assetId, from, assetOfFromAddress);

  const assetOfToAddress = await getAssetsAccount(
    blockIndexer.blockHash,
    assetId,
    to
  );
  await updateOrCreateAssetHolder(blockIndexer, assetId, to, assetOfToAddress);
}

module.exports = {
  handleTransferred,
};
