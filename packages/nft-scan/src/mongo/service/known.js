const {
  env: { getScanStep },
} = require("@statescan/common");
const { getHeightCollection } = require("../knownHeight");

async function getNextKnownHeights(beginHeight) {
  const step = getScanStep();
  const col = await getHeightCollection();
  const records = await col
    .find({
      height: { $gte: beginHeight },
    })
    .sort({ height: 1 })
    .limit(step)
    .toArray();

  return (records || []).map((item) => item.height);
}

async function saveKnownHeights(heights = []) {
  if (heights.length <= 0) {
    return;
  }

  const col = await getHeightCollection();
  const bulk = col.initializeUnorderedBulkOp();
  for (const height of heights) {
    bulk.find({ height }).upsert().updateOne({ $set: { height } });
  }

  await bulk.execute();
}

module.exports = {
  saveKnownHeights,
  getNextKnownHeights,
};
