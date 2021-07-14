const {
  getExtrinsicCollection,
  getEventCollection,
  getAssetTransferCollection,
} = require("../../mongo");
const { extractPage } = require("../../utils");

async function getExtrinsics(ctx) {
  const { chain } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const col = await getExtrinsicCollection(chain);
  const items = await col
    .find({})
    .sort({
      "indexer.blockHeight": -1,
      "indexer.index": -1,
    })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();
  const total = await col.estimatedDocumentCount();

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

async function getLatestExtrinsics(ctx) {
  const { chain } = ctx.params;

  const col = await getExtrinsicCollection(chain);
  const items = await col
    .find({}, { projection: { data: 0 } })
    .sort({
      "indexer.blockHeight": -1,
      "indexer.index": -1,
    })
    .limit(5)
    .toArray();

  ctx.body = items;
}

async function getExtrinsicsCount(ctx) {
  const { chain } = ctx.params;
  const col = await getExtrinsicCollection(chain);
  const total = await col.countDocuments({});
  ctx.body = total;
}

async function getExtrinsic(ctx) {
  const { chain, indexOrHash } = ctx.params;

  let q;

  const match = indexOrHash.match(/(\d+)-(\d+)/);
  if (match) {
    const [, blockHeight, extrinsicIndex] = match;
    q = {
      "indexer.blockHeight": parseInt(blockHeight),
      "indexer.index": parseInt(extrinsicIndex),
    };
  } else {
    q = { hash: indexOrHash };
  }

  const col = await getExtrinsicCollection(chain);
  const item = await col.findOne(q, { projection: { data: 0 } });

  ctx.body = item;
}

async function getExtrinsicEvents(ctx) {
  const { chain, indexOrHash } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  let q;

  const match = indexOrHash.match(/(\d+)-(\d+)/);
  if (match) {
    const [, blockHeight, extrinsicIndex] = match;
    q = {
      "indexer.blockHeight": parseInt(blockHeight),
      "phase.value": parseInt(extrinsicIndex),
    };
  } else {
    q = { extrinsicHash: indexOrHash };
  }

  const col = await getEventCollection(chain);
  const items = await col
    .find(q)
    .sort({ sort: 1 })
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

async function getExtrinsicTransfers(ctx) {
  const { chain, indexOrHash } = ctx.params;

  let q;

  const match = indexOrHash.match(/(\d+)-(\d+)/);
  if (match) {
    const [, blockHeight, extrinsicIndex] = match;
    q = {
      "indexer.blockHeight": parseInt(blockHeight),
      extrinsicIndex: parseInt(extrinsicIndex),
    };
  } else {
    q = { extrinsicHash: indexOrHash };
  }

  const col = await getAssetTransferCollection(chain);
  const items = await col
    .aggregate([
      { $match: q },
      { $sort: { eventSort: 1 } },
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
    ])
    .toArray();

  ctx.body = items;
}

module.exports = {
  getExtrinsics,
  getLatestExtrinsics,
  getExtrinsicsCount,
  getExtrinsic,
  getExtrinsicEvents,
  getExtrinsicTransfers,
};
