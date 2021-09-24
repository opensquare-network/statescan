const NodeCache = require( "node-cache" );
const {
  getExtrinsicCollection,
  getEventCollection,
  getAssetTransferCollection,
} = require("../../mongo");
const { extractPage } = require("../../utils");

const myCache = new NodeCache( { stdTTL: 30, checkperiod: 36 } );

async function getExtrinsics(ctx) {
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const { module, method, sign_only: signOnly } = ctx.query;

  const q = {};
  if (module) {
    q.section = module;
  }
  if (method) {
    q.name = method;
  }
  if (signOnly === "true") {
    q.listIgnore = false;
  }

  const col = await getExtrinsicCollection();
  const items = await col
    .find(q)
    .sort({
      "indexer.blockHeight": -1,
      "indexer.index": -1,
    })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();

  let total = 0;
  if (Object.keys(q).length === 0) {
    total = await col.estimatedDocumentCount();
  } else {
    total = await col.countDocuments(q);
  }

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

async function getLatestExtrinsics(ctx) {
  const col = await getExtrinsicCollection();
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
  const col = await getExtrinsicCollection();
  const total = await col.countDocuments({});
  ctx.body = total;
}

async function getExtrinsic(ctx) {
  const { indexOrHash } = ctx.params;

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

  const col = await getExtrinsicCollection();
  const item = await col.findOne(q, { projection: { data: 0 } });

  ctx.body = item;
}

async function getExtrinsicEvents(ctx) {
  const { indexOrHash } = ctx.params;
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

  const col = await getEventCollection();
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
  const { indexOrHash } = ctx.params;

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

  const col = await getAssetTransferCollection();
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

async function getAllExtrinsicModuleMethods(ctx) {
  const cachedResult = myCache.get(`all-extrinsic-module-methods`);
  if (cachedResult) {
    ctx.body = cachedResult;
    return;
  }

  const col = await getExtrinsicCollection();
  const result = await col.aggregate([
    {
      $sort: {
        section: 1,
        name: 1,
      }
    },
    {
      $group: {
        _id: {
          section: "$section",
          method: "$name",
        },
      }
    },
    {
      $group: {
        _id: "$_id.section",
        methods: {
          $push: "$_id.method"
        }
      }
    },
    {
      $project: {
        _id: 0,
        module: "$_id",
        methods: 1,
      }
    }
  ]).toArray();

  myCache.set(`all-extrinsic-module-methods`, result, 15*60);

  ctx.body = result;
}

async function getExtrinsicModules(ctx) {
  const col = await getExtrinsicCollection();
  const items = await col.distinct("section");

  ctx.body = items;
}

async function getExtrinsicModuleMethods(ctx) {
  const { moduleName } = ctx.params;

  const col = await getExtrinsicCollection();
  const items = await col.distinct("name", { section: moduleName });

  ctx.body = items;
}

module.exports = {
  getExtrinsics,
  getLatestExtrinsics,
  getExtrinsicsCount,
  getExtrinsic,
  getExtrinsicEvents,
  getExtrinsicTransfers,
  getExtrinsicModules,
  getExtrinsicModuleMethods,
  getAllExtrinsicModuleMethods,
};
