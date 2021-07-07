const { hexToString } = require("@polkadot/util");
const {
  getAssetTransferCollection,
  getAssetCollection,
  getAssetHolderCollection,
  getAddressCollection,
  getAssetApprovalCollection,
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
  ApprovedTransfer: "ApprovedTransfer",
  ApprovalCancelled: "ApprovalCancelled",
  TransferredApproved: "TransferredApproved",

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

async function saveAssetTimeline(
  blockIndexer,
  assetId,
  section,
  method,
  eventData,
  eventSort,
  extrinsicIndex,
  extrinsicHash
) {
  const col = await getAssetCollection();
  const result = await col.updateOne(
    { assetId, destroyedAt: null },
    {
      $push: {
        timeline: {
          type: "event",
          section,
          method,
          eventData,
          eventIndexer: blockIndexer,
          eventSort,
          extrinsicIndex,
          extrinsicHash,
        },
      },
    }
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

async function updateOrCreateAddress(blockIndexer, address) {
  const api = await getApi();

  const account = await api.query.system.account.at(
    blockIndexer.blockHash,
    address
  );
  if (account) {
    const col = await getAddressCollection();
    await col.updateOne(
      { address },
      {
        $set: {
          ...account.toJSON(),
          lastUpdatedAt: blockIndexer,
        },
      },
      { upsert: true }
    );
  }
}

async function updateOrCreateAssetHolder(blockIndexer, assetId, address) {
  const api = await getApi();
  const account = (
    await api.query.assets.account.at(blockIndexer.blockHash, assetId, address)
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
        lastUpdatedAt: blockIndexer,
      },
    },
    { upsert: true }
  );
}

async function updateOrCreateApproval(blockIndexer, assetId, owner, delegate) {
  const api = await getApi();
  const approval = (
    await api.query.assets.approvals.at(
      blockIndexer.blockHash,
      assetId,
      owner,
      delegate
    )
  ).toJSON();

  const assetCol = await getAssetCollection();
  const asset = await assetCol.findOne({ assetId, destroyedAt: null });
  if (!asset) {
    return;
  }

  const col = await getAssetApprovalCollection();
  const result = await col.updateOne(
    {
      asset: asset._id,
      owner,
      delegate,
    },
    {
      $set: {
        ...approval,
        lastUpdatedAt: blockIndexer,
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
    ].includes(method)
  ) {
    const [assetId] = eventData;
    await updateOrCreateAsset(blockIndexer, assetId);
    await saveAssetTimeline(
      blockIndexer,
      assetId,
      section,
      method,
      eventData,
      eventSort,
      extrinsicIndex,
      extrinsicHash
    );
  }

  if (method === AssetsEvents.Destroyed) {
    const [assetId] = eventData;
    await destroyAsset(blockIndexer, assetId);
    await saveAssetTimeline(
      blockIndexer,
      assetId,
      section,
      method,
      eventData,
      eventSort,
      extrinsicIndex,
      extrinsicHash
    );
  }

  if (method === AssetsEvents.Transferred) {
    const [assetId] = eventData;
    await updateOrCreateAsset(blockIndexer, assetId);
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
    await updateOrCreateAddress(blockIndexer, accountId);
    await updateOrCreateAssetHolder(blockIndexer, assetId, accountId);
  }

  if (method === AssetsEvents.Transferred) {
    const [assetId, from, to] = eventData;
    await updateOrCreateAddress(blockIndexer, from);
    await updateOrCreateAssetHolder(blockIndexer, assetId, from);
    await updateOrCreateAddress(blockIndexer, to);
    await updateOrCreateAssetHolder(blockIndexer, assetId, to);
  }

  if (
    [
      AssetsEvents.ApprovedTransfer,
      AssetsEvents.ApprovalCancelled,
      AssetsEvents.TransferredApproved,
    ].includes(method)
  ) {
    const [assetId, owner, delegate] = eventData;
    await updateOrCreateApproval(blockIndexer, assetId, owner, delegate);
  }

  return true;
}

module.exports = {
  handleAssetsEvent,
};
