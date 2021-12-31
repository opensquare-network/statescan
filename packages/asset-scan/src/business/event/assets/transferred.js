const { addAssetAddresses } = require("../../common/store/blockAssetAddresses");
const {
  saveAsset,
  saveNewAssetTransfer,
} = require("../../../mongo/services/asset");
const { getAssetsMetadata } = require("../../common/metadata");
const { getAssetsAsset } = require("../../common/assetStorage");

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

  addAssetAddresses(indexer.blockHeight, assetId, [from, to]);
}

module.exports = {
  handleTransferred,
};
