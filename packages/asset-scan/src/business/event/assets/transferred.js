const { saveAsset, saveNewAssetTransfer, updateOrCreateAssetHolder } = require("../../../mongo/services/asset");
const { getAssetsMetadata } = require("../../common/metadata");
const { getAssetsAsset } = require("../../common/assetStorage");
const { getAssetsAccount } = require("../../common/accountStorage");

async function handleTransferred(
  event,
  eventSort,
  extrinsicIndex,
  extrinsicHash,
  blockIndexer
) {
  const { section, method, data } = event;
  const eventData = data.toJSON();
  const [assetId, from, to, balance] = eventData;

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
    assetId,
    from,
    to,
    balance
  );

  const accountFrom = await getAssetsAccount(
    blockIndexer.blockHash,
    assetId,
    from
  );
  await updateOrCreateAssetHolder(blockIndexer, assetId, from, accountFrom);

  const accountTo = await getAssetsAccount(
    blockIndexer.blockHash,
    assetId,
    to
  );
  await updateOrCreateAssetHolder(blockIndexer, assetId, to, accountTo);
}

module.exports = {
  handleTransferred,
};
