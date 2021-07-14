const { getEventCollection } = require("../../mongo");
const { extractPage } = require("../../utils");

async function getEvents(ctx) {
  const { chain } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const col = await getEventCollection(chain);
  const items = await col
    .find({})
    .sort({
      "indexer.blockHeight": -1,
      sort: -1,
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

module.exports = {
  getEvents,
};
