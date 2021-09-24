const NodeCache = require( "node-cache" );
const {
  getEventCollection,
  getAssetTransferCollection,
  getAssetCollection,
} = require("../../mongo");
const { extractPage } = require("../../utils");

const myCache = new NodeCache( { stdTTL: 30, checkperiod: 36 } );

async function getEvents(ctx) {
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const { module, method, signOnly } = ctx.query;

  const q = {};
  if (module) {
    q.section = module;
  }
  if (method) {
    q.method = method;
  }
  if (signOnly === "true") {
    q.listIgnore = false;
  }

  const col = await getEventCollection();
  const items = await col
    .find(q)
    .sort({
      "indexer.blockHeight": -1,
      sort: -1,
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

async function getEvent(ctx) {
  const { blockHeight, eventSort } = ctx.params;

  const col = await getEventCollection();
  const event = await col.findOne({
    "indexer.blockHeight": Number(blockHeight),
    sort: Number(eventSort),
  });

  if (event) {
    const transferCol = await getAssetTransferCollection();
    const transfer = await transferCol.findOne({
      "indexer.blockHeight": Number(blockHeight),
      eventSort: Number(eventSort),
    });

    if (transfer) {
      const assetCol = await getAssetCollection();
      const asset = transfer.asset
        ? await assetCol.findOne({ _id: transfer.asset })
        : null;

      ctx.body = {
        ...event,
        transfer: {
          ...transfer,
          assetId: asset?.assetId,
          assetCreatedAt: asset?.createdAt,
          assetName: asset?.name,
          assetSymbol: asset?.symbol,
          assetDecimals: asset?.decimals,
        },
      };

      return;
    }
  }

  ctx.body = event;
}

async function getAllEventModuleMethods(ctx) {
  const cachedResult = myCache.get(`all-event-module-methods`);
  if (cachedResult) {
    ctx.body = cachedResult;
    return;
  }

  const col = await getEventCollection();
  const result = await col.aggregate([
    {
      $sort: {
        section: 1,
        method: 1,
      }
    },
    {
      $group: {
        _id: {
          section: "$section",
          method: "$method",
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

  myCache.set(`all-event-module-methods`, result, 15*60);

  ctx.body = result;
}

async function getEventModules(ctx) {
  const col = await getEventCollection();
  const items = await col.distinct("section");

  ctx.body = items;
}

async function getEventModuleMethods(ctx) {
  const { moduleName } = ctx.params;

  const col = await getEventCollection();
  const items = await col.distinct("method", { section: moduleName });

  ctx.body = items;
}

module.exports = {
  getEvent,
  getEvents,
  getEventModules,
  getEventModuleMethods,
  getAllEventModuleMethods,
};
