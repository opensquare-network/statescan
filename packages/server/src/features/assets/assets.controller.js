const {
  getAssetCollection,
  getAssetHolderCollection,
  getAssetTransferCollection,
} = require("../../mongo");
const { extractPage } = require("../../utils");

async function getLatestAssets(ctx) {
  const { chain } = ctx.params;

  const col = await getAssetCollection(chain);
  const items = await col
    .find({})
    .sort({
      "createdAt.blockHeight": -1,
    })
    .limit(5)
    .toArray();

  ctx.body = items;
}

async function getAssetsCount(ctx) {
  const { chain } = ctx.params;
  const col = await getAssetCollection(chain);
  const count = await col.count();
  ctx.body = count;
}

async function getAssets(ctx) {
  const { chain } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const col = await getAssetCollection(chain);

  const items = await col
    .find({})
    .sort({
      assetId: 1,
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

async function getAsset(ctx) {
  const { chain, blockHeight, assetId } = ctx.params;

  const col = await getAssetCollection(chain);
  const item = await col.findOne({
    assetId: parseInt(assetId),
    "createdAt.blockHeight": parseInt(blockHeight),
  });

  ctx.body = item;
}

async function getAssetTransfers(ctx) {
  const { chain, blockHeight, assetId } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const assetCol = await getAssetCollection(chain);
  const asset = await assetCol.findOne({
    assetId: parseInt(assetId),
    "createdAt.blockHeight": parseInt(blockHeight),
  });

  const $match = { asset: asset._id };

  const col = await getAssetTransferCollection(chain);
  const items = await col
    .find($match)
    .sort({
      "createdAt.blockHeight": -1,
    })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();

  const total = await col.count($match);

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

async function getAssetHolders(ctx) {
  const { chain, blockHeight, assetId } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const assetCol = await getAssetCollection(chain);
  const asset = await assetCol.findOne({
    assetId: parseInt(assetId),
    "createdAt.blockHeight": parseInt(blockHeight),
  });

  const $match = {
    asset: asset._id,
    balance: { $gt: 0 },
  };

  const col = await getAssetHolderCollection(chain);
  const items = await col
    .find($match)
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();

  const total = await col.count($match);

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

module.exports = {
  getLatestAssets,
  getAssetsCount,
  getAssets,
  getAsset,
  getAssetTransfers,
  getAssetHolders,
};
