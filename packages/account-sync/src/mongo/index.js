const { MongoClient } = require("mongodb");

function getDbName() {
  const dbName = process.env.MONGO_ACCOUNT_DB_NAME;
  if (!dbName) {
    throw new Error("MONGO_ACCOUNT_DB_NAME not set");
  }

  return dbName;
}

let client = null;
let db = null;

let addressCol = null;

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  const dbName = getDbName();
  console.log(`Use scan DB name:`, dbName);

  db = client.db(dbName);

  addressCol = await db.collection("address");
  await _createIndexes();
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  addressCol.createIndex({ address: 1 });
}

async function tryInit(col) {
  if (!col) {
    await initDb();
  }
}

async function getAddressCollection() {
  await tryInit(addressCol);
  return addressCol;
}

async function closeDb() {
  await client.close();
}

module.exports = {
  getAddressCollection,
  closeDb,
};
