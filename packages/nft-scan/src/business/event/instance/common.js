const { insertInstance } = require("../../../mongo/service/instance");
const { queryInstanceDetails } = require("../../common/instance/storage");

async function insertNewInstance(classId, instanceId, indexer) {
  const details = await queryInstanceDetails(classId, instanceId, indexer);
  await insertInstance(indexer, classId, instanceId, details);
}

module.exports = {
  insertNewInstance,
};
