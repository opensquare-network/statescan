const { updateClass } = require("../../../mongo/service/class");
const { queryClassMetadata } = require("../../common/class/metadata");
const { logger } = require("../../../logger");

async function handleMetadataSet(event, indexer) {
  const [classId] = event.data.toJSON();
  const metadata = await queryClassMetadata(classId, indexer);
  if (!metadata) {
    logger.error("class metadata set, but not found.", indexer);
    return;
  }

  await updateClass(classId, { metadata });
}

module.exports = {
  handleMetadataSet,
};
