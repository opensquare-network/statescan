const {
  getAssetHolderCollection,
  getExtrinsicCollection,
  getAssetTransferCollection,
  getAssetCollection,
} = require("../../mongo");
const { extractPage } = require("../../utils");

async function getHolderAssets(ctx) {
  const { address } = ctx.params;

  const holderCol = await getAssetHolderCollection();
  const holders = await holderCol
    .aggregate([
      { $match: { address } },
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

  ctx.body = holders;
}

async function getHolderExtrinsics(ctx) {
  const { address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const q = { signer: address };

  const col = await getExtrinsicCollection();
  const items = await col
    .find(q, { projection: { data: 0 } })
    .sort({ "indexer.blockHeight": -1, "indexer.index": -1 })
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

async function getHolderTransfers(ctx) {
  const { address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const q = {
    $or: [{ from: address }, { to: address }],
  };

  const col = await getAssetTransferCollection();
  const items = await col
    .find(q)
    .sort({ "indexer.blockHeight": -1, "indexer.index": -1 })
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

module.exports = {
  getHolderAssets,
  getHolderExtrinsics,
  getHolderTransfers,
};
