const { setOverview, getOverview } = require("./store");
const { overviewRoom, OVERVIEW_FEED_INTERVAL } = require("./constants");
const util = require("util");
const {
  getAssetTransferCollection,
  getAssetCollection,
  getAddressCollection,
  getNftClassCollection,
  getNftInstanceCollection,
} = require("../mongo");
const { getLatestBlocks } = require("../common/latestBlocks");
const { populateAssetInfo } = require("../common/asset");
const { lookupNftMetadata, lookupNftClass } = require("../common/nft");

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
  const nftInstanceCol = await getNftInstanceCollection();

  // Load latest 5 blocks
  const latestBlocks = await getLatestBlocks(5);

  // Load latest 5 transfers
  let latestTransfers = await transferCol
    .aggregate([
      { $match: { listIgnore: false } },
      { $sort: { "indexer.blockHeight": -1 } },
      { $limit: 5 },
    ])
    .toArray();
  latestTransfers = await populateAssetInfo(latestTransfers);

  // Load 5 most popular assets
  const popularAssets = await assetCol
    .find({ destroyedAt: null })
    .sort({
      accounts: -1,
    })
    .limit(5)
    .toArray();

  const [
    {
      popularNftClasses,
      recognizedNftClasses: [
        {
          count: recognizedNftClassesCount
        } = { count: 0 }
      ]
    }
  ] = await nftClassCol.aggregate([
    {
      $match: {
        isDestroyed: false,
      }
    },
    ...lookupNftMetadata(),
    {
      $facet: {
        popularNftClasses: [
          {
            $sort: {
              "nftMetadata.recognized": -1,
              "details.instances": -1,
            }
          },
          { $limit: 5 },
        ],
        recognizedNftClasses: [
          {
            $match: {
              "nftMetadata.recognized": true,
            }
          },
          {
            $count: "count"
          }
        ],
      }
    },
  ]).toArray();

  const [{
    nftInstances: [
      {
        count: nftInstancesCount
      } = { count: 0 }
    ],
    recognizedNftInstances: [
      {
        count: recognizedNftInstancesCount
      } = { count: 0 }
    ],
  }] = await nftInstanceCol.aggregate([
    {
      $match: {
        isDestroyed: false,
      }
    },
    ...lookupNftMetadata(),
    ...lookupNftClass({ isDestroyed: false }),
    {
      $match: {
        nftClass: { $exists: true },
      },
    },
    {
      $facet: {
        nftInstances: [
          {
            $count: "count"
          }
        ],
        recognizedNftInstances: [
          {
            $match: {
              $or: [
                { "nftMetadata.recognized": true },
                {
                  $and: [
                    { nftMetadata: null },
                    { "nftClass.nftMetadata.recognized": true },
                  ],
                },
              ]
            }
          },
          {
            $count: "count"
          }
        ]
      }
    },
  ]).toArray();

  // Calculate counts
  const assetsCount = await assetCol.countDocuments({ destroyedAt: null });
  const holdersCount = await addressCol.countDocuments({
    $or: [{ providers: { $ne: 0 } }, { sufficients: { $ne: 0 } }],
  });
  const transfersCount = await transferCol.countDocuments();
  const nftClassesCount = await nftClassCol.countDocuments({ isDestroyed: false });

  return {
    latestBlocks,
    latestTransfers,
    popularAssets,
    popularNftClasses,
    assetsCount,
    holdersCount,
    transfersCount,
    nftClassesCount: {
      total: nftClassesCount,
      recognized: recognizedNftClassesCount,
    },
    nftInstancesCount: {
      total: nftInstancesCount,
      recognized: recognizedNftInstancesCount,
    }
  };
}

module.exports = {
  feedOverview,
};
