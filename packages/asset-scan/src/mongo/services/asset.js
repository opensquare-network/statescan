const { hexToString } = require("@polkadot/util");
const {
  getAssetTransferCollection,
  getAssetCollection,
  getAssetHolderCollection,
  getAssetApprovalCollection,
} = require("..");
const asyncLocalStorage = require("../../asynclocalstorage");
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
  const session = asyncLocalStorage.getStore();
  const assetCol = await getAssetCollection();
  const asset = await assetCol.findOne(
    { assetId, destroyedAt: null },
    { session }
  );
  if (!asset) {
    return;
  }

  const col = await getAssetTransferCollection();
  const result = await col.insertOne(
    {
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
    },
    { session }
  );
}

async function saveAsset(blockIndexer, assetId, asset, metadata) {
  const session = asyncLocalStorage.getStore();
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
    { upsert: true, session }
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
  metadata,
) {
  const session = asyncLocalStorage.getStore();
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
    },
    { session }
  );
}

async function destroyAsset(blockIndexer, assetId) {
  const session = asyncLocalStorage.getStore();
  const col = await getAssetCollection();
  const result = await col.updateOne(
    { assetId, destroyedAt: null },
    {
      $set: {
        destroyedAt: blockIndexer,
      },
    },
    { session }
  );
}

async function updateOrCreateAssetHolder(blockIndexer, assetId, address, account) {
  const session = asyncLocalStorage.getStore();
  const assetCol = await getAssetCollection();
  const asset = await assetCol.findOne(
    { assetId, destroyedAt: null },
    { session }
  );
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
    { upsert: true, session }
  );
}

async function updateOrCreateApproval(blockIndexer, assetId, owner, delegate, approval) {
  const session = asyncLocalStorage.getStore();
  const assetCol = await getAssetCollection();
  const asset = await assetCol.findOne(
    { assetId, destroyedAt: null },
    { session }
  );
  if (!asset) {
    return;
  }

  const col = await getAssetApprovalCollection();

  if (!approval) {
    await col.deleteOne(
      {
        asset: asset._id,
        owner,
        delegate,
      },
      { session }
    );
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
      { upsert: true, session }
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
