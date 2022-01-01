const { addAssetTransfer } = require("../../common/store/assetTransfer");
const { addAssetId } = require("../../common/store/blockAsset");
const { addAssetAddresses } = require("../../common/store/blockAssetAddresses");
const {
  store: { addAddresses },
} = require("@statescan/common");

async function handleTransferred(event, indexer, extrinsic) {
  const eventData = event.data.toJSON();
  const [assetId, from, to, balance] = eventData;

  const extrinsicHash = extrinsic.hash.toJSON();
  const { section, method } = extrinsic.method;

  addAssetId(indexer.blockHeight, assetId);
  addAssetTransfer(indexer.blockHash, {
    indexer,
    extrinsicHash,
    module: section,
    method,
    assetId,
    from,
    to,
    balance,
    listIgnore: false,
  });

  addAssetAddresses(indexer.blockHeight, assetId, [from, to]);
  addAddresses(indexer.blockHeight, [from, to]);
}

module.exports = {
  handleTransferred,
};
