const { setOverview, getOverview } = require("./store");
const { overviewRoom, OVERVIEW_FEED_INTERVAL } = require("./constants");
const util = require("util");
const {
  getBlockCollection,
  getAssetTransferCollection,
  getAssetCollection,
  getAddressCollection,
} = require("../mongo");

async function feedOverview(chain, io) {
  try {
    const oldStoreOverview = getOverview(chain);
    const overview = await calcOverview(chain);

    if (util.isDeepStrictEqual(overview, oldStoreOverview)) {
      return;
    }

    setOverview(chain, overview);
    io.to(overviewRoom).emit("overview", overview);
  } catch (e) {
    console.error("feed overview error:", e);
  } finally {
    setTimeout(feedOverview.bind(null, chain, io), OVERVIEW_FEED_INTERVAL);
  }
}

async function calcOverview(chain) {
  const blockCol = await getBlockCollection(chain);
  const transferCol = await getAssetTransferCollection(chain);
  const addressCol = await getAddressCollection(chain);
  const assetCol = await getAssetCollection(chain);

  // Load latest 5 blocks
  const latestBlocks = await blockCol
    .find({}, { projection: { extrinsics: 0 } })
    .sort({
      "header.number": -1,
    })
    .limit(5)
    .toArray();

  // Load latest 5 transfers
  const latestTransfers = await transferCol
    .aggregate([
      { $sort: { "indexer.blockHeight": -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "asset",
          localField: "asset",
          foreignField: "_id",
          as: "asset",
        },
      },
      {
        $addFields: {
          asset: { $arrayElemAt: ["$asset", 0] },
        },
      },
      {
        $addFields: {
          assetId: "$asset.assetId",
          assetCreatedAt: "$asset.createdAt",
          assetSymbol: "$asset.symbol",
          assetName: "$asset.name",
          assetDecimals: "$asset.decimals",
        },
      },
      {
        $project: { asset: 0 },
      },
    ])
    .toArray();

  // Load 5 most popular assets
  const popularAssets = await assetCol
    .find({})
    .sort({
      accounts: -1,
    })
    .limit(5)
    .toArray();

  // Calculate counts
  const assetsCount = await assetCol.countDocuments();
  const holdersCount = await addressCol.countDocuments({
    $or: [{ providers: { $ne: 0 } }, { sufficients: { $ne: 0 } }],
  });
  const transfersCount = await transferCol.countDocuments();

  return {
    latestBlocks,
    latestTransfers,
    popularAssets,
    assetsCount,
    holdersCount,
    transfersCount,
  };
}

module.exports = {
  feedOverview,
};
