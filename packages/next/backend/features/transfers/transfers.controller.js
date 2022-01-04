const {
  getAssetTransferCollection,
  getAssetCollection,
} = require("../../mongo");
const { HttpError } = require("../../exc");
const { extractPage } = require("../../utils");

async function getTransfer(ctx) {
  const { extrinsicHash } = ctx.params;

  const col = await getAssetTransferCollection();
  const transfer = await col.findOne({ extrinsicHash });
  if (!transfer) {
    throw new HttpError(404, "Transfer not found");
  }

  const assetCol = await getAssetCollection();
  const asset = (
    transfer.assetId !== undefined &&
    transfer.assetHeight !== undefined
  ) ? await assetCol.findOne(
        {
          assetId: transfer.assetId,
          "createdAt.blockHeight": transfer.assetHeight,
        }
      )
    : null;

  ctx.body = {
    ...transfer,
    assetId: asset?.assetId,
    assetCreatedAt: asset?.createdAt,
    assetName: asset?.name,
    assetSymbol: asset?.symbol,
    assetDecimals: asset?.decimals,
  };
}

async function getLatestTransfers(ctx) {
  const col = await getAssetTransferCollection();
  const items = await col
    .aggregate([
      { $match: { listIgnore: false } },
      { $sort: { "indexer.blockHeight": -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "asset",
          let: { assetId: "$assetId", assetHeight: "$assetHeight" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$assetId", "$$assetId"] },
                    { $eq: ["$createdAt.blockHeight", "$$assetHeight"] },
                  ]
                }
              }
            }
          ],
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
          assetCreatedAt: "$asset.createdAt",
          assetDestroyedAt: "$asset.destroyedAt",
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
  const col = await getAssetTransferCollection();
  const count = await col.countDocuments();
  ctx.body = count;
}

async function getTransfers(ctx) {
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const { sign_only: signOnly } = ctx.query;

  const q = {};
  if (signOnly === "true") {
    q.listIgnore = false;
  }

  const col = await getAssetTransferCollection();
  const items = await col
    .aggregate([
      { $match: q },
      { $sort: { "indexer.blockHeight": -1 } },
      { $skip: page * pageSize },
      { $limit: pageSize },
      {
        $lookup: {
          from: "asset",
          let: { assetId: "$assetId", assetHeight: "$assetHeight" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$assetId", "$$assetId"] },
                    { $eq: ["$createdAt.blockHeight", "$$assetHeight"] },
                  ]
                }
              }
            }
          ],
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
  getLatestTransfers,
  getTransfersCount,
  getTransfer,
  getTransfers,
};
