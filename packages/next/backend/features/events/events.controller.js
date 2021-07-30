const { getEventCollection, getAssetTransferCollection, getAssetCollection } = require("../../mongo");
const { extractPage } = require("../../utils");

async function getEvents(ctx) {
  const { chain } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const { module, method } = ctx.query;

  const q = {};
  if (module) {
    q.section = module;
  }
  if (method) {
    q.method = method;
  }

  const col = await getEventCollection(chain);
  const items = await col
    .find(q)
    .sort({
      "indexer.blockHeight": -1,
      sort: -1,
    })
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

async function getEvent(ctx) {
  const { chain, blockHeight, eventSort } = ctx.params;

  const col = await getEventCollection(chain);
  const event = await col
    .findOne({
      "indexer.blockHeight": Number(blockHeight),
      "sort": Number(eventSort),
    });

  if (event) {
    const transferCol = await getAssetTransferCollection(chain);
    const transfer = await transferCol
      .findOne({
        "indexer.blockHeight": Number(blockHeight),
        "eventSort": Number(eventSort),
      });

    if (transfer) {
      const assetCol = await getAssetCollection(chain);
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
        }
      };

      return;
    }
  }

  ctx.body = event;
}

async function getEventModules(ctx) {
  const { chain } = ctx.params;

  const col = await getEventCollection(chain);
  const items = await col.distinct("section");

  ctx.body = items;
}

async function getEventModuleMethods(ctx) {
  const { chain, moduleName } = ctx.params;

  const col = await getEventCollection(chain);
  const items = await col.distinct("method", { section: moduleName });

  ctx.body = items;
}

module.exports = {
  getEvent,
  getEvents,
  getEventModules,
  getEventModuleMethods,
};
