const { findBlockApi } = require("../../../chain/blockApi");

async function queryInstanceDetails(classId, instanceId, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  const raw = await blockApi.query.uniques.asset(classId, instanceId);
  return raw.toJSON();
}

module.exports = {
  queryInstanceDetails,
};
