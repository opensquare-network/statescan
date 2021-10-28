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

let statusCol = null;
let classCol = null;
let classTimelineCol = null;
let classAttributeCol = null;

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

module.exports = {
  initDb,
  getStatusCollection,
  getClassCollection,
  getClassTimelineCollection,
  getClassAttributeCollection,
};
