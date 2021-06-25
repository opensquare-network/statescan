const { MongoClient } = require("mongodb");
const { currentChain, CHAINS } = require("../envvars");

function getDbName() {
  const chain = currentChain();
  if (CHAINS.WESTMINT === chain) {
    return process.env.MONGO_DB_META_WND_NAME || "meta-westmint";
  }

  throw new Error("Not find metadata database");
}

const blockCollectionName = "block";
const statusCollectionName = "status";

let client = null;
let db = null;

const mongoUrl = process.env.MONGO_DB_META_URL || "mongodb://localhost:27017";

let statusCol = null;
let blockCol = null;

async function initDb() {
  client = await MongoClient.connect(mongoUrl, {
    useUnifiedTopology: true,
  });

  db = client.db(getDbName());
  statusCol = db.collection(statusCollectionName);
  blockCol = db.collection(blockCollectionName);

  await _createIndexes();
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  await blockCol.createIndex({ height: 1 });
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

async function getBlocks(startHeight, endHeight) {
  const col = await getBlockCollection();
  return await col
    .find({
      $and: [
        { height: { $gte: startHeight } },
        { height: { $lte: endHeight } },
      ],
    })
    .toArray();
}

module.exports = {
  getStatusCollection,
  getBlockCollection,
  getBlocks,
};
