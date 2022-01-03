const {
  getAssetTransfers,
  clearAssetTransfers,
} = require("../../business/common/store/assetTransfer");
const { hexToString } = require("@polkadot/util");
const {
  getAssetTransferCollection,
  getAssetCollection,
  getAssetApprovalCollection,
  getAssetTimelineCollection,
} = require("..");
const {
  utils: { toDecimal128 },
} = require("@statescan/common");

async function flushAssetTransfersToDb(blockHash) {
  const transfers = getAssetTransfers(blockHash);
  if (transfers.length < 1) {
    return;
  }

  const assetIds = transfers.map((transfer) => transfer.assetId);
  const assetCol = await getAssetCollection();
  const assets = await assetCol
    .find({
      assetId: { $in: assetIds },
      destroyedAt: null,
    })
    .toArray();
  const idToHeightMap = assetIds.reduce((result, assetId) => {
    const asset = assets.find((item) => item.assetId === assetId);
    if (!asset) {
      throw new Error(
        `Can not find asset ${assetId} from db when save transfer`
      );
    }

    result[assetId] = asset.createdAt.blockHeight;
    return result;
  }, {});

  const col = await getAssetTransferCollection();
  const bulk = col.initializeUnorderedBulkOp();
  for (const data of transfers) {
    bulk.insert({
      ...data,
      balance: toDecimal128(data.balance),
      assetHeight: idToHeightMap[data.assetId],
    });
  }
  await bulk.execute();
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
      // fixme: we do not have to store detailed asset info to timeline
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
  flushAssetTransfersToDb,
  saveAssetTimeline,
  destroyAsset,
  updateOrCreateApproval,
};
