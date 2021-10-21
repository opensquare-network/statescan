const { deleteClassAttribute } = require("../../../mongo/service/class");

async function handleAttributeCleared(event, indexer) {
  const [classId, maybeInstanceId, key] = event.data.toJSON();
  if (maybeInstanceId) {
    return;
  }

  await deleteClassAttribute(classId, key);
}

module.exports = {
  handleAttributeCleared,
};
