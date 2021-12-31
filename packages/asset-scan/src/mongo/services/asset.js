const { hexToString } = require("@polkadot/util");
const {
  getAssetTransferCollection,
  getAssetCollection,
  getAssetApprovalCollection,
  getAssetTimelineCollection,
} = require("..");
const {
  addAssetTransfer,
  getAssetTransfers,
  clearAssetTransfers,
} = require("./store/assetTransfer");

async function saveNewAssetTransfer(
  indexer,
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

  addAssetTransfer(indexer.blockHash, {
    indexer,
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

async function saveAssetTimeline(
  indexer,
  assetId,
  section,
  method,
  eventData,
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
  await col.insertOne({
    indexer,
    assetId: assetObj.assetId,
    assetHeight: assetObj.createdAt.blockHeight,
    section,
    method,
    eventData,
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
  await col.updateOne(
    { assetId, destroyedAt: null },
    {
      $set: {
        destroyedAt: blockIndexer,
      },
    }
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
  flushAssetTransfersToDb,
  saveAssetTimeline,
  destroyAsset,
  updateOrCreateApproval,
};
