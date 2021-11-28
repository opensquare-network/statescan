const scanStep = parseInt(process.env.SCAN_STEP) || 100;
const useMeta = !!process.env.USE_META;
const useKnownHeights = !!process.env.USE_KNOWN_HEIGHTS;
const updateAddrStep = parseInt(process.env.UPDATE_ADDR_STEP) || 500;

function firstScanKnowHeights() {
  return useKnownHeights;
}

function getScanStep() {
  return scanStep;
}

function isUseMeta() {
  return useMeta;
}

function getUpdateAddrStep() {
  return updateAddrStep;
}

module.exports = {
  firstScanKnowHeights,
  getScanStep,
  isUseMeta,
  getUpdateAddrStep,
};
