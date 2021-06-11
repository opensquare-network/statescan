const { getBlockCollection, getStatusCollection } = require("../../mongo");
const { HttpError } = require("../../exc");

async function getLatestBlocks(ctx) {
  const { chain } = ctx.params;

  const col = await getBlockCollection(chain);
  const items = await col
    .find({}, { projection: { extrinsics: 0 } })
    .sort({
      "indexer.blockHeight": -1,
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

module.exports = {
  getLatestBlocks,
  getBlockHeight,
};
