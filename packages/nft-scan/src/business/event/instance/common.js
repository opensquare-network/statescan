const { insertInstance, insertTransfer } = require("../../../mongo/service/instance");
const { queryInstanceDetails } = require("../../common/instance/storage");
const { updateInstance } = require("../../../mongo/service/instance");
const { queryInstanceMetadata } = require("../../common/instance/metadata");

async function updateMetadata(classId, instanceId, indexer) {
  const metadata = await queryInstanceMetadata(classId, instanceId, indexer);
  if (!metadata) {
    logger.error("instance metadata set, but not found.", indexer);
    return;
  }

  await updateInstance(classId, instanceId, { metadata });
}

async function insertNewInstance(classId, instanceId, indexer) {
  const details = await queryInstanceDetails(classId, instanceId, indexer);
  await insertInstance(indexer, classId, instanceId, details);
}

async function updateInstanceWithDetails(classId, instanceId, indexer) {
  const details = await queryInstanceDetails(classId, instanceId, indexer);
  await updateInstance(classId, instanceId, { details });
}

async function insertNewTransfer(classId, instanceId, indexer, from, to) {
  await insertTransfer(indexer, classId, instanceId, from, to);
}

module.exports = {
  insertNewInstance,
  updateMetadata,
  updateInstanceWithDetails,
  insertNewTransfer,
};
