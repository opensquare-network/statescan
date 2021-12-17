const { teleportLogger } = require("@statescan/common");

function isSupportedDest(destArg, meta, indexer) {
  const type = meta.type.toString();

  if ("MultiLocation" === type) {
    return checkByMultiLocation(destArg, indexer);
  } else if (
    ["XcmVersionedMultiLocation", "VersionedMultiLocation"].includes(type)
  ) {
    return checkByXcmVersionedMultiLocation(destArg, indexer);
  }

  teleportLogger.error(`unknown teleport dest arg type ${type} at`, indexer);
  return false;
}

function checkByMultiLocation(destArg, indexer) {
  if (!destArg.isX1 || !destArg.asX1.isParent) {
    teleportLogger.error(`not x1 parent teleport from asset chain at`, indexer);
    return false;
  }

  return true;
}

function checkByXcmVersionedMultiLocation(destArg, indexer) {
  if (destArg.isV1) {
    const destArgV1 = destArg.asV1;
    const isToParent =
      destArgV1.parents.toNumber() === 1 && destArgV1.interior.isHere;
    if (!isToParent) {
      teleportLogger.error(`teleport dest v1 not parent context at`, indexer);
    }

    return isToParent;
  }

  if (!destArg.isV0) {
    teleportLogger.error(`teleport dest not supported version at`, indexer);
    return false;
  }

  const destArgV0 = destArg.asV0;
  if (!destArgV0.isX1 || !destArgV0.asX1.isParent) {
    teleportLogger.error(`not x1 parent teleport from asset chain at`, indexer);
    return false;
  }

  return true;
}

module.exports = {
  isSupportedDest,
};
