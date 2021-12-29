const { hexToString } = require("@polkadot/util");
const {
  getAssetTransferCollection,
  getAssetCollection,
  getAssetHolderCollection,
  getAssetApprovalCollection,
} = require("../../mongo");
const asyncLocalStorage = require("../../asynclocalstorage");
const { getAssetsAccount } = require("./accountStorage");
const { getAssetsApprovals } = require("./approvals");
const { getAssetsMetadata } = require("./metadata");
const { getAssetsAsset } = require("./assetStorage");
const { toDecimal128 } = require("../../utils");

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
      asset: asset._id,
      from,
      to,
      balance,
      listIgnore: false,
    },
    { session }
  );
}

async function updateOrCreateAsset(blockIndexer, assetId) {
  const asset = await getAssetsAsset(blockIndexer.blockHash, assetId);
  const metadata = await getAssetsMetadata(blockIndexer.blockHash, assetId);

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
  extrinsicHash
) {
  const asset = await getAssetsAsset(blockIndexer.blockHash, assetId);
  const metadata = await getAssetsMetadata(blockIndexer.blockHash, assetId);

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

async function updateOrCreateAssetHolder(blockIndexer, assetId, address) {
  const account = await getAssetsAccount(
    blockIndexer.blockHash,
    assetId,
    address
  );

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

async function updateOrCreateApproval(blockIndexer, assetId, owner, delegate) {
  const approval = await getAssetsApprovals(
    blockIndexer.blockHash,
    assetId,
    owner,
    delegate
  );

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
  updateOrCreateAsset,
  saveAssetTimeline,
  destroyAsset,
  updateOrCreateAssetHolder,
  updateOrCreateApproval,
};
