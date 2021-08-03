const { MongoClient } = require("mongodb");

function DB(dbName) {
  const identityCollectionName = "identity";

  let client = null;
  let db = null;

  const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
  let identityCol = null;

  async function initDb() {
    client = await MongoClient.connect(mongoUrl, {
      useUnifiedTopology: true,
    });

    db = client.db(dbName);
    identityCol = db.collection(identityCollectionName);

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

  async function getIdentityCollection() {
    await tryInit(identityCol);
    return identityCol;
  }

  return {
    initDb,
    getIdentityCollection,
  };
}

module.exports = {
  DB
};