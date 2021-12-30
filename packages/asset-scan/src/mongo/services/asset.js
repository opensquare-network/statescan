const { ObjectId } = require("mongodb");
const { hexToString } = require("@polkadot/util");
const {
  getAssetTransferCollection,
  getAssetCollection,
  getAssetHolderCollection,
  getAssetApprovalCollection,
  getAssetTimelineCollection,
} = require("..");
const { storeAsset, getAssets, clearAssets } = require("./store/asset");
const { toDecimal128 } = require("../../utils");
const { addAssetTransfer, getAssetTransfers, clearAssetTransfers } = require("./store/assetTransfer");
const { storeAssetHolder, getAssetHolders, clearAssetHolders } = require("./store/assetHolder");

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

  addAssetTransfer(blockIndexer.blockHash, {
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

async function flushAssetTransfersToDb(blockHash) {
  const transfers = getAssetTransfers(blockHash);
  if (transfers.length > 0) {
    const col = await getAssetTransferCollection();
    const bulk = col.initializeUnorderedBulkOp();
    for (const data of transfers) {
      bulk.insert(data);
    }
    await bulk.execute();
  }
  clearAssetTransfers(blockHash);
}

async function saveAsset(blockIndexer, assetId, asset, metadata) {
  storeAsset(blockIndexer.blockHash, assetId, {
    $setOnInsert: {
      createdAt: blockIndexer,
    },
    $set: {
      ...asset,
      ...metadata,
      symbol: hexToString(metadata.symbol),
      name: hexToString(metadata.name),
    },
  });
}

async function flushAssetsToDb(blockHash) {
  const assets = getAssets(blockHash);

  if (Object.keys(assets).length > 0) {
    const col = await getAssetCollection();
    const bulk = col.initializeUnorderedBulkOp();
    for (const assetId in assets) {
      const data = assets[assetId];
      bulk
        .find({
          assetId: parseInt(assetId),
          destroyedAt: null
        })
        .upsert()
        .update(data);
    }
    await bulk.execute();
  }
  clearAssets(blockHash);
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
  const assetCol = await getAssetCollection();
  const assetObj = await assetCol.findOne({ assetId, destroyedAt: null });
  if (!assetObj) {
    return;
  }

  const col = await getAssetTimelineCollection();
  const result = await col.insertOne({
    asset: assetObj._id,
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
  });
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

  storeAssetHolder(blockIndexer.blockHash, asset._id, address, {
    $set: {
      ...account,
      balance: toDecimal128(account.balance),
      dead: account.balance === 0 ? true : false,
      lastUpdatedAt: blockIndexer,
    },
  });
}

async function flushAssetHoldersToDb(blockHash) {
  const assetHolders = getAssetHolders(blockHash);

  if (Object.keys(assetHolders).length > 0) {
    const col = await getAssetHolderCollection();
    const bulk = col.initializeUnorderedBulkOp();

    for (const assetHolderId in assetHolders) {
      const data = assetHolders[assetHolderId];
      const [assetId, address] = assetHolderId.split("/");
      const assetObjId = ObjectId(assetId);
      bulk
        .find({ asset: assetObjId, address })
        .upsert()
        .update(data);
    }

    bulk.execute();
  }
  clearAssetHolders(blockHash);
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
  flushAssetTransfersToDb,
  saveAsset,
  flushAssetsToDb,
  saveAssetTimeline,
  destroyAsset,
  updateOrCreateAssetHolder,
  flushAssetHoldersToDb,
  updateOrCreateApproval,
};
