const { HttpError } = require("../../exc");
const {
  getAssetCollection,
  getAssetHolderCollection,
  getAssetTransferCollection,
} = require("../../mongo");
const { extractPage } = require("../../utils");

async function getLatestAssets(ctx) {
  const col = await getAssetCollection();
  const items = await col
    .find({})
    .sort({
      "createdAt.blockHeight": -1,
    })
    .limit(5)
    .toArray();

  ctx.body = items;
}

async function getPopularAssets(ctx) {
  const col = await getAssetCollection();
  const items = await col
    .find({})
    .sort({
      accounts: -1,
    })
    .limit(5)
    .toArray();

  ctx.body = items;
}

async function getAssetsCount(ctx) {
  const col = await getAssetCollection();
  const count = await col.countDocuments();
  ctx.body = count;
}

async function getAssets(ctx) {
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const { status } = ctx.query;

  // Return non-destroyed assets by default
  const q = { destroyedAt: null };
  if (status === "all") {
    delete q.destroyedAt;
  }
  else if (status === "destroyed") {
    q.destroyedAt = { $ne: null };
  }


  const col = await getAssetCollection();

  const items = await col
    .find(q)
    .sort({
      assetId: 1,
    })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();
  const total = await col.countDocuments(q);

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

async function getAsset(ctx) {
  const { blockHeight, assetId } = ctx.params;
  const col = await getAssetCollection();
  const item = await col.findOne({
    assetId: parseInt(assetId),
    "createdAt.blockHeight": parseInt(blockHeight),
  });

  ctx.body = item;
}

async function getAssetById(ctx) {
  const { assetId } = ctx.params;
  const col = await getAssetCollection();
  const option = { sort: { "createdAt.blockHeight": -1 } };
  const item = await col.findOne({ assetId: parseInt(assetId) }, option);

  ctx.body = item;
}

async function getAssetTransfers(ctx) {
  const { blockHeight, assetId } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const assetCol = await getAssetCollection();
  const asset = await assetCol.findOne({
    assetId: parseInt(assetId),
    "createdAt.blockHeight": parseInt(blockHeight),
  });

  if (!asset) {
    throw new HttpError(404, "Asset not found");
  }

  const q = { asset: asset._id };

  const transferCol = await getAssetTransferCollection();
  const items = await transferCol
    .aggregate([
      { $match: q },
      { $sort: { "indexer.blockHeight": -1 } },
      { $skip: page * pageSize },
      { $limit: pageSize },
      {
        $lookup: {
          from: "extrinsic",
          localField: "extrinsicHash",
          foreignField: "hash",
          as: "extrinsic",
        },
      },
      {
        $addFields: {
          extrinsic: { $arrayElemAt: ["$extrinsic", 0] },
        },
      },
      {
        $addFields: {
          module: "$extrinsic.section",
          method: "$extrinsic.name",
          extrinsicIndex: "$extrinsic.indexer.index",
        },
      },
      {
        $project: { extrinsic: 0 },
      },
      {
        $lookup: {
          from: "asset",
          localField: "asset",
          foreignField: "_id",
          as: "asset",
        },
      },
      {
        $addFields: {
          asset: { $arrayElemAt: ["$asset", 0] },
        },
      },
      {
        $addFields: {
          assetId: "$asset.assetId",
          assetCreatedAt: "$asset.createdAt",
          assetDestroyedAt: "$asset.destroyedAt",
          assetSymbol: "$asset.symbol",
          assetName: "$asset.name",
          assetDecimals: "$asset.decimals",
        },
      },
      {
        $project: {
          asset: 0,
        },
      },
    ])
    .toArray();

  const total = await transferCol.countDocuments(q);

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

async function getAssetHolders(ctx) {
  const { blockHeight, assetId } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const assetCol = await getAssetCollection();
  const asset = await assetCol.findOne({
    assetId: parseInt(assetId),
    "createdAt.blockHeight": parseInt(blockHeight),
  });

  if (!asset) {
    throw new HttpError(404, "Asset not found");
  }

  const q = {
    asset: asset._id,
    balance: { $ne: 0 },
  };

  const col = await getAssetHolderCollection();
  const items = await col
    .aggregate([
      { $match: q },
      { $sort: { balance: -1 } },
      { $skip: page * pageSize },
      { $limit: pageSize },
      {
        $lookup: {
          from: "asset",
          localField: "asset",
          foreignField: "_id",
          as: "asset",
        },
      },
      {
        $addFields: {
          asset: { $arrayElemAt: ["$asset", 0] },
        },
      },
      {
        $addFields: {
          assetId: "$asset.assetId",
          assetCreatedAt: "$asset.createdAt",
          assetDestroyedAt: "$asset.destroyedAt",
          assetSymbol: "$asset.symbol",
          assetName: "$asset.name",
          assetDecimals: "$asset.decimals",
        },
      },
      {
        $project: {
          asset: 0,
        },
      },
    ])
    .toArray();

  const total = await col.countDocuments(q);

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

module.exports = {
  getLatestAssets,
  getPopularAssets,
  getAssetsCount,
  getAssets,
  getAsset,
  getAssetById,
  getAssetTransfers,
  getAssetHolders,
};
