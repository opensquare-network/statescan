const {
  getAssetHolderCollection,
  getExtrinsicCollection,
  getAssetTransferCollection,
  getAssetCollection,
} = require("../../mongo");
const { extractPage } = require("../../utils");

async function getHoldersCount(ctx) {
  const { chain } = ctx.params;

  const col = await getAssetCollection(chain);
  const [result] = await col
    .aggregate([
      { $match: { destoryedAt: null } },
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
  const { chain, address } = ctx.params;

  const holderCol = await getAssetHolderCollection(chain);
  const holders = await holderCol
    .aggregate([
      { $match: { address } },
      { $sort: { assetId: 1 } },
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

  ctx.body = holders;
}

async function getHolderExtrinsics(ctx) {
  const { chain, address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const q = { signer: address };

  const col = await getExtrinsicCollection(chain);
  const items = await col
    .find(q, { projection: { data: 0 } })
    .sort({ "indexer.blockHeight": -1, "indexer.index": 1 })
    .toArray();
  const total = await col.count(q);

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

async function getHolderTransfers(ctx) {
  const { chain, address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const q = {
    $or: [{ from: address }, { to: address }],
  };

  const col = await getAssetTransferCollection(chain);
  const items = await col
    .find(q)
    .sort({ "indexer.blockHeight": -1, "indexer.index": 1 })
    .toArray();
  const total = await col.count(q);

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
