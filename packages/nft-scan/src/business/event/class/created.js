const { insertClass } = require("../../../mongo/service/class");
const { queryClassDetails } = require("../../common/class/storage");

async function handleCreated(event, indexer) {
  const [classId] = event.data.toJSON();
  const details = await queryClassDetails(classId, indexer);
  await insertClass(indexer, classId, details);
}

module.exports = {
  handleCreated,
};
