const { getClassCollection } = require("../index");

async function insertClass(indexer, classId, details) {
  const classCol = await getClassCollection();
  await classCol.insertOne({
    classId,
    indexer,
    details,
  });
}

module.exports = {
  insertClass,
};
