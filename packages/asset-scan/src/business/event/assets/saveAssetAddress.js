const { addAssetAddresses } = require("../../common/store/blockAssetAddresses");

async function saveAssetAddress(event, indexer) {
  const eventData = event.data.toJSON();
  const [assetId, accountId] = eventData;

  addAssetAddresses(indexer.blockHeight, assetId, [accountId]);
}

module.exports = {
  saveAssetAddress,
};
