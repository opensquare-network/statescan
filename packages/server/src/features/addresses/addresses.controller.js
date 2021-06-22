const { getAddressCollection } = require("../../mongo");
const { getExtrinsicCollection } = require("../../mongo");
const { extractPage } = require("../../utils");

async function getAddress(ctx) {
  const { chain, address } = ctx.params;

  const col = await getAddressCollection(chain);
  const item = await col.findOne({ address });

  ctx.body = item;
}

async function getAddressExtrinsics(ctx) {
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
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();
  const total = await col.count(q);

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

async function getAddressCount(ctx) {
  const { chain } = ctx.params;

  const col = await getAddressCollection(chain);
  const count = await col.count({ killed: null });

  ctx.body = count;
}

module.exports = {
  getAddress,
  getAddressExtrinsics,
  getAddressCount,
};
