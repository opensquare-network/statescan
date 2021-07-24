const { blake2AsHex } = require("@polkadot/util-crypto");
const {
  getTeleportCollection,
} = require("../../mongo");
const { getApi } = require("../../api");

async function saveNewTeleportAsset(extrinsicIndexer, extrinsicHash, messageId, pubSentAt, beneficiary, amount, fee, teleportAssetJson) {
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
    fee,
  });
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

  const pubSentAt = downwardMessages[0].pubSentAt.toJSON();
  const pubMsg = downwardMessages[0].pubMsg;
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

  const concreteFungible = teleportAssetJson.assets.find(item => item.concreteFungible).concreteFungible;
  const buyExecution = teleportAssetJson.effects.find(item => item.buyExecution).buyExecution;
  const depositAsset = teleportAssetJson.effects.find(item => item.depositAsset).depositAsset;

  const fee = buyExecution.debt;
  const amount = concreteFungible.amount;
  const beneficiary = depositAsset.dest.x1?.accountId32.id;

  await saveNewTeleportAsset(extrinsicIndexer, hash, messageId, pubSentAt, beneficiary, amount, fee, teleportAssetJson);
}

module.exports = {
  handleTeleportAssetDownwardMessage,
};
