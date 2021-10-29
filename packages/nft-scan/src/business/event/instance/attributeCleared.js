const { deleteInstanceAttribute } = require("../../../mongo/service/instance");

async function handleAttributeCleared(event, indexer) {
  const [classId, maybeInstanceId, key] = event.data.toJSON();
  if (!maybeInstanceId) {
    return;
  }

  await deleteInstanceAttribute(classId, maybeInstanceId, key);
}

module.exports = {
  handleAttributeCleared,
};
