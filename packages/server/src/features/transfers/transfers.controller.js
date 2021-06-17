const { getAssetTransferCollection } = require("../../mongo");
const { HttpError } = require("../../exc");

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
  const count = await col.count();
  ctx.body = count;
}

module.exports = {
  getLatestTransfers,
  getTransfersCount,
};
