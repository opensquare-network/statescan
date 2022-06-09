const { HttpError } = require("../../exc");
const {
  getAssetCollection,
  getAssetHolderCollection,
  getAssetTransferCollection,
  getAssetTimelineCollection,
} = require("../../mongo");
const { extractPage } = require("../../utils");

async function getAssets(ctx) {
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const { status } = ctx.query;

  // Return non-destroyed assets by default
  const q = { destroyedAt: null };
  if (status === "all") {
    delete q.destroyedAt;
  } else if (status === "destroyed") {
    q.destroyedAt = { $ne: null };
  }

  const col = await getAssetCollection();

  const items = await col
    .find(q)
    .sort({
      assetId: 1,
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

async function getAsset(ctx) {
  const { blockHeight, assetId } = ctx.params;
  const col = await getAssetCollection();
  const item = await col.findOne({
    assetId: parseInt(assetId),
    "createdAt.blockHeight": parseInt(blockHeight),
  });

  ctx.body = item;
}

async function getAssetTimeline(ctx) {
  let { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const { blockHeight, assetId } = ctx.params;

  const q = {
    assetId: parseInt(assetId),
    assetHeight: parseInt(blockHeight),
  };

  const timelineCol = await getAssetTimelineCollection();
  const total = await timelineCol.countDocuments(q);

  if (page === "last") {
    const pageCount = Math.ceil(total / pageSize);
    page = Math.max(pageCount - 1, 0);
  }

  const timeline = await timelineCol
    .find(q)
    .sort({ "indexer.blockHeight": -1, _id: -1 })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();

  ctx.body = {
    items: timeline,
    page,
    pageSize,
    total,
  };
}

async function getAssetById(ctx) {
  const { assetId } = ctx.params;
  const col = await getAssetCollection();
  const option = { sort: { "createdAt.blockHeight": -1 } };
  const item = await col.findOne({ assetId: parseInt(assetId) }, option);

  ctx.body = item;
}

async function getAssetTimelineById(ctx) {
  let { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const { assetId } = ctx.params;
  const col = await getAssetCollection();
  const option = { sort: { "createdAt.blockHeight": -1 } };
  const item = await col.findOne({ assetId: parseInt(assetId) }, option);

  if (!item) {
    throw new HttpError(404, "Asset not found");
  }

  const q = {
    assetId: item.assetId,
    assetHeight: item.createdAt.blockHeight,
  };

  const timelineCol = await getAssetTimelineCollection();
  const total = await timelineCol.countDocuments(q);

  if (page === "last") {
    const pageCount = Math.ceil(total / pageSize);
    page = Math.max(pageCount - 1, 0);
  }

  const timeline = await timelineCol
    .find(q)
    .sort({ "indexer.blockHeight": -1, _id: -1 })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();

  ctx.body = {
    items: timeline,
    page,
    pageSize,
    total,
  };
}

async function getAssetTransfers(ctx) {
  const { blockHeight, assetId } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const assetCol = await getAssetCollection();
  const asset = await assetCol.findOne({
    assetId: parseInt(assetId),
    "createdAt.blockHeight": parseInt(blockHeight),
  });

  if (!asset) {
    throw new HttpError(404, "Asset not found");
  }

  const q = {
    assetId: parseInt(assetId),
    assetHeight: parseInt(blockHeight),
  };

  const transferCol = await getAssetTransferCollection();
  const items = await transferCol
    .aggregate([
      { $match: q },
      { $sort: { "indexer.blockHeight": -1 } },
      { $skip: page * pageSize },
      { $limit: pageSize },
    ])
    .toArray();

  const total = await transferCol.countDocuments(q);

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

async function getAssetHolders(ctx) {
  const { blockHeight, assetId } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const assetCol = await getAssetCollection();
  const asset = await assetCol.findOne({
    assetId: parseInt(assetId),
    "createdAt.blockHeight": parseInt(blockHeight),
  });

  if (!asset) {
    throw new HttpError(404, "Asset not found");
  }

  const q = {
    assetId: parseInt(assetId),
    assetHeight: parseInt(blockHeight),
    balance: { $ne: 0 },
  };

  const col = await getAssetHolderCollection();
  const items = await col
    .aggregate([
      { $match: q },
      { $sort: { balance: -1 } },
      { $skip: page * pageSize },
      { $limit: pageSize },
    ])
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
  getAssets,
  getAsset,
  getAssetTimeline,
  getAssetById,
  getAssetTimelineById,
  getAssetTransfers,
  getAssetHolders,
};
