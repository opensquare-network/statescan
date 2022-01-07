const { populateAssetInfo } = require("../../common/asset");
const {
  getAddressCollection,
  getAssetHolderCollection,
  getAssetTransferCollection,
  getTeleportInCollection,
  getTeleportOutCollection,
  getNftInstanceCollection,
  getNftTransferCollection,
} = require("../../mongo");
const { getExtrinsicCollection } = require("../../mongo");
const { extractPage } = require("../../utils");

async function getAddresses(ctx) {
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const q = {
    $or: [{ providers: { $ne: 0 } }, { sufficients: { $ne: 0 } }],
  };

  const col = await getAddressCollection();
  const items = await col
    .find(q)
    .sort({ "data.total": -1 })
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

async function getAddress(ctx) {
  const { address } = ctx.params;

  const col = await getAddressCollection();
  const item = await col.findOne({ address });

  ctx.body = item;
}

async function getAddressExtrinsics(ctx) {
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

async function getAddressAssets(ctx) {
  const { address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const q = { address };

  const col = await getAssetHolderCollection();
  let items = await col
    .aggregate([
      { $match: q },
      { $sort: { balance: -1 } },
      { $skip: page * pageSize },
      { $limit: pageSize },
      {
        $lookup: {
          from: "assetTransfer",
          let: {
            assetId: "$assetId",
            assetHeight: "$assetHeight",
            address: "$address",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$assetId", "$$assetId"] },
                    { $eq: ["$assetHeight", "$$assetHeight"] },
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
          let: {
            assetId: "$assetId",
            assetHeight: "$assetHeight",
            address: "$address",
          },
          as: "approved",
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$assetId", "$$assetId"] },
                    { $eq: ["$assetHeight", "$$assetHeight"] },
                    { $eq: ["$owner", "$$address"] },
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

  items = await populateAssetInfo(items);

  const total = await col.countDocuments(q);

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

async function getAddressCount(ctx) {
  const col = await getAddressCollection();
  const count = await col.countDocuments({
    $or: [{ providers: { $ne: 0 } }, { sufficients: { $ne: 0 } }],
  });

  ctx.body = count;
}

async function getAddressTransfers(ctx) {
  const { address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const q = {
    $or: [{ from: address }, { to: address }],
  };

  const transferCol = await getAssetTransferCollection();
  let items = await transferCol
    .aggregate([
      { $match: q },
      { $sort: { "indexer.blockHeight": -1 } },
      { $skip: page * pageSize },
      { $limit: pageSize },
    ])
    .toArray();
  items = await populateAssetInfo(items);

  const total = await transferCol.countDocuments(q);

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

async function getAddressTeleportsIn(ctx) {
  const { address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const q = {
    beneficiary: address,
  };

  const xcmTeleportCol = await getTeleportInCollection();
  const items = await xcmTeleportCol
    .find(q)
    .sort({
      "indexer.blockHeight": -1,
      "indexer.index": -1,
    })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();

  const total = await xcmTeleportCol.countDocuments(q);

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

async function getAddressTeleportsOut(ctx) {
  const { address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const q = {
    signer: address,
  };

  const xcmTeleportCol = await getTeleportOutCollection();
  const items = await xcmTeleportCol
    .find(q)
    .sort({
      "indexer.blockHeight": -1,
      "indexer.index": -1,
    })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();

  const total = await xcmTeleportCol.countDocuments(q);

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

async function getAddressNftInstances(ctx) {
  const { address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const q = {
    "details.owner": address,
    isDestroyed: false,
  };

  const nftInstanceCol = await getNftInstanceCollection();
  const items = await nftInstanceCol
    .aggregate([
      { $match: q },
      { $sort: { instanceId: 1 } },
      { $skip: page * pageSize },
      { $limit: pageSize },
      {
        $lookup: {
          from: "nftClass",
          let: { classId: "$classId", classHeight: "$classHeight" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$classId", "$$classId"] },
                    { $eq: ["$indexer.blockHeight", "$$classHeight"] },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: "nftMetadata",
                localField: "dataHash",
                foreignField: "dataHash",
                as: "nftMetadata",
              },
            },
            {
              $addFields: {
                nftMetadata: { $arrayElemAt: ["$nftMetadata", 0] },
              },
            },
          ],
          as: "class",
        },
      },
      {
        $lookup: {
          from: "nftMetadata",
          localField: "dataHash",
          foreignField: "dataHash",
          as: "nftMetadata",
        },
      },
      {
        $addFields: {
          nftMetadata: { $arrayElemAt: ["$nftMetadata", 0] },
          class: { $arrayElemAt: ["$class", 0] },
        },
      },
    ])
    .toArray();

  const total = await nftInstanceCol.countDocuments(q);

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

async function getAddressNftTransfers(ctx) {
  const { address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const q = {
    $or: [{ from: address }, { to: address }],
  };
  const transferCol = await getNftTransferCollection();
  const items = await transferCol
    .aggregate([
      { $match: q },
      { $sort: { "indexer.blockHeight": -1 } },
      { $skip: page * pageSize },
      { $limit: pageSize },
      {
        $lookup: {
          from: "nftInstance",
          let: {
            classId: "$classId",
            classHeight: "$classHeight",
            instanceId: "$instanceId",
            instanceHeight: "$instanceHeight",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$classId", "$$classId"] },
                    { $eq: ["$classHeight", "$$classHeight"] },
                    { $eq: ["$instanceId", "$$instanceId"] },
                    { $eq: ["$indexer.blockHeight", "$$instanceHeight"] },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: "nftMetadata",
                localField: "dataHash",
                foreignField: "dataHash",
                as: "nftMetadata",
              },
            },
            {
              $addFields: {
                nftMetadata: { $arrayElemAt: ["$nftMetadata", 0] },
              },
            },
            {
              $lookup: {
                from: "nftClass",
                let: { classId: "$classId", classHeight: "$classHeight" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$classId", "$$classId"] },
                          { $eq: ["$indexer.blockHeight", "$$classHeight"] },
                        ],
                      },
                    },
                  },
                  {
                    $lookup: {
                      from: "nftMetadata",
                      localField: "dataHash",
                      foreignField: "dataHash",
                      as: "nftMetadata",
                    },
                  },
                  {
                    $addFields: {
                      nftMetadata: { $arrayElemAt: ["$nftMetadata", 0] },
                    },
                  },
                ],
                as: "class",
              },
            },
            {
              $addFields: {
                class: { $arrayElemAt: ["$class", 0] },
              },
            },
          ],
          as: "instance",
        },
      },
      {
        $addFields: {
          instance: { $arrayElemAt: ["$instance", 0] },
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

module.exports = {
  getAddress,
  getAddressExtrinsics,
  getAddressAssets,
  getAddressCount,
  getAddressTransfers,
  getAddressTeleportsIn,
  getAddressTeleportsOut,
  getAddresses,
  getAddressNftInstances,
  getAddressNftTransfers,
};
