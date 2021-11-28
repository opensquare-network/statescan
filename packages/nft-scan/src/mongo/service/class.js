const { getClassAttributeCollection } = require("../index");
const { getClassCollection, getClassTimelineCollection } = require("../index");
const { logger } = require("@statescan/common");

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

async function insertClassTimelineItem(classId, timelineItem = {}) {
  const classCol = await getClassCollection();
  const nftClass = await classCol.findOne({ classId, isDestroyed: false });
  if (!nftClass) {
    logger.error(`Can not find class ${classId} when set timeline item`);
    return;
  }

  const classHeight = nftClass.indexer.blockHeight;
  const col = await getClassTimelineCollection();
  await col.insertOne({
    classId,
    classHeight,
    ...timelineItem,
  });
}

async function insertClassAttribute(classId, key, value, deposit, indexer) {
  const classCol = await getClassCollection();
  const nftClass = await classCol.findOne({ classId, isDestroyed: false });
  if (!nftClass) {
    logger.error(
      `Can not find class ${classId} when set attribute key: ${key}, value: ${value}`
    );
    return;
  }

  const classHeight = nftClass.indexer.blockHeight;
  const col = await getClassAttributeCollection();
  await col.insertOne({
    classId,
    classHeight,
    key,
    value,
    deposit,
    indexer,
  });
}

async function deleteClassAttribute(classId, key) {
  const classCol = await getClassCollection();
  const nftClass = await classCol.findOne({ classId, isDestroyed: false });
  if (!nftClass) {
    logger.error(
      `Can not find class ${classId} when set attribute key: ${key}, value: ${value}`
    );
    return;
  }

  const classHeight = nftClass.indexer.blockHeight;
  const col = await getClassAttributeCollection();

  await col.deleteOne({
    classId,
    classHeight,
    key,
  });
}

async function getClasses(idArr) {
  const classCol = await getClassCollection();
  return await classCol
    .find({
      classId: { $in: idArr },
      isDestroyed: false,
    })
    .toArray();
}

module.exports = {
  insertClass,
  updateClass,
  insertClassTimelineItem,
  insertClassAttribute,
  deleteClassAttribute,
  getClasses,
};
