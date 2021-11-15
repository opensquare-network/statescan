const {
  insertInstance,
  insertTransfer,
} = require("../../../mongo/service/instance");
const { queryInstanceDetails } = require("../../common/instance/storage");
const { updateInstance } = require("../../../mongo/service/instance");
const { queryInstanceMetadata } = require("../../common/instance/metadata");
const { logger } = require("../../../logger");
const { md5 } = require("../../../utils");

async function updateMetadata(classId, instanceId, indexer) {
  const metadata = await queryInstanceMetadata(classId, instanceId, indexer);
  if (!metadata) {
    await updateClass(classId, {
      metadata: null,
      dataHash: null,
    });
    return;
  }

  const dataHash = md5(metadata.data);

  await updateInstance(classId, instanceId, { metadata, dataHash });
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
