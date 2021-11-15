const { MongoClient } = require("mongodb");

function getDbName() {
  const dbName = process.env.MONGO_DB_SCAN_NAME;
  if (!dbName) {
    throw new Error("MONGO_DB_SCAN_NAME not set");
  }

  return dbName;
}

const mongoUrl = process.env.MONGO_SCAN_URL || "mongodb://localhost:27017";
const statusCollectionName = "status";
const classCollectionName = "nftClass";
const classTimelineCollectionName = "classTimeline";
const classAttributeCollectionName = "classAttribute";
const instanceCollectionName = "nftInstance";
const instanceTimelineCollectionName = "instanceTimeline";
const instanceAttributeCollectionName = "instanceAttribute";
const nftMetadataCollectionName = "nftMetadata";
const nftTransferCollectionName = "nftTransfer";

let statusCol = null;
let classCol = null;
let classTimelineCol = null;
let classAttributeCol = null;
let instanceCol = null;
let instanceTimelineCol = null;
let instanceAttributeCol = null;
let nftMetadataCol = null;
let nftTransferCol = null;

let client = null;
let db = null;

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
  classCol = await getCollection(classCollectionName);
  classTimelineCol = await getCollection(classTimelineCollectionName);
  classAttributeCol = await getCollection(classAttributeCollectionName);
  instanceCol = await getCollection(instanceCollectionName);
  instanceTimelineCol = await getCollection(instanceTimelineCollectionName);
  instanceAttributeCol = await getCollection(instanceAttributeCollectionName);
  nftMetadataCol = await getCollection(nftMetadataCollectionName);
  nftTransferCol = await getCollection(nftTransferCollectionName);

  await _createIndexes();
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  classCol.createIndex({ classId: 1 });
  classCol.createIndex({ classId: 1, isDestroyed: 1 });

  classTimelineCol.createIndex({ classId: 1, classHeight: 1 });
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

async function getClassCollection() {
  await tryInit(classCol);
  return classCol;
}

async function getClassTimelineCollection() {
  await tryInit(classTimelineCol);
  return classTimelineCol;
}

async function getClassAttributeCollection() {
  await tryInit(classAttributeCol);
  return classAttributeCol;
}

async function getInstanceCollection() {
  await tryInit(instanceCol);
  return instanceCol;
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

module.exports = {
  initDb,
  getStatusCollection,
  getClassCollection,
  getClassTimelineCollection,
  getClassAttributeCollection,
  getInstanceCollection,
  getInstanceTimelineCollection,
  getInstanceAttributeCollection,
  getNftMetadataCollection,
  getNftTransferCollection,
};
