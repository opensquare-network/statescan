const { getClassCollection, getClassTimelineCollection } = require("../index");
const { logger } = require("../../logger");

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

module.exports = {
  insertClass,
  updateClass,
  insertClassTimelineItem,
};
