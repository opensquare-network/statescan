const { findBlockApi } = require("@statescan/utils");

async function queryInstanceAttribute(classId, instanceId, key, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  const raw = await blockApi.query.uniques.attribute(classId, instanceId, key);
  return raw.toJSON();
}

module.exports = {
  queryInstanceAttribute,
};
