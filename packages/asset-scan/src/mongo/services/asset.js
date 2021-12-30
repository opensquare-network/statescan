const { hexToString } = require("@polkadot/util");
const {
  getAssetTransferCollection,
  getAssetCollection,
  getAssetHolderCollection,
  getAssetApprovalCollection,
} = require("..");
const { toDecimal128 } = require("../../utils");

async function saveNewAssetTransfer(
  blockIndexer,
  eventSort,
  extrinsicIndex,
  extrinsicHash,
  extrinsicSection,
  extrinsicMethod,
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
    module: extrinsicSection,
    method: extrinsicMethod,
    asset: asset._id,
    from,
    to,
    balance,
    listIgnore: false,
  });
}

async function saveAsset(blockIndexer, assetId, asset, metadata) {
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
  extrinsicHash,
  asset,
  metadata
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
          asset: {
            ...asset,
            ...metadata,
            symbol: hexToString(metadata.symbol),
            name: hexToString(metadata.name),
          },
        },
      },
    }
  );
}

async function destroyAsset(blockIndexer, assetId) {
  const col = await getAssetCollection();
  const result = await col.updateOne(
    { assetId, destroyedAt: null },
    {
      $set: {
        destroyedAt: blockIndexer,
      },
    }
  );
}

async function updateOrCreateAssetHolder(
  blockIndexer,
  assetId,
  address,
  account
) {
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
        balance: toDecimal128(account.balance),
        dead: account.balance === 0 ? true : false,
        lastUpdatedAt: blockIndexer,
      },
    },
    { upsert: true }
  );
}

async function updateOrCreateApproval(
  blockIndexer,
  assetId,
  owner,
  delegate,
  approval
) {
  const assetCol = await getAssetCollection();
  const asset = await assetCol.findOne({ assetId, destroyedAt: null });
  if (!asset) {
    return;
  }

  const col = await getAssetApprovalCollection();

  if (!approval) {
    await col.deleteOne({
      asset: asset._id,
      owner,
      delegate,
    });
  } else {
    await col.updateOne(
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
}

module.exports = {
  saveNewAssetTransfer,
  saveAsset,
  saveAssetTimeline,
  destroyAsset,
  updateOrCreateAssetHolder,
  updateOrCreateApproval,
};
