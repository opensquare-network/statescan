const { MongoClient } = require("mongodb");

const mongoUrl = process.env.MONGO_SERVER_URL || "mongodb://localhost:27017";

const statusCollectionName = "status";
const blockCollectionName = "block";
const eventCollectionName = "event";
const extrinsicCollectionName = "extrinsic";
const assetTransferCollectionName = "assetTransfer";
const assetCollectionName = "asset";
const assetHolderCollectionName = "assetHolder";
const addressCollectionName = "address";

// unFinalized collections
const unFinalizedCollectionName = "unFinalizedBlock";
const unFinalizedExtrinsicCollectionName = "unFinalizedExtrinsic";
const unFinalizedEventCollectionName = "unFinalizedEvent";

// Statistic
const dailyAssetStatisticCollectionName = "dailyAssetStatistic";

// NFT
const nftClassCollectionName = "nftClass";
const classTimelineCollectionName = "classTimeline";
const classAttributeCollectionName = "classAttribute";
const nftInstanceCollectionName = "nftInstance";
const instanceTimelineCollectionName = "instanceTimeline";
const instanceAttributeCollectionName = "instanceAttribute";
const nftMetadataCollectionName = "nftMetadata";
const nftTransferCollectionName = "nftTransfer";

// XCM
const teleportInCollectionName = "teleportIn";
const teleportOutCollectionName = "teleportOut";

let client = null;
let db = null;
let nftDb = null;
let xcmDb = null;

let statusCol = null;
let blockCol = null;
let eventCol = null;
let extrinsicCol = null;
let assetTransferCol = null;
let assetCol = null;
let assetHolderCol = null;
let addressCol = null;

let unFinalizedBlockCol = null;
let unFinalizedExtrinsicCol = null;
let unFinalizedEventCol = null;

let dailyAssetStatisticCol = null;

let nftClassCol = null;
let classTimelineCol = null;
let classAttributeCol = null;
let nftInstanceCol = null;
let instanceTimelineCol = null;
let instanceAttributeCol = null;
let nftMetadataCol = null;
let nftTransferCol = null;

let teleportInCol = null;
let teleportOutCol = null;

function getDbName() {
  const dbName = process.env.MONGO_DB_NAME;
  if (!dbName) {
    throw new Error("MONGO_DB_NAME not set");
  }

  return dbName;
}

function getNftDbName() {
  const nftDbName = process.env.MONGO_DB_NFT_NAME;
  if (!nftDbName) {
    throw new Error("MONGO_DB_NFT_NAME not set");
  }

  return nftDbName;
}

function getXcmDbName() {
  const xcmDbName = process.env.MONGO_DB_XCM_NAME;
  if (!xcmDbName) {
    throw new Error("MONGO_DB_XCM_NAME not set");
  }

  return xcmDbName;
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

  unFinalizedBlockCol = db.collection(unFinalizedCollectionName);
  unFinalizedExtrinsicCol = db.collection(unFinalizedExtrinsicCollectionName);
  unFinalizedEventCol = db.collection(unFinalizedEventCollectionName);

  dailyAssetStatisticCol = db.collection(dailyAssetStatisticCollectionName);

  const nftDbName = getNftDbName();
  console.log(`Use nft scan DB name:`, nftDbName);

  nftDb = client.db(nftDbName);
  nftClassCol = nftDb.collection(nftClassCollectionName);
  classTimelineCol = nftDb.collection(classTimelineCollectionName);
  classAttributeCol = nftDb.collection(classAttributeCollectionName);
  nftInstanceCol = nftDb.collection(nftInstanceCollectionName);
  instanceTimelineCol = nftDb.collection(instanceTimelineCollectionName);
  instanceAttributeCol = nftDb.collection(instanceAttributeCollectionName);
  nftMetadataCol = nftDb.collection(nftMetadataCollectionName);
  nftTransferCol = nftDb.collection(nftTransferCollectionName);

  const xcmDbName = getXcmDbName();
  xcmDb = client.db(xcmDbName);
  teleportInCol = xcmDb.collection(teleportInCollectionName);
  teleportOutCol = xcmDb.collection(teleportOutCollectionName);

  await _createIndexes();
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  blockCol.createIndex({ hash: 1 });
  blockCol.createIndex({ "header.number": -1 });
  blockCol.createIndex({ blockTime: -1 });

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
  extrinsicCol.createIndex({
    listIgnore: 1,
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
  eventCol.createIndex({
    listIgnore: 1,
    section: 1,
    method: 1,
    "indexer.blockHeight": -1,
    sort: -1,
  });

  addressCol.createIndex({ address: 1 });
  addressCol.createIndex({ "data.total": -1 });

  assetCol.createIndex({ assetId: 1 });
  assetCol.createIndex({ symbol: 1 });
  assetCol.createIndex({ name: 1 });

  assetHolderCol.createIndex({ address: 1, balance: -1 });

  assetTransferCol.createIndex({ from: 1, "indexer.blockHeight": -1 });
  assetTransferCol.createIndex({ to: 1, "indexer.blockHeight": -1 });
  assetTransferCol.createIndex({ asset: 1, from: 1 });
  assetTransferCol.createIndex({ asset: 1, to: 1 });
  assetTransferCol.createIndex({ "indexer.blockHeight": -1 });
  assetTransferCol.createIndex({ listIgnore: 1, "indexer.blockHeight": -1 });

  nftClassCol.createIndex({ classId: 1, "indexer.blockHeight": -1 });
  nftClassCol.createIndex({ dataHash: 1 }, { sparse: true });

  nftInstanceCol.createIndex({
    classId: 1,
    classHeight: -1,
    instanceId: 1,
    "indexer.blockHeight": -1,
  });
  nftInstanceCol.createIndex({ dataHash: 1 }, { sparse: true });

  nftMetadataCol.createIndex({ dataHash: 1 });
  nftMetadataCol.createIndex({ name: 1 }, { sparse: true });
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

async function getNftClassCollection() {
  await tryInit(nftClassCol);
  return nftClassCol;
}

async function getClassTimelineCollection() {
  await tryInit(classTimelineCol);
  return classTimelineCol;
}

async function getClassAttributeCollection() {
  await tryInit(classAttributeCol);
  return classAttributeCol;
}

async function getNftInstanceCollection() {
  await tryInit(nftInstanceCol);
  return nftInstanceCol;
}

async function getInstanceTimelineCollection() {
  await tryInit(instanceTimelineCol);
  return instanceTimelineCol;
}

async function getInstanceAttributeCollection() {
  await tryInit(instanceAttributeCol);
  return instanceAttributeCol;
}

async function getNftMetadataCollection() {
  await tryInit(nftMetadataCol);
  return nftMetadataCol;
}

async function getNftTransferCollection() {
  await tryInit(nftTransferCol);
  return nftTransferCol;
}

async function getTeleportInCollection() {
  await tryInit(teleportInCol);
  return teleportInCol;
}

async function getTeleportOutCollection() {
  await tryInit(teleportOutCol);
  return teleportOutCol;
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
  getUnFinalizedBlockCollection,
  getUnFinalizedEventCollection,
  getUnFinalizedExrinsicCollection,
  getDailyAssetStatisticCollection,
  getNftClassCollection,
  getClassTimelineCollection,
  getClassAttributeCollection,
  getNftInstanceCollection,
  getInstanceTimelineCollection,
  getInstanceAttributeCollection,
  getNftMetadataCollection,
  getNftTransferCollection,
  getTeleportInCollection,
  getTeleportOutCollection,
};
