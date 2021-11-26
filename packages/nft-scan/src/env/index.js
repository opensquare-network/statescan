const scanStep = parseInt(process.env.SCAN_STEP) || 100;
const useMetaDb = !!process.env.USE_META_DB;
const useKnownHeights = !!process.env.USE_KNOWN_HEIGHTS;

function firstScanKnowHeights() {
  return useKnownHeights;
}

function getScanStep() {
  return scanStep;
}

function isUseMetaDb() {
  return useMetaDb;
}

module.exports = {
  firstScanKnowHeights,
  getScanStep,
  isUseMetaDb,
};
