const {
  getAssetTransferCollection,
  getAssetCollection,
} = require("../../mongo");
const { HttpError } = require("../../exc");
const { extractPage } = require("../../utils");

async function getTransfer(ctx) {
  const { chain, extrinsicHash } = ctx.params;

  const col = await getAssetTransferCollection(chain);
  const transfer = await col.findOne({ extrinsicHash });
  if (!transfer) {
    throw new HttpError(404, "Transfer not found");
  }

  const assetCol = await getAssetCollection(chain);
  const asset = await assetCol.findOne({ _id: transfer.asset });
  ctx.body = {
    ...transfer,
    assetId: asset.assetId,
    assetCreatedAt: asset.createdAt,
    assetName: asset.name,
    assetSymbol: asset.symbol,
    assetDecimals: asset.decimals,
  };
}

async function getLatestTransfers(ctx) {
  const { chain } = ctx.params;

  const col = await getAssetTransferCollection(chain);
  const items = await col
    .aggregate([
      { $sort: { "indexer.blockHeight": -1 } },
      { $limit: 5 },
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
        $project: { asset: 0 },
      },
    ])
    .toArray();

  ctx.body = items;
}

async function getTransfersCount(ctx) {
  const { chain } = ctx.params;
  const col = await getAssetTransferCollection(chain);
  const count = await col.countDocuments();
  ctx.body = count;
}

async function getTransfers(ctx) {
  const { chain } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const q = {};

  const col = await getAssetTransferCollection(chain);
  const items = await col
    .aggregate([
      { $match: q },
      { $sort: { "indexer.blockHeight": -1 } },
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
        $project: { asset: 0 },
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
  getLatestTransfers,
  getTransfersCount,
  getTransfer,
  getTransfers,
};
