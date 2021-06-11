const { getExtrinsicCollection } = require("../../mongo");
const { HttpError } = require("../../exc");

async function getLatestExtrinsics(ctx) {
  const { chain } = ctx.params;

  const col = await getExtrinsicCollection(chain);
  const items = await col
    .find({}, { projection: { data: 0 } })
    .sort({
      "indexer.blockHeight": -1,
    })
    .limit(5)
    .toArray();

  ctx.body = items;
}

async function getExtrinsicsCount(ctx) {
  const { chain } = ctx.params;
  const col = await getExtrinsicCollection(chain);
  const total = await col.count({});
  ctx.body = total;
}

module.exports = {
  getLatestExtrinsics,
  getExtrinsicsCount,
};
