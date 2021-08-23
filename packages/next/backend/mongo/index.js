const { MongoClient } = require("mongodb");

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";

const statusCollectionName = "status";
const blockCollectionName = "block";
const eventCollectionName = "event";
const extrinsicCollectionName = "extrinsic";
const assetTransferCollectionName = "assetTransfer";
const assetCollectionName = "asset";
const assetHolderCollectionName = "assetHolder";
const addressCollectionName = "address";
const teleportCollectionName = "teleport";

// unFinalized collections
const unFinalizedCollectionName = "unFinalizedBlock";
const unFinalizedExtrinsicCollectionName = "unFinalizedExtrinsic";
const unFinalizedEventCollectionName = "unFinalizedEvent";

// Statistic
const dailyAssetStatisticCollectionName = "dailyAssetStatistic";

let client = null;
let db = null;

let statusCol = null;
let blockCol = null;
let eventCol = null;
let extrinsicCol = null;
let assetTransferCol = null;
let assetCol = null;
let assetHolderCol = null;
let addressCol = null;
let teleportCol = null;

let unFinalizedBlockCol = null;
let unFinalizedExtrinsicCol = null;
let unFinalizedEventCol = null;

let dailyAssetStatisticCol = null;

function getDbName() {
  const dbName = process.env.MONGO_DB_NAME;
  if (!dbName) {
    throw new Error("MONGO_DB_NAME not set");
  }

  return dbName;
}

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  const dbName = getDbName();
  console.log(`Use scan DB name:`, dbName);

  db = client.db(dbName);
  statusCol = db.collection(statusCollectionName);
  blockCol = db.collection(blockCollectionName);
  eventCol = db.collection(eventCollectionName);
  extrinsicCol = db.collection(extrinsicCollectionName);
  assetTransferCol = db.collection(assetTransferCollectionName);
  assetCol = db.collection(assetCollectionName);
  assetHolderCol = db.collection(assetHolderCollectionName);
  addressCol = db.collection(addressCollectionName);
  teleportCol = db.collection(teleportCollectionName);

  unFinalizedBlockCol = db.collection(unFinalizedCollectionName);
  unFinalizedExtrinsicCol = db.collection(unFinalizedExtrinsicCollectionName);
  unFinalizedEventCol = db.collection(unFinalizedEventCollectionName);

  dailyAssetStatisticCol = db.collection(dailyAssetStatisticCollectionName);

  await _createIndexes();
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  blockCol.createIndex({ hash: 1 });
  blockCol.createIndex({ "header.number": -1 });

  extrinsicCol.createIndex({ hash: 1 });
  extrinsicCol.createIndex({ "indexer.blockHash": 1, "indexer.index": -1 });
  extrinsicCol.createIndex({
    "indexer.blockHeight": -1,
    "indexer.index": -1,
  });
  extrinsicCol.createIndex({
    signer: 1,
    "indexer.blockHeight": -1,
    "indexer.index": -1,
  });
  extrinsicCol.createIndex({
    section: 1,
    name: 1,
    "indexer.blockHeight": -1,
    "indexer.index": -1,
  });

  eventCol.createIndex({ "indexer.blockHash": 1, sort: -1 });
  eventCol.createIndex({ "indexer.blockHeight": -1, sort: -1 });
  eventCol.createIndex({ extrinsicHash: 1, sort: -1 });
  eventCol.createIndex({
    "indexer.blockHeight": -1,
    "phase.value": -1,
    sort: -1,
  });
  eventCol.createIndex({
    section: 1,
    method: 1,
    "indexer.blockHeight": -1,
    sort: -1,
  });

  addressCol.createIndex({ address: 1 });
  addressCol.createIndex({ "data.free": -1 });

  assetCol.createIndex({ assetId: 1 });
  assetCol.createIndex({ symbol: 1 });
  assetCol.createIndex({ name: 1 });

  assetHolderCol.createIndex({ address: 1, balance: -1 });

  assetTransferCol.createIndex({ from: 1, "indexer.blockHeight": -1 });
  assetTransferCol.createIndex({ to: 1, "indexer.blockHeight": -1 });
  assetTransferCol.createIndex({ asset: 1, from: 1 });
  assetTransferCol.createIndex({ asset: 1, to: 1 });
}

async function tryInit(col) {
  if (!col) {
    await initDb();
  }
}

async function getStatusCollection() {
  await tryInit(statusCol);
  return statusCol;
}

async function getBlockCollection() {
  await tryInit(blockCol);
  return blockCol;
}

async function getExtrinsicCollection() {
  await tryInit(extrinsicCol);
  return extrinsicCol;
}

async function getEventCollection() {
  await tryInit(eventCol);
  return eventCol;
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

async function getTeleportCollection() {
  await tryInit(teleportCol);
  return teleportCol;
}

async function getUnFinalizedBlockCollection() {
  await tryInit(unFinalizedBlockCol);
  return unFinalizedBlockCol;
}

async function getUnFinalizedEventCollection() {
  await tryInit(unFinalizedEventCol);
  return unFinalizedEventCol;
}

async function getUnFinalizedExrinsicCollection() {
  await tryInit(unFinalizedExtrinsicCol);
  return unFinalizedExtrinsicCol;
}

async function getDailyAssetStatisticCollection() {
  await tryInit(dailyAssetStatisticCol);
  return dailyAssetStatisticCol;
}

module.exports = {
  initDb,
  getStatusCollection,
  getBlockCollection,
  getExtrinsicCollection,
  getEventCollection,
  getAssetTransferCollection,
  getAssetCollection,
  getAssetHolderCollection,
  getAddressCollection,
  getTeleportCollection,
  getUnFinalizedBlockCollection,
  getUnFinalizedEventCollection,
  getUnFinalizedExrinsicCollection,
  getDailyAssetStatisticCollection,
};
