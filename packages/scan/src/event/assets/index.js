const { hexToString } = require("@polkadot/util");
const {
  getAssetTransferCollection,
  getAssetCollection,
  getAssetHolderCollection,
  getAddressCollection,
} = require("../../mongo");
const { getApi } = require("../../api");

const Modules = Object.freeze({
  Assets: "assets",
});

const AssetsEvents = Object.freeze({
  // Asset state
  Created: "Created",
  MetadataSet: "MetadataSet",
  MetadataCleared: "MetadataCleared",
  ForceCreated: "ForceCreated",
  AssetStatusChanged: "AssetStatusChanged",
  TeamChanged: "TeamChanged",
  OwnerChanged: "OwnerChanged",
  AssetFrozen: "AssetFrozen",
  AssetThawed: "AssetThawed",
  Destroyed: "Destroyed",

  // Account
  Transferred: "Transferred",
  Frozen: "Frozen",
  Thawed: "Thawed",

  // Asset & Account
  Issued: "Issued",
  Burned: "Burned",
});

async function saveNewAssetTransfer(
  blockIndexer,
  eventSort,
  extrinsicIndex,
  extrinsicHash,
  assetId,
  from,
  to,
  balance
) {
  const assetCol = await getAssetCollection();
  const asset = await assetCol.findOne({ assetId, destroyedAt: null });
  if (!asset) {
    return;
  }

  const col = await getAssetTransferCollection();
  const result = await col.insertOne({
    indexer: blockIndexer,
    eventSort,
    extrinsicIndex,
    extrinsicHash,
    asset: asset._id,
    from,
    to,
    balance,
  });
}

async function updateOrCreateAsset(blockIndexer, assetId) {
  const api = await getApi();
  const asset = (
    await api.query.assets.asset.at(blockIndexer.blockHash, assetId)
  ).toJSON();
  const metadata = (
    await api.query.assets.metadata.at(blockIndexer.blockHash, assetId)
  ).toJSON();
  const col = await getAssetCollection();
  const result = await col.updateOne(
    { assetId, destroyedAt: null },
    {
      $setOnInsert: {
        createdAt: blockIndexer,
      },
      $set: {
        ...asset,
        ...metadata,
        symbol: hexToString(metadata.symbol),
        name: hexToString(metadata.name),
      },
    },
    { upsert: true }
  );
}

async function destroyAsset(blockIndexer, assetId) {
  const col = await getAssetCollection();
  const result = await col.updateOne(
    { assetId },
    {
      $set: {
        destroyedAt: blockIndexer,
      },
    }
  );
}

async function updateOrCreateAddress(blockHash, address) {
  const api = await getApi();

  const account = await api.query.system.account.at(blockHash, address);
  if (account) {
    const col = await getAddressCollection();
    await col.updateOne(
      { address },
      {
        $set: {
          ...account.toJSON(),
        },
      },
      { upsert: true }
    );
  }
}

async function updateOrCreateAssetHolder(blockHash, assetId, address) {
  const api = await getApi();
  const account = (
    await api.query.assets.account.at(blockHash, assetId, address)
  ).toJSON();

  const assetCol = await getAssetCollection();
  const asset = await assetCol.findOne({ assetId, destroyedAt: null });
  if (!asset) {
    return;
  }

  const col = await getAssetHolderCollection();
  const result = await col.updateOne(
    {
      asset: asset._id,
      address,
    },
    {
      $set: {
        ...account,
        dead: account.balance === 0 ? true : false,
      },
    },
    { upsert: true }
  );
}

function isAssetsEvent(section) {
  return section === Modules.Assets;
}

async function handleAssetsEvent(
  event,
  eventSort,
  extrinsicIndex,
  extrinsicHash,
  blockIndexer
) {
  const { section, method, data } = event;

  if (!isAssetsEvent(section)) {
    return false;
  }

  const eventData = data.toJSON();

  // Save assets
  if (
    [
      AssetsEvents.Created,
      AssetsEvents.ForceCreated,
      AssetsEvents.MetadataSet,
      AssetsEvents.Issued,
      AssetsEvents.Burned,
      AssetsEvents.AssetStatusChanged,
      AssetsEvents.TeamChanged,
      AssetsEvents.OwnerChanged,
      AssetsEvents.AssetFrozen,
      AssetsEvents.AssetThawed,
      AssetsEvents.Transferred,
    ].includes(method)
  ) {
    const [assetId] = eventData;
    await updateOrCreateAsset(blockIndexer, assetId);
  }

  if (method === AssetsEvents.Destroyed) {
    const [assetId] = eventData;
    await destroyAsset(blockIndexer, assetId);
  }

  // Save transfers
  if (method === AssetsEvents.Transferred) {
    const [assetId, from, to, balance] = eventData;
    await saveNewAssetTransfer(
      blockIndexer,
      eventSort,
      extrinsicIndex,
      extrinsicHash,
      assetId,
      from,
      to,
      balance
    );
  }

  // Save asset holders
  if (
    [
      AssetsEvents.Issued,
      AssetsEvents.Burned,
      AssetsEvents.Frozen,
      AssetsEvents.Thawed,
    ].includes(method)
  ) {
    const [assetId, accountId] = eventData;
    await updateOrCreateAddress(blockIndexer.blockHash, accountId);
    await updateOrCreateAssetHolder(blockIndexer.blockHash, assetId, accountId);
  }

  if (method === AssetsEvents.Transferred) {
    const [assetId, from, to] = eventData;
    await updateOrCreateAddress(blockIndexer.blockHash, from);
    await updateOrCreateAssetHolder(blockIndexer.blockHash, assetId, from);
    await updateOrCreateAddress(blockIndexer.blockHash, to);
    await updateOrCreateAssetHolder(blockIndexer.blockHash, assetId, to);
  }

  return true;
}

module.exports = {
  handleAssetsEvent,
};
