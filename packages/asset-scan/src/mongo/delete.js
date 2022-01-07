const {
  getAssetTransferCollection,
  getAssetCollection,
  getAssetTimelineCollection,
} = require("./index");

async function deleteFromHeight(height) {
  let col = await getAssetTransferCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: height } });

  col = await getAssetCollection();
  await col.deleteMany({ "createdAt.blockHeight": { $gte: height } });

  col = await getAssetTimelineCollection();
  await col.deleteMany({ "indexer.blockHeight": { $gte: height } });
}

module.exports = {
  deleteFromHeight,
};
