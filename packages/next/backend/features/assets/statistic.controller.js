const { HttpError } = require("../../exc");
const {
  getAssetCollection,
  getDailyAssetStatisticCollection,
} = require("../../mongo");
const omit = require("lodash.omit");

function getQuery(from, to) {
  if (!from && !to) {
    return {};
  }

  let startTime = parseInt(from) * 1000;
  let endTime = parseInt(to) * 1000;
  if (isNaN(startTime) && isNaN(endTime)) {
    throw new HttpError(400, "Invalid from or to query param");
  }

  if (!isNaN(startTime) && !isNaN(endTime)) {
    return {
      $and: [
        { "indexer.blockTime": { $gte: startTime } },
        { "indexer.blockTime": { $lte: endTime } },
      ],
    };
  }

  if (!isNaN(startTime)) {
    return {
      "indexer.blockTime": { $gte: startTime },
    };
  }

  if (!isNaN(endTime)) {
    return {
      "indexer.blockTime": { $lte: endTime },
    };
  }

  return {};
}

async function getStatistic(ctx) {
  const { chain, blockHeight, assetId } = ctx.params;

  const assetCol = await getAssetCollection(chain);
  const asset = await assetCol.findOne({
    assetId: parseInt(assetId),
    "createdAt.blockHeight": parseInt(blockHeight),
  });
  if (!asset) {
    throw new HttpError(404, "Asset not found");
  }

  const { from, to } = ctx.query;
  const q = getQuery(from, to);

  const col = await getDailyAssetStatisticCollection(chain);
  const items = await col.find(q).sort({ "indexer.blockHeight": 1 }).toArray();

  ctx.body = (items || []).map((item) => omit(item, ["_id", "asset"]));
}

module.exports = {
  getStatistic,
};
