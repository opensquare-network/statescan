const { MongoClient } = require("mongodb");

const dbName = process.env.MONGO_DB_PRICE_NAME || "price";

const ksmUsdtMonthlyCollectionName = "ksmUsdtMonthly";
const dotUsdtMonthlyCollectionName = "dotUsdtMonthly";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
let ksmUsdtMonthlyCol = null;
let dotUsdtMonthlyCol = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  db = client.db(dbName);
  ksmUsdtMonthlyCol = db.collection(ksmUsdtMonthlyCollectionName);
  dotUsdtMonthlyCol = db.collection(dotUsdtMonthlyCollectionName);

  await _createIndexes();
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  ksmUsdtMonthlyCol.createIndex({ openTime: 1 });
  dotUsdtMonthlyCol.createIndex({ openTime: 1 });
}

async function tryInit(col) {
  if (!col) {
    await initDb();
  }
}

async function getKsmUsdtMonthlyCollection() {
  await tryInit(ksmUsdtMonthlyCol);
  return ksmUsdtMonthlyCol;
}

async function getDotUsdtMonthlyCollection() {
  await tryInit(dotUsdtMonthlyCol);
  return dotUsdtMonthlyCol;
}

module.exports = {
  initDb,
  getKsmUsdtMonthlyCollection,
  getDotUsdtMonthlyCollection,
};
