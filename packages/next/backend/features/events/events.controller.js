const { getEventCollection } = require("../../mongo");
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
  getEvents,
  getEventModules,
  getEventModuleMethods,
};
