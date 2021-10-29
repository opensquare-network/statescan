const { findBlockApi } = require("../../../chain/blockApi");

async function queryInstanceMetadata(classId, instanceId, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  const raw = await blockApi.query.uniques.instanceMetadataOf(classId, instanceId);
  return raw.toJSON();
}

module.exports = {
  queryInstanceMetadata,
};
