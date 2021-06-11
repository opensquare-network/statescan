const { getAssetCollection } = require("../../mongo");
const { HttpError } = require("../../exc");

async function getLatestAssets(ctx) {
  const { chain } = ctx.params;

  const col = await getAssetCollection(chain);
  const items = await col
    .find({})
    .sort({
      "indexer.blockHeight": -1,
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

module.exports = {
  getLatestAssets,
  getAssetsCount,
};
