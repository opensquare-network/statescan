const {
  getBlockCollection,
  getStatusCollection,
  getExtrinsicCollection,
  getEventCollection,
  getUnFinalizedBlockCollection,
  getUnFinalizedExrinsicCollection,
  getUnFinalizedEventCollection,
} = require("../../mongo");
const { extractPage } = require("../../utils");
const {
  getPagedBlocks,
  getLatestBlocks: getLatestBlocksFromDb,
} = require("../../common/latestBlocks");

async function getBlocks(ctx) {
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const items = await getPagedBlocks(page, pageSize);
  const col = await getBlockCollection();
  const total = await col.estimatedDocumentCount();

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

async function getLatestBlocks(ctx) {
  ctx.body = await getLatestBlocksFromDb(5);
}

async function getBlockHeight(ctx) {
  const col = await getStatusCollection();
  const heightInfo = await col.findOne({ name: "main-scan-height" });
  ctx.body = heightInfo?.value || 0;
}

async function getBlock(ctx) {
  const { heightOrHash } = ctx.params;

  const $match = {};
  const col = await getBlockCollection();
  if (heightOrHash.startsWith("0x")) {
    $match["hash"] = heightOrHash;
  } else {
    $match["header.number"] = parseInt(heightOrHash);
  }

  let isFinalized = true;
  let block = await col.findOne($match, {
    projection: { data: 0, extrinsics: 0 },
  });

  if (!block) {
    const unFinalizedCol = await getUnFinalizedBlockCollection();
    block = await unFinalizedCol.findOne($match, {
      projection: { data: 0, extrinsics: 0 },
    });

    isFinalized = false;
  }
  return (ctx.body = {
    ...block,
    isFinalized,
  });
}

async function getBlockExtrinsics(ctx) {
  const { heightOrHash } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const $match = {};

  if (heightOrHash.startsWith("0x")) {
    $match["indexer.blockHash"] = heightOrHash;
  } else {
    $match["indexer.blockHeight"] = parseInt(heightOrHash);
  }

  const col = await getExtrinsicCollection();
  let data = await getExtrinsicsFromCollection(col, $match, page, pageSize);
  if (data.total <= 0) {
    const col = await getUnFinalizedExrinsicCollection();
    data = await getExtrinsicsFromCollection(col, $match, page, pageSize);
  }

  ctx.body = {
    ...data,
    page,
    pageSize,
  };
}

async function getExtrinsicsFromCollection(col, $match, page, pageSize) {
  const items = await col
    .find($match, { projection: { data: 0 } })
    .sort({
      "indexer.index": 1,
    })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();
  const total = await col.countDocuments($match);

  return {
    items,
    total,
  };
}

async function getBlockEvents(ctx) {
  const { heightOrHash } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const $match = {};

  if (heightOrHash.startsWith("0x")) {
    $match["indexer.blockHash"] = heightOrHash;
  } else {
    $match["indexer.blockHeight"] = parseInt(heightOrHash);
  }

  const col = await getEventCollection();
  let data = await getEventsFromCollection(col, $match, page, pageSize);
  if (data.total <= 0) {
    const col = await getUnFinalizedEventCollection();
    data = await getEventsFromCollection(col, $match, page, pageSize);
  }

  ctx.body = {
    ...data,
    page,
    pageSize,
  };
}

async function getEventsFromCollection(col, $match, page, pageSize) {
  const items = await col
    .find($match)
    .sort({
      sort: 1,
    })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();
  const total = await col.countDocuments($match);

  return {
    items,
    total,
  };
}

async function getBlockFromTime(ctx) {
  const { blockTime } = ctx.params;

  const col = await getBlockCollection();
  const block = await col.findOne({
    blockTime: {
      $lte: parseInt(blockTime),
    },
  }).sort({ blockTime: -1 });

  ctx.body = block;
}

module.exports = {
  getBlocks,
  getLatestBlocks,
  getBlockHeight,
  getBlock,
  getBlockExtrinsics,
  getBlockEvents,
  getBlockFromTime,
};
