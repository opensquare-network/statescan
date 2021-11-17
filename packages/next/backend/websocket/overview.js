const { setOverview, getOverview } = require("./store");
const { overviewRoom, OVERVIEW_FEED_INTERVAL } = require("./constants");
const util = require("util");
const {
  getAssetTransferCollection,
  getAssetCollection,
  getAddressCollection,
  getNftClassCollection,
} = require("../mongo");
const { getLatestBlocks } = require("../common/latestBlocks");

async function feedOverview(io) {
  try {
    const oldStoreOverview = getOverview();
    const overview = await calcOverview();

    if (util.isDeepStrictEqual(overview, oldStoreOverview)) {
      return;
    }

    setOverview(overview);
    io.to(overviewRoom).emit("overview", overview);
  } catch (e) {
    console.error("feed overview error:", e);
  } finally {
    setTimeout(feedOverview.bind(null, io), OVERVIEW_FEED_INTERVAL);
  }
}

async function calcOverview() {
  const transferCol = await getAssetTransferCollection();
  const addressCol = await getAddressCollection();
  const assetCol = await getAssetCollection();
  const nftClassCol = await getNftClassCollection();

  // Load latest 5 blocks
  const latestBlocks = await getLatestBlocks(5);

  // Load latest 5 transfers
  const latestTransfers = await transferCol
    .aggregate([
      { $match: { listIgnore: false } },
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

  const popularNftClasses = await nftClassCol.aggregate([
    {
      $lookup: {
        from: "nftMetadata",
        localField: "dataHash",
        foreignField: "dataHash",
        as: "nftMetadata",
      }
    },
    {
      $addFields: {
        nftMetadata: {
          $arrayElemAt: ["$nftMetadata", 0]
        }
      }
    },
    {
      $sort: {
        "nftMetadata.recognized": -1,
        "details.instances": -1,
      }
    },
    { $limit: 5 },
  ]).toArray();

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
    popularNftClasses,
    assetsCount,
    holdersCount,
    transfersCount,
  };
}

module.exports = {
  feedOverview,
};
