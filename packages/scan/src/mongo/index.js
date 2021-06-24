const { MongoClient } = require("mongodb");
const { currentChain, CHAINS } = require("../envvars");

function getDbName() {
  const chain = currentChain();
  if (CHAINS.STATEMINE === chain) {
    return process.env.MONGO_DB_KSM_NAME || "statescan-ksm";
  } else if (CHAINS.WESTMINT === chain) {
    return process.env.MONGO_DB_WND_NAME || "statescan-wnd";
  } else {
    return process.env.MONGO_DB_ROC_NAME || "statescan-roc";
  }
}

const statusCollectionName = "status";
const blockCollectionName = "block";
const eventCollectionName = "event";
const extrinsicCollectionName = "extrinsic";
const assetTransferCollectionName = "assetTransfer";
const assetCollectionName = "asset";
const assetHolderCollectionName = "assetHolder";
const addressCollectionName = "address";
const approvalCollectionName = "approval";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
let statusCol = null;
let blockCol = null;
let eventCol = null;
let extrinsicCol = null;
let assetTransferCol = null;
let assetCol = null;
let assetHolderCol = null;
let addressCol = null;
let approvalCol = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  db = client.db(getDbName());
  statusCol = db.collection(statusCollectionName);
  blockCol = db.collection(blockCollectionName);
  eventCol = db.collection(eventCollectionName);
  extrinsicCol = db.collection(extrinsicCollectionName);
  assetTransferCol = db.collection(assetTransferCollectionName);
  assetCol = db.collection(assetCollectionName);
  assetHolderCol = db.collection(assetHolderCollectionName);
  addressCol = db.collection(addressCollectionName);
  approvalCol = db.collection(approvalCollectionName);

  await _createIndexes();
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  // TODO: create indexes for better query performance
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

async function getAssetApprovalCollection() {
  await tryInit(approvalCol);
  return approvalCol;
}

module.exports = {
  getStatusCollection,
  getBlockCollection,
  getExtrinsicCollection,
  getEventCollection,
  getAssetTransferCollection,
  getAssetCollection,
  getAssetHolderCollection,
  getAddressCollection,
  getAssetApprovalCollection,
};
