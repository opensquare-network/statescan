const { HttpError } = require("../../exc");
const {
  getAssetCollection,
  getAssetHolderCollection,
  getAssetTransferCollection,
} = require("../../mongo");
const { extractPage } = require("../../utils");

async function getLatestAssets(ctx) {
  const { chain } = ctx.params;

  const col = await getAssetCollection(chain);
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
  const { chain } = ctx.params;

  const col = await getAssetCollection(chain);
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
  const { chain } = ctx.params;
  const col = await getAssetCollection(chain);
  const count = await col.countDocuments();
  ctx.body = count;
}

async function getAssets(ctx) {
  const { chain } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const col = await getAssetCollection(chain);

  const items = await col
    .find({})
    .sort({
      assetId: 1,
    })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();
  const total = await col.estimatedDocumentCount();

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

async function getAsset(ctx) {
  const { chain, blockHeight, assetId } = ctx.params;

  const col = await getAssetCollection(chain);
  const item = await col.findOne({
    assetId: parseInt(assetId),
    "createdAt.blockHeight": parseInt(blockHeight),
  });

  ctx.body = item;
}

async function getAssetTransfers(ctx) {
  const { chain, blockHeight, assetId } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const assetCol = await getAssetCollection(chain);
  const asset = await assetCol.findOne({
    assetId: parseInt(assetId),
    "createdAt.blockHeight": parseInt(blockHeight),
  });

  if (!asset) {
    throw new HttpError(404, "Asset not found");
  }

  const q = { asset: asset._id };

  const transferCol = await getAssetTransferCollection(chain);
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
  const { chain, blockHeight, assetId } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const assetCol = await getAssetCollection(chain);
  const asset = await assetCol.findOne({
    assetId: parseInt(assetId),
    "createdAt.blockHeight": parseInt(blockHeight),
  });

  if (!asset) {
    throw new HttpError(404, "Asset not found");
  }

  const q = {
    asset: asset._id,
    balance: { $gt: 0 },
  };

  const col = await getAssetHolderCollection(chain);
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
  getAssetTransfers,
  getAssetHolders,
};
