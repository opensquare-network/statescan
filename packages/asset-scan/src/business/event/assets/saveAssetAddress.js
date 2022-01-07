const { addAssetAddresses } = require("../../common/store/blockAssetAddresses");
const {
  store: { addAddress },
} = require("@statescan/common");

async function saveAssetAddress(event, indexer) {
  const eventData = event.data.toJSON();
  const [assetId, accountId] = eventData;

  addAssetAddresses(indexer.blockHeight, assetId, [accountId]);
  addAddress(indexer.blockHeight, accountId);
}

module.exports = {
  saveAssetAddress,
};
