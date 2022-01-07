const NodeCache = require("node-cache");
const {
  getAssetTransferCollection,
  getAssetCollection,
} = require("../../mongo");
const { HttpError } = require("../../exc");
const { extractPage } = require("../../utils");
const { populateAssetInfo } = require("backend/common/asset");

const myCache = new NodeCache( { stdTTL: 30, checkperiod: 36 } );

async function getTransfer(ctx) {
  const { extrinsicHash } = ctx.params;

  const col = await getAssetTransferCollection();
  const transfer = await col.findOne({ extrinsicHash });
  if (!transfer) {
    throw new HttpError(404, "Transfer not found");
  }

  const assetCol = await getAssetCollection();
  const asset = (
    transfer.assetId !== undefined &&
    transfer.assetHeight !== undefined
  ) ? await assetCol.findOne(
        {
          assetId: transfer.assetId,
          "createdAt.blockHeight": transfer.assetHeight,
        }
      )
    : null;

  ctx.body = {
    ...transfer,
    assetId: asset?.assetId,
    assetCreatedAt: asset?.createdAt,
    assetName: asset?.name,
    assetSymbol: asset?.symbol,
    assetDecimals: asset?.decimals,
  };
}

async function getTransfers(ctx) {
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const { sign_only: signOnly } = ctx.query;

  const q = {};
  if (signOnly === "true") {
    q.listIgnore = false;
  }

  // For default first page, use cached result
  if (
    q.listIgnore === false &&
    page === 0
  ) {
    const cachedResult = myCache.get(`transfers-default-first-page-${pageSize}`);
    if (cachedResult) {
      ctx.body = cachedResult;
      return;
    }
  }

  const col = await getAssetTransferCollection();
  let items = await col
    .aggregate([
      { $match: q },
      { $sort: { "indexer.blockHeight": -1 } },
      { $skip: page * pageSize },
      { $limit: pageSize },
    ])
    .toArray();
  items = await populateAssetInfo(items);
  const total = await col.countDocuments(q);

  const result = {
    items,
    page,
    pageSize,
    total,
  };

  // Cache default first page
  if (
    q.listIgnore === false &&
    page === 0 &&
    pageSize <= 100
  ) {
    myCache.set(`transfers-default-first-page-${pageSize}`, result);
  }

  ctx.body = result;
}

module.exports = {
  getTransfer,
  getTransfers,
};
