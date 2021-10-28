const { insertClass } = require("../../../mongo/service/class");
const { queryClassDetails } = require("../../common/class/storage");
const { updateClass } = require("../../../mongo/service/class");
const { queryClassMetadata } = require("../../common/class/metadata");
const { logger } = require("../../../logger");

async function updateMetadata(classId, indexer) {
  const metadata = await queryClassMetadata(classId, indexer);
  if (!metadata) {
    logger.error("class metadata set, but not found.", indexer);
    return;
  }

  await updateClass(classId, { metadata });
}

async function insertNewClassWithDetails(classId, indexer) {
  const details = await queryClassDetails(classId, indexer);
  await insertClass(indexer, classId, details);
}

async function updateClassWithDetails(classId, indexer) {
  const details = await queryClassDetails(classId, indexer);
  await updateClass(classId, { details });
}

module.exports = {
  updateMetadata,
  insertNewClassWithDetails,
  updateClassWithDetails,
};
