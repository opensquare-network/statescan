const {
  getAddressCollection,
  getAssetHolderCollection,
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
  const total = await col.count(q);

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
  const total = await col.count(q);

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
  const count = await col.count({ killed: null });

  ctx.body = count;
}

module.exports = {
  getAddress,
  getAddressExtrinsics,
  getAddressAssets,
  getAddressCount,
};
