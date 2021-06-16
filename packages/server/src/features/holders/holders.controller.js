const {
  getAssetHolderCollection,
  getExtrinsicCollection,
  getAssetTransferCollection,
  getAssetCollection,
} = require("../../mongo");
const { extractPage } = require("../../utils");

async function getHoldersCount(ctx) {
  const { chain } = ctx.params;

  const col = await getAssetCollection(chain);
  const [result] = await col
    .aggregate([
      { $match: { destoryedAt: null } },
      {
        $group: {
          _id: null,
          accounts: { $sum: "$accounts" },
        },
      },
    ])
    .toArray();

  ctx.body = result?.accounts || 0;
}

async function getHolder(ctx) {
  const { chain, address } = ctx.params;

  const holderCol = await getAssetHolderCollection();
  const holder = await holderCol.findOne({ address });

  ctx.body = holder;
}

async function getHolderExtrinsics(ctx) {
  const { chain, address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const q = { signer: address };

  const col = await getExtrinsicCollection(chain);
  const items = await col
    .find(q, { projection: { data: 0 } })
    .sort({ "indexer.blockHeight": -1, "indexer.index": 1 })
    .toArray();
  const total = await col.count(q);

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

async function getHolderTransfers(ctx) {
  const { chain, address } = ctx.params;
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const q = {
    $or: [{ from: address }, { to: address }],
  };

  const col = await getAssetTransferCollection(chain);
  const items = await col
    .find(q)
    .sort({ "indexer.blockHeight": -1, "indexer.index": 1 })
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
  getHoldersCount,
  getHolder,
  getHolderExtrinsics,
  getHolderTransfers,
};
