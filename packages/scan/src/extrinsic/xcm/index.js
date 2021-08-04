const { blake2AsHex } = require("@polkadot/util-crypto");
const {
  getTeleportCollection,
  getAddressCollection,
} = require("../../mongo");
const { getApi } = require("../../api");
const asyncLocalStorage = require("../../asynclocalstorage");

async function saveNewTeleportAssetIn(extrinsicIndexer, extrinsicHash, messageId, pubSentAt, beneficiary, amount, fee, teleportAssetJson) {
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
    fee,
  }, { session });
}

async function saveNewTeleportAssetOut(extrinsicIndexer, extrinsicHash, signer, beneficiary, amount, teleportAssetJson) {
  const session = asyncLocalStorage.getStore();
  const col = await getTeleportCollection();

  await col.insertOne({
    indexer: extrinsicIndexer,
    extrinsicHash,
    teleportDirection: "out",
    teleportAsset: teleportAssetJson,
    signer,
    beneficiary,
    amount,
  }, { session });
}

async function updateOrCreateAddress(blockIndexer, address) {
  const session = asyncLocalStorage.getStore();
  const col = await getAddressCollection();
  const exists = await col.findOne(
    { address, "lastUpdatedAt.blockHeight": blockIndexer.blockHeight },
    { session },
  );
  if (exists) {
    // Yes, we have the address info already up to date
    return;
  }

  const api = await getApi();

  const account = await api.query.system.account.at(
    blockIndexer.blockHash,
    address
  );
  if (account) {
    await col.updateOne(
      { address },
      {
        $set: {
          ...account.toJSON(),
          lastUpdatedAt: blockIndexer,
        },
      },
      { upsert: true, session }
    );
  }
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
    const buyExecution = teleportAssetJson.effects.find(item => item.buyExecution).buyExecution;

    const amount = concreteFungible?.amount;
    const beneficiary = depositAsset?.dest.x1?.accountId32.id || depositAsset?.dest.x2?.[1].accountId32.id;
    const fee = buyExecution?.debt;

    if (amount === undefined || beneficiary === undefined) {
      console.log(`Downward message parse failed:`, extrinsicIndexer);
    }

    await saveNewTeleportAssetIn(extrinsicIndexer, hash, messageId, pubSentAt, beneficiary, amount, fee, teleportAssetJson);
    await updateOrCreateAddress(extrinsicIndexer, beneficiary);
  }
}


async function handleTeleportAssets(
  extrinsic,
  extrinsicIndexer,
  signer,
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

  await saveNewTeleportAssetOut(extrinsicIndexer, hash, signer, beneficiary, amount, args);
}


module.exports = {
  handleTeleportAssetDownwardMessage,
  handleTeleportAssets,
};
