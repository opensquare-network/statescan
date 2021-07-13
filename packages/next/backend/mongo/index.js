const { DB } = require("./scandb");
const {
  initDb: initPriceDb,
  getDotUsdtDailyCollection,
  getKsmUsdtDailyCollection,
} = require("./pricedb");

const scanDbs = {
  westmint: DB(process.env.SCAN_DB_WND_NAME || "statescan-wnd"),
};

const db = (chain) => scanDbs[chain];

function initDb() {
  return Promise.all([
    ...Object.values(scanDbs).map((db) => db.initDb()),
    initPriceDb(),
  ]);
}

function getStatusCollection(chain) {
  return db(chain).getStatusCollection();
}

function getBlockCollection(chain) {
  return db(chain).getBlockCollection();
}

function getExtrinsicCollection(chain) {
  return db(chain).getExtrinsicCollection();
}

function getEventCollection(chain) {
  return db(chain).getEventCollection();
}

function getAssetTransferCollection(chain) {
  return db(chain).getAssetTransferCollection();
}

function getAssetCollection(chain) {
  return db(chain).getAssetCollection();
}

function getAssetHolderCollection(chain) {
  return db(chain).getAssetHolderCollection();
}

function getAddressCollection(chain) {
  return db(chain).getAddressCollection();
}

module.exports = {
  initDb,
  getStatusCollection,
  getBlockCollection,
  getExtrinsicCollection,
  getEventCollection,
  getAssetTransferCollection,
  getAssetCollection,
  getAssetHolderCollection,
  getAddressCollection,
  getDotUsdtDailyCollection,
  getKsmUsdtDailyCollection,
};
