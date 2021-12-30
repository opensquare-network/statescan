const { MongoClient } = require("mongodb");

function getDbName() {
  const dbName = process.env.MONGO_DB_SCAN_NAME;
  if (!dbName) {
    throw new Error("MONGO_DB_SCAN_NAME not set");
  }

  return dbName;
}

const statusCollectionName = "status";
const assetTransferCollectionName = "assetTransfer";
const assetCollectionName = "asset";
const assetHolderCollectionName = "assetHolder";
const addressCollectionName = "address";
const approvalCollectionName = "approval";

// Statistic
const dailyAssetStatisticCollectionName = "dailyAssetStatistic";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_SCAN_URL || "mongodb://localhost:27017";
let statusCol = null;
let assetTransferCol = null;
let assetCol = null;
let assetHolderCol = null;
let rawAddressCol = null;
let addressCol = null;
let approvalCol = null;

let dailyAssetStatisticCol = null;

async function getCollection(colName) {
  return new Promise((resolve, reject) => {
    db.listCollections({ name: colName }).next(async (err, info) => {
      if (!info) {
        const col = await db.createCollection(colName);
        resolve(col);
      } else if (err) {
        reject(err);
      }

      resolve(db.collection(colName));
    });
  });
}

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  const dbName = getDbName();
  console.log(`Use scan DB name:`, dbName);

  db = client.db(dbName);

  statusCol = await getCollection(statusCollectionName);
  assetTransferCol = await getCollection(assetTransferCollectionName);
  assetCol = await getCollection(assetCollectionName);
  assetHolderCol = await getCollection(assetHolderCollectionName);
  rawAddressCol = await getCollection("rawAddress");
  addressCol = await getCollection(addressCollectionName);
  approvalCol = await getCollection(approvalCollectionName);
  dailyAssetStatisticCol = await getCollection(
    dailyAssetStatisticCollectionName
  );

  await _createIndexes();
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  rawAddressCol.createIndex({ updated: 1 });
}

async function tryInit(col) {
  if (!col) {
    await initDb();
  }
}

async function getDailyAssetStatisticCollection() {
  await tryInit(dailyAssetStatisticCol);
  return dailyAssetStatisticCol;
}

async function getStatusCollection() {
  await tryInit(statusCol);
  return statusCol;
}

async function getAssetTransferCollection() {
  await tryInit(assetTransferCol);
  return assetTransferCol;
}

async function getAssetCollection() {
  await tryInit(assetCol);
  return assetCol;
}

async function getAssetHolderCollection() {
  await tryInit(assetHolderCol);
  return assetHolderCol;
}

async function getAddressCollection() {
  await tryInit(addressCol);
  return addressCol;
}

async function getRawAddressCollection() {
  await tryInit(rawAddressCol);
  return rawAddressCol;
}

async function getAssetApprovalCollection() {
  await tryInit(approvalCol);
  return approvalCol;
}

module.exports = {
  initDb,
  getStatusCollection,
  getAssetTransferCollection,
  getAssetCollection,
  getAssetHolderCollection,
  getAddressCollection,
  getRawAddressCollection,
  getAssetApprovalCollection,
  getDailyAssetStatisticCollection,
};
