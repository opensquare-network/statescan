const { blake2AsHex } = require("@polkadot/util-crypto");
const { getTeleportCollection } = require("../../mongo");
const asyncLocalStorage = require("../../asynclocalstorage");
const { teleportLogger } = require("../../logger");
const { bigAdd } = require("../../utils");
const { addAddress } = require("../../store/blockAddresses");
const { getRegistryByHeight } = require("../../utils/registry");
const { logger } = require("../../logger");

async function saveNewTeleportAssetOut(
  extrinsicIndexer,
  extrinsicHash,
  signer,
  beneficiary,
  amount,
  teleportAssetJson
) {
  const session = asyncLocalStorage.getStore();
  const col = await getTeleportCollection();

  await col.insertOne(
    {
      indexer: extrinsicIndexer,
      teleportDirection: "out",
      teleportAsset: teleportAssetJson,
      signer,
      beneficiary,
      amount,
    },
    { session }
  );
}

function extractTeleportFromOneMsg(
  registry,
  downwardMessage,
  extrinsicIndexer
) {
  const pubSentAt = downwardMessage.pubSentAt.toJSON();
  const pubMsg = downwardMessage.pubMsg;
  const messageId = blake2AsHex(pubMsg.toHex());

  const versionedXcm = registry.createType("VersionedXcm", pubMsg, true);
  if (!versionedXcm.isV0) {
    return;
  }

  const v0Xcm = versionedXcm.asV0;
  if (!v0Xcm.isReceiveTeleportedAsset) {
    return;
  }

  const teleportAsset = v0Xcm.asReceiveTeleportedAsset;
  const teleportAssetJson = teleportAsset.toJSON();

  const concreteFungible = teleportAssetJson.assets.find(
    (item) => item.concreteFungible
  )?.concreteFungible;
  const depositAsset = teleportAssetJson.effects.find(
    (item) => item.depositAsset
  )?.depositAsset;
  const buyExecution = teleportAssetJson.effects.find(
    (item) => item.buyExecution
  ).buyExecution;

  const amount = concreteFungible?.amount;
  const beneficiary =
    depositAsset?.dest.x1?.accountId32.id ||
    depositAsset?.dest.x2?.[1].accountId32.id;
  const fee = buyExecution?.debt;

  if (amount === undefined || beneficiary === undefined) {
    logger.error(`Downward message parse failed:`, extrinsicIndexer);
  }

  addAddress(extrinsicIndexer.blockHeight, beneficiary);

  return {
    indexer: extrinsicIndexer,
    teleportDirection: "in",
    messageId,
    pubSentAt,
    beneficiary,
    amount,
    fee,
  };
}

function extractTeleportAssets(
  registry,
  downwardMessages = [],
  extrinsicIndexer
) {
  return downwardMessages.reduce((result, msg) => {
    const extracted = extractTeleportFromOneMsg(
      registry,
      msg,
      extrinsicIndexer
    );
    if (extracted) {
      return [...result, extracted];
    }

    return result;
  }, []);
}

async function handleTeleportAssetDownwardMessage(extrinsic, extrinsicIndexer) {
  const name = extrinsic.method.method;
  const section = extrinsic.method.section;

  if (section !== "parachainSystem" || name !== "setValidationData") {
    return;
  }

  const { args } = extrinsic.method;
  if (!args?.length) {
    return;
  }

  const downwardMessages = args[0]?.get("downwardMessages");
  if (!downwardMessages?.length) {
    return;
  }

  const registry = await getRegistryByHeight(extrinsicIndexer.blockHeight);
  const teleports = extractTeleportAssets(
    registry,
    downwardMessages,
    extrinsicIndexer
  );

  if (teleports.length <= 0) {
    return;
  }

  const col = await getTeleportCollection();
  const bulk = col.initializeUnorderedBulkOp();
  for (const teleport of teleports) {
    bulk.insert(teleport);
  }
  const session = asyncLocalStorage.getStore();
  await bulk.execute({ session });
}

function extractTeleportAssetsFromExtrinsic(extrinsic, indexer) {
  const destArg = extrinsic.method.args[0];
  // FIXME: currently we only handle x1 and to parent teleport. Try to parse and support more.
  if (!destArg.isX1 || !destArg.asX1.isParent) {
    teleportLogger.info(`Get not support teleport at ${indexer.blockHeight}`);
    // todo: log this block height and see what happens on it later
    return {
      isSupported: false,
    };
  }

  const beneficiaryArg = extrinsic.method.args[1];
  if (!beneficiaryArg.isX1 || !beneficiaryArg.asX1.isAccountId32) {
    return {
      isSupported: false,
    };
  }

  const beneficiary = beneficiaryArg.asX1.asAccountId32.id.toString();

  let amount;
  let hasFungible = false;
  const assetsArg = extrinsic.method.args[2];
  const assetsArgTypeName = extrinsic.method.meta.args[2].type.toString();
  if ("Vec<MultiAsset>" === assetsArgTypeName) {
    amount = assetsArg.reduce((result, asset) => {
      // fixme: improve the way to check asset
      if (asset.isConcreteFungible) {
        hasFungible = true;
        return bigAdd(result, asset.asConcreteFungible.amount.toString());
      }

      return result;
    }, "0");
  } else if ("VersionedMultiAssets" === assetsArgTypeName) {
    teleportLogger.info(
      `teleport assets with type VersionedMultiAssets at ${indexer.blockHeight}`
    );

    amount = assetsArg.reduce((result, asset) => {
      // fixme: improve the way to check asset
      if (!asset.isV0) {
        return result;
      }

      if (asset.asV0.isConcreteFungible) {
        hasFungible = true;
        return bigAdd(result, asset.asV0.asConcreteFungible.amount.toString());
      }

      return result;
    }, "0");
  }

  return {
    isSupported: true,
    hasFungible,
    data: {
      beneficiary,
      amount,
    },
  };
}

async function handleTeleportAssets(extrinsic, extrinsicIndexer, signer) {
  const hash = extrinsic.hash.toHex();
  const name = extrinsic.method.method;
  const section = extrinsic.method.section;

  if (section !== "polkadotXcm" || name !== "teleportAssets") {
    return;
  }

  const info = extractTeleportAssetsFromExtrinsic(extrinsic, extrinsicIndexer);
  if (!info.isSupported) {
    return;
  }

  if (!info.hasFungible) {
    teleportLogger.info(`no fungible at ${extrinsicIndexer.blockHeight}`);
    return;
  }

  const { beneficiary, amount } = info.data;

  const { args } = extrinsic.method.toJSON();
  await saveNewTeleportAssetOut(
    extrinsicIndexer,
    hash,
    signer,
    beneficiary,
    amount,
    args
  );
}

module.exports = {
  handleTeleportAssetDownwardMessage,
  handleTeleportAssets,
  extractTeleportFromOneMsg,
  extractTeleportAssetsFromExtrinsic,
};
