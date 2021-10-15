const useMetaDb = !!process.env.USE_META;
const updateAddrStep = parseInt(process.env.UPDATE_ADDR_STEP) || 500;

function isUseMeta() {
  return useMetaDb;
}

function getUpdateAddrStep() {
  return updateAddrStep;
}

module.exports = {
  isUseMeta,
  getUpdateAddrStep,
};
