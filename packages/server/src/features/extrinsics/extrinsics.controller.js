const { getExtrinsicCollection, getEventCollection } = require("../../mongo");
const { extractPage } = require("../../utils");

async function getLatestExtrinsics(ctx) {
  const { chain } = ctx.params;

  const col = await getExtrinsicCollection(chain);
  const items = await col
    .find({}, { projection: { data: 0 } })
    .sort({
      "indexer.blockHeight": -1,
    })
    .limit(5)
    .toArray();

  ctx.body = items;
}

async function getExtrinsicsCount(ctx) {
  const { chain } = ctx.params;
  const col = await getExtrinsicCollection(chain);
  const total = await col.count({});
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
  const { chain, extrinsicHash } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const q = { extrinsicHash };

  const col = await getEventCollection(chain);
  const items = await col
    .find(q, { projection: { data: 0 } })
    .sort({ sort: 1 })
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
  getLatestExtrinsics,
  getExtrinsicsCount,
  getExtrinsic,
  getExtrinsicEvents,
};
