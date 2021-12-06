const { MongoClient } = require("mongodb");

function getDbName() {
  const dbName = process.env.MONGO_ACCOUNT_DB_NAME;
  if (!dbName) {
    throw new Error("MONGO_ACCOUNT_DB_NAME not set");
  }

  return dbName;
}

const mongoUrl = process.env.MONGO_ACCOUNT_URL || "mongodb://localhost:27017";
let rawAddressCol = null;
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
  console.log(`rawAddress DB name:`, dbName);

  db = client.db(dbName);

  rawAddressCol = await getCollection("rawAddress");

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

async function getRawAddressCollection() {
  await tryInit(rawAddressCol);
  return rawAddressCol;
}

async function updateAddrs(addrs = []) {
  if (addrs.length <= 0) {
    return;
  }

  const col = await getRawAddressCollection();
  const bulk = col.initializeUnorderedBulkOp();
  for (const addr of addrs) {
    bulk
      .find({ address: addr })
      .upsert()
      .updateOne({ $set: { updated: false } });
  }

  await bulk.execute();
}

module.exports = {
  updateAddrs,
};
