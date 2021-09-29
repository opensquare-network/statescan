const { blake2AsHex } = require("@polkadot/util-crypto");
const { getTeleportCollection } = require("../../mongo");
const asyncLocalStorage = require("../../asynclocalstorage");
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

async function handleTeleportAssets(extrinsic, extrinsicIndexer, signer) {
  const hash = extrinsic.hash.toHex();
  const name = extrinsic.method.method;
  const section = extrinsic.method.section;

  if (section !== "polkadotXcm" || name !== "teleportAssets") {
    return;
  }

  const { args } = extrinsic.method.toJSON();

  const concreteFungible = args.assets.find(
    (item) => item.concreteFungible
  )?.concreteFungible;
  const beneficiary = args.beneficiary.x1?.accountId32.id;
  const amount = concreteFungible?.amount;

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
};
