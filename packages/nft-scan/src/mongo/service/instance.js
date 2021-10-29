const {
  getClassCollection,
  getInstanceCollection,
  getInstanceTimelineCollection,
} = require("../index");
const { logger } = require("../../logger");

async function insertInstance(indexer, classId, instanceId, details) {
  const classCol = await getClassCollection();
  const nftClass = await classCol.findOne({ classId, isDestroyed: false });
  if (!nftClass) {
    logger.error(`Can not find class ${classId} when set timeline item`);
    return;
  }

  const classHeight = nftClass.indexer.blockHeight;
  const instanceCol = await getInstanceCollection();
  await instanceCol.insertOne({
    classId,
    classHeight,
    instanceId,
    indexer,
    details,
    isDestroyed: false,
  });
}

async function insertInstanceTimelineItem(classId, instanceId, timelineItem = {}) {
  const instanceCol = await getInstanceCollection();
  const nftInstance = await instanceCol.findOne({ classId, instanceId, isDestroyed: false });
  if (!nftInstance) {
    logger.error(`Can not find instance /${classId}/${instanceId} when set timeline item`);
    return;
  }

  const classHeight = nftInstance.classHeight;
  const instanceHeight = nftInstance.indexer.blockHeight;

  const col = await getInstanceTimelineCollection();
  await col.insertOne({
    classId,
    classHeight,
    instanceId,
    instanceHeight,
    ...timelineItem,
  });
}

async function updateInstance(classId, instanceId, updates) {
  const classCol = await getClassCollection();
  const nftClass = await classCol.findOne({ classId, isDestroyed: false });
  if (!nftClass) {
    logger.error(`Can not find class ${classId} when set timeline item`);
    return;
  }

  const classHeight = nftClass.indexer.blockHeight;

  const instanceCol = await getInstanceCollection();
  let update = {
    $set: updates,
  };

  await instanceCol.updateOne({ classId, classHeight, instanceId, isDestroyed: false }, update);
}

module.exports = {
  insertInstance,
  insertInstanceTimelineItem,
  updateInstance,
};
