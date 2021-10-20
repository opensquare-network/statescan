const scanStep = parseInt(process.env.SCAN_STEP) || 100;
const useMetaDb = !!process.env.USE_META_DB;

function getScanStep() {
  return scanStep;
}

function isUseMetaDb() {
  return useMetaDb;
}

module.exports = {
  getScanStep,
  isUseMetaDb,
};
