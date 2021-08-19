const { DB } = require("./scandb");
const {
  initDb: initPriceDb,
  getDotUsdtDailyCollection,
  getKsmUsdtDailyCollection,
} = require("./pricedb");

const scanDbs = {
  westmint: DB(process.env.SCAN_DB_WND_NAME || "statescan-wnd"),
  statemine: DB(process.env.SCAN_DB_KSM_NAME || "statescan-ksm"),
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

function getTeleportCollection(chain) {
  return db(chain).getTeleportCollection();
}

function getUnFinalizedBlockCollection(chain) {
  return db(chain).getUnFinalizedBlockCollection();
}

function getUnFinalizedEventCollection(chain) {
  return db(chain).getUnFinalizedEventCollection();
}

function getUnFinalizedExrinsicCollection(chain) {
  return db(chain).getUnFinalizedExrinsicCollection();
}

async function getDailyAssetStatisticCollection(chain) {
  return db(chain).getDailyAssetStatisticCollection();
}

module.exports = {
  initDb,

  // Statescan db collections
  getStatusCollection,
  getBlockCollection,
  getExtrinsicCollection,
  getEventCollection,
  getAssetTransferCollection,
  getAssetCollection,
  getAssetHolderCollection,
  getAddressCollection,
  getTeleportCollection,
  getUnFinalizedBlockCollection,
  getUnFinalizedEventCollection,
  getUnFinalizedExrinsicCollection,

  getDailyAssetStatisticCollection,

  // Price db collections
  getDotUsdtDailyCollection,
  getKsmUsdtDailyCollection,
};
