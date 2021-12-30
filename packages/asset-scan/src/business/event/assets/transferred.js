const {
  saveAsset,
  saveNewAssetTransfer,
  updateOrCreateAssetHolder,
} = require("../../../mongo/services/asset");
const { getAssetsMetadata } = require("../../common/metadata");
const { getAssetsAsset } = require("../../common/assetStorage");
const { getAssetsAccount } = require("../../common/accountStorage");

async function handleTransferred(event, indexer, extrinsic) {
  const eventData = event.data.toJSON();
  const [assetId, from, to, balance] = eventData;

  const extrinsicHash = extrinsic.hash.toJSON();
  const { section: extrinsicSection, method: extrinsicMethod } =
    extrinsic.method;

  const asset = await getAssetsAsset(indexer.blockHash, assetId);
  const metadata = await getAssetsMetadata(indexer.blockHash, assetId);

  // fixme: why do we update asset info when asset transferred?
  await saveAsset(indexer, assetId, asset, metadata);

  await saveNewAssetTransfer(
    indexer,
    extrinsicHash,
    extrinsicSection,
    extrinsicMethod,
    assetId,
    from,
    to,
    balance
  );

  const assetOfFromAddress = await getAssetsAccount(
    indexer.blockHash,
    assetId,
    from
  );
  await updateOrCreateAssetHolder(indexer, assetId, from, assetOfFromAddress);

  const assetOfToAddress = await getAssetsAccount(
    indexer.blockHash,
    assetId,
    to
  );
  await updateOrCreateAssetHolder(indexer, assetId, to, assetOfToAddress);
}

module.exports = {
  handleTransferred,
};
