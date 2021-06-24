const {
  getAddressCollection,
  getAssetHolderCollection,
  getAssetTransferCollection,
} = require("../../mongo");
const { getExtrinsicCollection } = require("../../mongo");
const { extractPage } = require("../../utils");

async function getAddress(ctx) {
  const { chain, address } = ctx.params;

  const col = await getAddressCollection(chain);
  const item = await col.findOne({ address });

  ctx.body = item;
}

async function getAddressExtrinsics(ctx) {
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

async function getAddressAssets(ctx) {
  const { chain, address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const q = { address };

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
      {
        $lookup: {
          from: "assetTransfer",
          let: { asset: "$asset", address: "$address" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$asset", "$$asset"] },
                    {
                      $or: [
                        { $eq: ["$from", "$$address"] },
                        { $eq: ["$to", "$$address"] },
                      ],
                    },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ],
          as: "transfers",
        },
      },
      {
        $addFields: {
          transfers: { $arrayElemAt: ["$transfers.count", 0] },
        },
      },
      {
        $lookup: {
          from: "approval",
          let: { assetId: "$assetId", address: "$address" },
          as: "approved",
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$assetId", "$$assetId"] },
                    { $eq: ["$address", "$$address"] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                amount: { $sum: "$amount" },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          approved: { $arrayElemAt: ["$approved.amount", 0] },
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

async function getAddressCount(ctx) {
  const { chain } = ctx.params;

  const col = await getAddressCollection(chain);
  const count = await col.countDocuments({ killed: null });

  ctx.body = count;
}

async function getAddressTransfers(ctx) {
  const { chain, address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const q = {
    $or: [{ from: address }, { to: address }],
  };

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
        },
      },
      {
        $project: { extrinsic: 0 },
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

module.exports = {
  getAddress,
  getAddressExtrinsics,
  getAddressAssets,
  getAddressCount,
  getAddressTransfers,
};
