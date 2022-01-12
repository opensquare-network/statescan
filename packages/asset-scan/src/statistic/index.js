const {
  getAssetHolderCollection,
  getAssetTransferCollection,
  getAssetCollection,
  getDailyAssetStatisticCollection,
} = require("../mongo");
const moment = require("moment-timezone");
const BigNumber = require("bignumber.js");
const { statisticLogger } = require("@statescan/common");

async function makeAssetStatistics(blockIndexer) {
  if (!blockIndexer.blockTime) {
    return;
  }

  const assets = await getAllAssets();
  if ((assets || []).length <= 0) {
    return;
  }

  const promises = [];
  for (const asset of assets) {
    promises.push(
      getAssetData(
        asset.assetId,
        asset.createdAt.blockHeight,
        blockIndexer.blockTime
      )
    );
  }

  const dataArr = await Promise.all(promises);
  const normalizedDataArr = dataArr.map((data) => ({
    ...data,
    indexer: blockIndexer,
  }));

  const col = await getDailyAssetStatisticCollection();
  const bulk = col.initializeUnorderedBulkOp();
  for (const data of normalizedDataArr) {
    bulk.insert(data);
  }
  await bulk.execute();

  statisticLogger.info(`Statistic updated at ${JSON.stringify(blockIndexer)}`);
}

async function getAllAssets() {
  const col = await getAssetCollection();
  return await col
    .find({}, { projection: { assetId: 1, symbol: 1, createdAt: 1 } })
    .toArray();
}

async function getAssetData(assetId, assetHeight, timestamp) {
  const [{ count, amount }, holderCount] = await Promise.all([
    getAssetDayTransferData(assetId, assetHeight, timestamp),
    getHoldersCountByAssetId(assetId, assetHeight),
  ]);

  return {
    assetId,
    assetHeight,
    transferCount: count,
    transferAmount: amount,
    holderCount,
  };
}

async function getAssetDayTransferData(assetId, assetHeight, timestamp) {
  const startTime = moment(timestamp).utc().startOf("day").toDate().getTime();

  const col = await getAssetTransferCollection();
  const transfers = await col
    .find(
      {
        $and: [
          { "indexer.blockTime": { $gte: startTime } },
          { "indexer.blockTime": { $lte: timestamp } },
          { assetId }, // fixme: asset should have created height
          { assetHeight },
        ],
      },
      {
        projection: { balance: 1 },
      }
    )
    .toArray();

  const amount = (transfers || []).reduce((result, { balance }) => {
    return new BigNumber(result).plus(balance).toNumber();
  }, 0);

  return {
    count: (transfers || []).length,
    amount,
  };
}

async function getHoldersCountByAssetId(assetId, assetHeight) {
  const col = await getAssetHolderCollection();
  return await col.count({ assetId, assetHeight });
}

module.exports = {
  makeAssetStatistics,
};
