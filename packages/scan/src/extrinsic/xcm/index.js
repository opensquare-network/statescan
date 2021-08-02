const { blake2AsHex } = require("@polkadot/util-crypto");
const {
  getTeleportCollection,
} = require("../../mongo");
const { getApi } = require("../../api");
const asyncLocalStorage = require("../../asynclocalstorage");

async function saveNewTeleportAssetIn(extrinsicIndexer, extrinsicHash, messageId, pubSentAt, beneficiary, amount, teleportAssetJson) {
  const session = asyncLocalStorage.getStore();
  const col = await getTeleportCollection();

  await col.insertOne({
    indexer: extrinsicIndexer,
    extrinsicHash,
    teleportDirection: "in",
    messageId,
    pubSentAt,
    teleportAsset: teleportAssetJson,
    beneficiary,
    amount,
  }, { session });
}

async function saveNewTeleportAssetOut(extrinsicIndexer, extrinsicHash, beneficiary, amount, teleportAssetJson) {
  const session = asyncLocalStorage.getStore();
  const col = await getTeleportCollection();

  await col.insertOne({
    indexer: extrinsicIndexer,
    extrinsicHash,
    teleportDirection: "out",
    teleportAsset: teleportAssetJson,
    beneficiary,
    amount,
  }, { session });
}

async function handleTeleportAssetDownwardMessage(
  extrinsic,
  extrinsicIndexer
) {
  const hash = extrinsic.hash.toHex();
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

  for (const downwardMessage of downwardMessages) {
    const pubSentAt = downwardMessage.pubSentAt.toJSON();
    const pubMsg = downwardMessage.pubMsg;
    const messageId = blake2AsHex(pubMsg.toHex());

    const api = await getApi();
    const versionedXcm = api.registry.createType("VersionedXcm", pubMsg, true);
    if (!versionedXcm.isV0) {
      return;
    }

    const v0Xcm = versionedXcm.asV0;
    if (!v0Xcm.isTeleportAsset) {
      return;
    }

    const teleportAsset = v0Xcm.asTeleportAsset;
    const teleportAssetJson = teleportAsset.toJSON();

    const concreteFungible = teleportAssetJson.assets.find(item => item.concreteFungible)?.concreteFungible;
    const depositAsset = teleportAssetJson.effects.find(item => item.depositAsset)?.depositAsset;

    const amount = concreteFungible?.amount;
    const beneficiary = depositAsset?.dest.x1?.accountId32.id || depositAsset?.dest.x2?.[1].accountId32.id;

    if (amount === undefined || beneficiary === undefined) {
      console.log(`Downward message parse failed:`, extrinsicIndexer);
    }

    await saveNewTeleportAssetIn(extrinsicIndexer, hash, messageId, pubSentAt, beneficiary, amount, teleportAssetJson);
  }
}


async function handleTeleportAssets(
  extrinsic,
  extrinsicIndexer
) {
  const hash = extrinsic.hash.toHex();
  const name = extrinsic.method.method;
  const section = extrinsic.method.section;

  if (section !== "polkadotXcm" || name !== "teleportAssets") {
    return;
  }

  const { args } = extrinsic.method.toJSON();

  const concreteFungible = args.assets.find(item => item.concreteFungible)?.concreteFungible;
  const beneficiary = args.beneficiary.x1?.accountId32.id;
  const amount = concreteFungible?.amount;

  await saveNewTeleportAssetOut(extrinsicIndexer, hash, beneficiary, amount, args);
}


module.exports = {
  handleTeleportAssetDownwardMessage,
  handleTeleportAssets,
};
