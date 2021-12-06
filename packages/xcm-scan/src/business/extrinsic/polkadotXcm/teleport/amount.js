const {
  teleportLogger,
  utils: { bigAdd },
} = require("@statescan/common");

function getAssetAmount(assetsArg, meta, indexer) {
  const type = meta.type.toString();

  if (["XcmVersionedMultiAssets", "VersionedMultiAssets"].includes(type)) {
    return getFromVersionedType(assetsArg, indexer);
  } else if ("Vec<MultiAsset>" === type) {
    return getFromVecMultiAsset(assetsArg, indexer);
  }

  teleportLogger.error(`unknown teleport assets arg type ${type} at`, indexer);
  return 0;
}

function getFromVecMultiAsset(assetsArg, indexer) {
  return assetsArg.reduce((result, asset) => {
    if (!asset.isConcreteFungible) {
      return result;
    }

    return bigAdd(result, asset.asConcreteFungible.amount.toString());
  }, 0);
}

function getFromV1(assetsArgV1, indexer) {
  return assetsArgV1.reduce((result, asset) => {
    if (!asset.id.isConcrete || !asset.fun.isFungible) {
      return result;
    }

    return bigAdd(result, asset.fun.asFungible.toString());
  }, 0);
}

function getFromVersionedType(assetsArg, indexer) {
  if (assetsArg.isV1) {
    return getFromV1(assetsArg.asV1);
  }

  if (!assetsArg.isV0) {
    teleportLogger.error(`teleport assets not isV0 at`, indexer);
    return;
  }

  const assetsArgV0 = assetsArg.asV0;
  return assetsArgV0.reduce((result, asset) => {
    if (!asset.isConcreteFungible) {
      return result;
    }

    return bigAdd(result, asset.asConcreteFungible.amount.toString());
  }, 0);
}

module.exports = {
  getAssetAmount,
};
