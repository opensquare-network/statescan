const { addAssetId } = require("../../common/store/blockAsset");
const { addAssetAddresses } = require("../../common/store/blockAssetAddresses");
const { saveNewAssetTransfer } = require("../../../mongo/services/asset");

async function handleTransferred(event, indexer, extrinsic) {
  const eventData = event.data.toJSON();
  const [assetId, from, to, balance] = eventData;

  const extrinsicHash = extrinsic.hash.toJSON();
  const { section: extrinsicSection, method: extrinsicMethod } =
    extrinsic.method;

  addAssetId(indexer.blockHeight, assetId);

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
