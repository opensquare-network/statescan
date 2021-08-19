const { HttpError } = require("../../exc");
const {
  getAssetCollection,
  getDailyAssetStatisticCollection,
} = require("../../mongo");
const omit = require("lodash.omit");

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
  let startTime = parseInt(from) * 1000;
  let endTime = parseInt(to) * 1000;
  if (isNaN(startTime) || isNaN(endTime)) {
    throw new HttpError(400, "Invalid from or to query param");
  }

  let q = {};
  if (typeof startTime === "number" && typeof endTime === "number") {
    q = {
      $and: [
        { "indexer.blockTime": { $gte: startTime } },
        { "indexer.blockTime": { $lte: endTime } },
      ],
    };
  } else if (typeof startTime === "number") {
    q = {
      "indexer.blockTime": { $gte: startTime },
    };
  } else if (typeof endTime === "number") {
    q = {
      "indexer.blockTime": { $lte: endTime },
    };
  }

  const col = await getDailyAssetStatisticCollection(chain);
  const items = await col.find(q).sort({ "indexer.blockHeight": 1 }).toArray();

  return (items || []).map((item) => omit(item, ["_id", "asset"]));
}

module.exports = {
  getStatistic,
};
