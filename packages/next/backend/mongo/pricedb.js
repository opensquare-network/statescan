const { MongoClient } = require("mongodb");

const dbName = process.env.MONGO_DB_PRICE_NAME || "price";

const ksmUsdtDailyCollectionName = "ksmUsdtDaily";
const dotUsdtDailyCollectionName = "dotUsdtDaily";
const litUsdtDailyCollectionName = "litUsdtDaily";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_PRICE_URL || "mongodb://localhost:27017";
let ksmUsdtDailyCol = null;
let dotUsdtDailyCol = null;
let litUsdtDailyCol = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  db = client.db(dbName);
  ksmUsdtDailyCol = db.collection(ksmUsdtDailyCollectionName);
  dotUsdtDailyCol = db.collection(dotUsdtDailyCollectionName);
  litUsdtDailyCol = db.collection(litUsdtDailyCollectionName);

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

async function getKsmUsdtDailyCollection() {
  await tryInit(ksmUsdtDailyCol);
  return ksmUsdtDailyCol;
}

async function getDotUsdtDailyCollection() {
  await tryInit(dotUsdtDailyCol);
  return dotUsdtDailyCol;
}

async function getLitUsdtDailyCollection() {
  await tryInit(litUsdtDailyCol);
  return litUsdtDailyCol;
}

module.exports = {
  initDb,
  getDotUsdtDailyCollection,
  getKsmUsdtDailyCollection,
  getLitUsdtDailyCollection,
};
