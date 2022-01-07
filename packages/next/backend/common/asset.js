const uniqBy = require("lodash.uniqby");
const { getAssetCollection } = require("../mongo");

function assetKey(assetId, assetHeight) {
  return `${assetId}-${assetHeight}`;
}

function getUniqueAssetKeys(objects, assetIdField, assetHeightField) {
  return uniqBy(
    objects?.map(item => [
      item[assetIdField],
      item[assetHeightField]
    ]),
    item => assetKey(item[0], item[1])
  ).map(item => ({
    assetId: item[0],
    "createdAt.blockHeight": item[1],
  })) || [];
}

async function findAssetsForObjects(objects, assetIdField, assetHeightField) {
  const $or = getUniqueAssetKeys(objects, assetIdField, assetHeightField);

  if (!$or?.length) {
    return [];
  }

  const col = await getAssetCollection();
  return await col.find({ $or }).toArray();
}

async function populateAssetInfo(objects) {
  const assets = await findAssetsForObjects(objects, "assetId", "assetHeight");
  const assetsMap = new Map(assets.map(
    item => [assetKey(item.assetId, item.createdAt.blockHeight), item]
  ));

  return objects.map(item => {
    const asset = assetsMap.get(assetKey(item.assetId, item.assetHeight));
    return ({
      ...item,
      assetCreatedAt: asset?.createdAt,
      assetDestroyedAt: asset?.destroyedAt,
      assetSymbol: asset?.symbol,
      assetName: asset?.name,
      assetDecimals: asset?.decimals,
    });
  });
}

module.exports = {
  populateAssetInfo,
};
