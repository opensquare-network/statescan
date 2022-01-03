const assetAddressesMap = {};

function addAssetAddresses(height, assetId, addrs = []) {
  if (addrs.length <= 0) {
    return;
  }

  if (!assetAddressesMap[height]) {
    assetAddressesMap[height] = {
      [assetId]: addrs,
    };

    return;
  }

  if (!assetAddressesMap[height][assetId]) {
    assetAddressesMap[height][assetId] = [];
  }

  const addrSet = new Set([...assetAddressesMap[height][assetId], ...addrs]);
  assetAddressesMap[height][assetId] = [...addrSet];
}

function getAssetAddresses(height) {
  return assetAddressesMap[height];
}

function clearAssetAddresses(height) {
  delete assetAddressesMap[height];
}

module.exports = {
  addAssetAddresses,
  getAssetAddresses,
  clearAssetAddresses,
};
