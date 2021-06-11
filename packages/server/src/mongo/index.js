const { DB } = require("./db");

const scanDbs = {
  rococo: DB(process.env.SCAN_DB_ROC_NAME || "statescan-roc"),
  polkadot: DB(process.env.SCAN_DB_DOT_NAME || "statescan-dot"),
  kusama: DB(process.env.SCAN_DB_KSM_NAME || "statescan-ksm"),
}

const db = (chain) => scanDbs[chain]

function initDb() {
  return Promise.all(Object.values(scanDbs).map(db => db.initDb()));
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

module.exports = {
  initDb,
  getStatusCollection,
  getBlockCollection,
  getExtrinsicCollection,
  getEventCollection,
  getAssetTransferCollection,
  getAssetCollection,
  getAssetHolderCollection,
};
