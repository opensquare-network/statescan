const { HttpError } = require("../../exc");
const {
  getAssetCollection,
  getDailyAssetStatisticCollection,
} = require("../../mongo");
const omit = require("lodash.omit");

function getQuery(assetId, from, to) {
  if (!from && !to) {
    return { asset: assetId };
  }

  let startTime = parseInt(from) * 1000;
  let endTime = parseInt(to) * 1000;
  if (isNaN(startTime) && isNaN(endTime)) {
    throw new HttpError(400, "Invalid from or to query param");
  }

  if (!isNaN(startTime) && !isNaN(endTime)) {
    return {
      $and: [
        { asset: assetId },
        { "indexer.blockTime": { $gte: startTime } },
        { "indexer.blockTime": { $lte: endTime } },
      ],
    };
  }

  if (!isNaN(startTime)) {
    return {
      $and: [{ asset: assetId }, { "indexer.blockTime": { $gte: startTime } }],
    };
  }

  if (!isNaN(endTime)) {
    return {
      $and: [{ asset: assetId }, { "indexer.blockTime": { $lte: endTime } }],
    };
  }

  return { asset: assetId };
}

async function getStatistic(ctx) {
  const { blockHeight, assetId } = ctx.params;

  const assetCol = await getAssetCollection();
  const asset = await assetCol.findOne({
    assetId: parseInt(assetId),
    "createdAt.blockHeight": parseInt(blockHeight),
  });
  if (!asset) {
    throw new HttpError(404, "Asset not found");
  }

  const { from, to } = ctx.query;
  const q = getQuery(asset._id, from, to);

  const col = await getDailyAssetStatisticCollection();
  const items = await col.find(q).sort({ "indexer.blockHeight": 1 }).toArray();

  ctx.body = (items || []).map((item) => omit(item, ["_id", "asset"]));
}

module.exports = {
  getStatistic,
};
