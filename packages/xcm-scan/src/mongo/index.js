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
const teleportCollectionName = "teleport";
let statusCol = null;
let teleportCol = null;

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
  console.log(`XCM scan DB name:`, dbName);

  db = client.db(dbName);

  statusCol = await getCollection(statusCollectionName);
  teleportCol = await getCollection(teleportCollectionName);

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

async function getStatusCollection() {
  await tryInit(statusCol);
  return statusCol;
}

async function getTeleportCollection() {
  await tryInit(teleportCol);
  return teleportCol;
}

module.exports = {
  initDb,
  getStatusCollection,
  getTeleportCollection,
};
