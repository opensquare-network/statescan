const { populateAssetInfo } = require("../../common/asset");
const {
  getAssetHolderCollection,
  getExtrinsicCollection,
  getAssetTransferCollection,
} = require("../../mongo");
const { extractPage } = require("../../utils");

async function getHolderAssets(ctx) {
  const { address } = ctx.params;

  const holderCol = await getAssetHolderCollection();
  let holders = await holderCol
    .find({ address })
    .toArray();
  holders = await populateAssetInfo(holders);

  ctx.body = holders;
}

async function getHolderExtrinsics(ctx) {
  const { address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const q = { signer: address };

  const col = await getExtrinsicCollection();
  const items = await col
    .find(q, { projection: { data: 0 } })
    .sort({ "indexer.blockHeight": -1, "indexer.index": -1 })
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

async function getHolderTransfers(ctx) {
  const { address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const q = {
    $or: [{ from: address }, { to: address }],
  };

  const col = await getAssetTransferCollection();
  const items = await col
    .find(q)
    .sort({ "indexer.blockHeight": -1, "indexer.index": -1 })
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
  getHolderAssets,
  getHolderExtrinsics,
  getHolderTransfers,
};
