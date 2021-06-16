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
          localField: "assetId",
          foreignField: "assetId",
          as: "asset",
        },
      },
      {
        $addFields: {
          assetSymbol: { $arrayElemAt: ["$asset.symbol", 0] },
          assetName: { $arrayElemAt: ["$asset.name", 0] },
          assetDecimals: { $arrayElemAt: ["$asset.decimals", 0] },
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
