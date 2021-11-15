const { insertClass } = require("../../../mongo/service/class");
const { queryClassDetails } = require("../../common/class/storage");
const { updateClass } = require("../../../mongo/service/class");
const { queryClassMetadata } = require("../../common/class/metadata");
const { md5 } = require("../../../utils");

async function updateMetadata(classId, indexer) {
  const metadata = await queryClassMetadata(classId, indexer);
  if (!metadata) {
    await updateClass(classId, {
      $unset: {
        metadata: true,
        dataHash: true,
      },
    });
    return;
  }

  const dataHash = md5(metadata.data);

  await updateClass(classId, { metadata, dataHash });
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
