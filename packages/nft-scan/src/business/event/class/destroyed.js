const { updateClass } = require("../../../mongo/service/class");

async function handleDestroyed(event, indexer) {
  const [classId] = event.data.toJSON();
  await updateClass(classId, { isDestroyed: true });
}

module.exports = {
  handleDestroyed,
};
