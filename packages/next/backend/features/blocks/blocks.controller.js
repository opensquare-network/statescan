const {
  getBlockCollection,
  getStatusCollection,
  getExtrinsicCollection,
  getEventCollection,
} = require("../../mongo");
const { extractPage } = require("../../utils");

async function getBlocks(ctx) {
  const { chain } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const col = await getBlockCollection(chain);
  const items = await col
    .find({})
    .sort({
      "header.number": -1,
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

async function getLatestBlocks(ctx) {
  const { chain } = ctx.params;

  const col = await getBlockCollection(chain);
  const items = await col
    .find({}, { projection: { extrinsics: 0 } })
    .sort({
      "header.number": -1,
    })
    .limit(5)
    .toArray();

  ctx.body = items;
}

async function getBlockHeight(ctx) {
  const { chain } = ctx.params;
  const col = await getStatusCollection(chain);
  const heightInfo = await col.findOne({ name: "main-scan-height" });
  ctx.body = heightInfo?.value || 0;
}

async function getBlock(ctx) {
  const { chain, heightOrHash } = ctx.params;

  const $match = {};
  const col = await getBlockCollection(chain);
  if (heightOrHash.startsWith("0x")) {
    $match["hash"] = heightOrHash;
  } else {
    $match["header.number"] = parseInt(heightOrHash);
  }

  ctx.body = await col.findOne($match, {
    projection: { data: 0, extrinsics: 0 },
  });
}

async function getBlockExtrinsics(ctx) {
  const { chain, heightOrHash } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const $match = {};
  const col = await getExtrinsicCollection(chain);

  if (heightOrHash.startsWith("0x")) {
    $match["indexer.blockHash"] = heightOrHash;
  } else {
    $match["indexer.blockHeight"] = parseInt(heightOrHash);
  }

  const items = await col
    .find($match, { projection: { data: 0 } })
    .sort({
      "indexer.index": 1,
    })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();
  const total = await col.countDocuments($match);

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

async function getBlockEvents(ctx) {
  const { chain, heightOrHash } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const $match = {};
  const col = await getEventCollection(chain);

  if (heightOrHash.startsWith("0x")) {
    $match["indexer.blockHash"] = heightOrHash;
  } else {
    $match["indexer.blockHeight"] = parseInt(heightOrHash);
  }

  const items = await col
    .find($match)
    .sort({
      sort: 1,
    })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();
  const total = await col.countDocuments($match);

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

module.exports = {
  getBlocks,
  getLatestBlocks,
  getBlockHeight,
  getBlock,
  getBlockExtrinsics,
  getBlockEvents,
};
