const { getClassCollection } = require("../index");

async function insertClass(indexer, classId, details) {
  const classCol = await getClassCollection();
  await classCol.insertOne({
    classId,
    indexer,
    details,
    isDestroyed: false,
  });
}

async function updateClass(classId, updates) {
  const classCol = await getClassCollection();
  let update = {
    $set: updates,
  };

  await classCol.updateOne({ classId, isDestroyed: false }, update);
}

module.exports = {
  insertClass,
  updateClass,
};
