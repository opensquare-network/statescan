const {
  getAssetHolderCollection,
  getExtrinsicCollection,
  getAssetTransferCollection,
  getAssetCollection,
} = require("../../mongo");
const { extractPage } = require("../../utils");

async function getHoldersCount(ctx) {
  const col = await getAssetCollection();
  const [result] = await col
    .aggregate([
      { $match: { destoryedAt: null } }, // fixme: 1. typo 'destroyed' 2. we should feed the home page panel data with websocket
      {
        $group: {
          _id: null,
          accounts: { $sum: "$accounts" },
        },
      },
    ])
    .toArray();

  ctx.body = result?.accounts || 0;
}

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
                    { $eq: ["$indexer.blockHeight", "$$assetHeight"] },
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
          assetId: "$asset.assetId",
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
  getHoldersCount,
  getHolderAssets,
  getHolderExtrinsics,
  getHolderTransfers,
};
