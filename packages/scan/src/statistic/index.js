const {
  getAssetHolderCollection,
  getAssetTransferCollection,
  getAssetCollection,
  getDailyAssetStatisticCollection,
} = require("../mongo");
const moment = require("moment-timezone");
const BigNumber = require("bignumber.js");
const { statisticLogger } = require("../logger");

async function makeAssetStatistics(blockIndexer) {
  if (!blockIndexer.blockTime) {
    return;
  }

  const assets = await getAllAssets();

  const promises = [];
  for (const asset of assets) {
    promises.push(getAssetData(asset._id, blockIndexer.blockTime));
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
    .find({}, { projection: { assetId: 1, symbol: 1 } })
    .toArray();
}

async function getAssetData(assetMongoId, timestamp) {
  const [{ count, amount }, holderCount] = await Promise.all([
    getAssetDayTransferData(assetMongoId, timestamp),
    getHoldersCountByAssetId(assetMongoId),
  ]);

  return {
    asset: assetMongoId,
    transferCount: count,
    transferAmount: amount,
    holderCount,
  };
}

async function getAssetDayTransferData(assetId, timestamp) {
  const startTime = moment(timestamp).utc().startOf("day").toDate().getTime();

  const col = await getAssetTransferCollection();
  const transfers = await col
    .find(
      {
        $and: [
          { "indexer.blockTime": { $gte: startTime } },
          { "indexer.blockTime": { $lte: timestamp } },
          // { asset: assetId },
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

async function getHoldersCountByAssetId(assetId) {
  const col = await getAssetHolderCollection();
  return await col.count({ asset: assetId, dead: false });
}

module.exports = {
  makeAssetStatistics,
};
