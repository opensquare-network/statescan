const { MongoClient } = require("mongodb");

function getDbName() {
  const dbName = process.env.MONGO_DB_SCAN_NAME;
  if (!dbName) {
    throw new Error("MONGO_DB_SCAN_NAME not set");
  }

  return dbName;
}

const statusCollectionName = "status";
const blockCollectionName = "block";
const eventCollectionName = "event";
const extrinsicCollectionName = "extrinsic";

// unFinalized collection names
const unFinalizedCollectionName = "unFinalizedBlock";
const unFinalizedExtrinsicCollectionName = "unFinalizedExtrinsic";
const unFinalizedEventCollectionName = "unFinalizedEvent";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_SCAN_URL || "mongodb://localhost:27017";
let statusCol = null;
let blockCol = null;
let eventCol = null;
let extrinsicCol = null;

// unFinalized collections
let unFinalizedBlockCol = null;
let unFinalizedExtrinsicCol = null;
let unFinalizedEventCol = null;

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
  blockCol = await getCollection(blockCollectionName);
  eventCol = await getCollection(eventCollectionName);
  extrinsicCol = await getCollection(extrinsicCollectionName);
  unFinalizedBlockCol = await getCollection(unFinalizedCollectionName);
  unFinalizedExtrinsicCol = await getCollection(
    unFinalizedExtrinsicCollectionName
  );
  unFinalizedEventCol = await getCollection(unFinalizedEventCollectionName);

  await _createIndexes();
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }
}

async function tryInit(col) {
  if (!col) {
    await initDb();
  }
}

async function getUnFinalizedEventCollection() {
  await tryInit(unFinalizedEventCol);
  return unFinalizedEventCol;
}

async function getUnFinalizedExrinsicCollection() {
  await tryInit(unFinalizedExtrinsicCol);
  return unFinalizedExtrinsicCol;
}

async function getUnFinalizedBlockCollection() {
  await tryInit(unFinalizedBlockCol);
  return unFinalizedBlockCol;
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

function withSession(fn) {
  return client.withSession(fn);
}

module.exports = {
  initDb,
  getStatusCollection,
  getBlockCollection,
  getExtrinsicCollection,
  getEventCollection,
  getUnFinalizedBlockCollection,
  getUnFinalizedExrinsicCollection,
  getUnFinalizedEventCollection,
  withSession,
};
