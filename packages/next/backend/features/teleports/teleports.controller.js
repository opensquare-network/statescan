const {
  getTeleportCollection,
} = require("../../mongo");
const { extractPage } = require("../../utils");

async function getTeleport(ctx) {
  const { chain, indexOrHash } = ctx.params;

  const match = indexOrHash.match(/(\d+)-(\d+)/);
  if (match) {
    const [, blockHeight, extrinsicIndex] = match;
    q = {
      "indexer.blockHeight": parseInt(blockHeight),
      "indexer.index": parseInt(extrinsicIndex),
    };
  } else {
    q = { extrinsicHash: indexOrHash };
  }

  const col = await getTeleportCollection(chain);
  const item = await col.findOne(q);

  ctx.body = item;
}

async function getTeleports(ctx) {
  const { chain } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const q = {};

  const col = await getTeleportCollection(chain);
  const items = await col
    .find(q)
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

module.exports = {
  getTeleports,
  getTeleport,
};
