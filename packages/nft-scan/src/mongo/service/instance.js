const {
  getClassCollection,
  getInstanceCollection,
  getInstanceTimelineCollection,
  getInstanceAttributeCollection,
  getNftTransferCollection,
} = require("../index");
const { logger } = require("../../logger");

async function insertInstance(indexer, classId, instanceId, details) {
  const classCol = await getClassCollection();
  const nftClass = await classCol.findOne({ classId, isDestroyed: false });
  if (!nftClass) {
    logger.error(
      `Can not find class ${classId} when inserting new instance ${instanceId}, ${indexer}`
    );
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

async function insertInstanceTimelineItem(
  classId,
  instanceId,
  timelineItem = {},
  indexer
) {
  const classCol = await getClassCollection();
  const nftClass = await classCol.findOne({ classId, isDestroyed: false });
  if (!nftClass) {
    logger.error(
      `Can not find class ${classId} when set timeline item`,
      indexer
    );
    return;
  }

  const classHeight = nftClass.indexer.blockHeight;

  const instanceCol = await getInstanceCollection();
  const nftInstance = await instanceCol.findOne({
    classId,
    classHeight,
    instanceId,
    isDestroyed: false,
  });
  if (!nftInstance) {
    logger.error(
      `Can not find instance /${classId}/${instanceId} when set timeline item, ${indexer}`
    );
    return;
  }

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

async function updateInstance(classId, instanceId, updates, indexer) {
  const classCol = await getClassCollection();
  const nftClass = await classCol.findOne({ classId, isDestroyed: false });
  if (!nftClass) {
    logger.error(
      `Can not find class ${classId} when set timeline item, ${indexer}`
    );
    return;
  }

  const classHeight = nftClass.indexer.blockHeight;

  const instanceCol = await getInstanceCollection();
  let update = {
    $set: updates,
  };

  await instanceCol.updateOne(
    { classId, classHeight, instanceId, isDestroyed: false },
    update
  );
}

async function insertInstanceAttribute(
  classId,
  instanceId,
  key,
  value,
  deposit,
  indexer
) {
  const classCol = await getClassCollection();
  const nftClass = await classCol.findOne({ classId, isDestroyed: false });
  if (!nftClass) {
    logger.error(
      `Can not find class ${classId} when set attribute key: ${key}, value: ${value}, ${indexer}`
    );
    return;
  }

  const classHeight = nftClass.indexer.blockHeight;

  const instanceCol = await getInstanceCollection();
  const nftInstance = await instanceCol.findOne({
    classId,
    classHeight,
    instanceId,
    isDestroyed: false,
  });
  if (!nftInstance) {
    logger.error(
      `Can not find instance /${classId}/${instanceId} when set instance attribute, ${indexer}`
    );
    return;
  }

  const instanceHeight = nftInstance.indexer.blockHeight;

  const col = await getInstanceAttributeCollection();
  await col.insertOne({
    classId,
    classHeight,
    instanceId,
    instanceHeight,
    key,
    value,
    deposit,
    indexer,
  });
}

async function deleteInstanceAttribute(classId, instanceId, key, indexer) {
  const classCol = await getClassCollection();
  const nftClass = await classCol.findOne({ classId, isDestroyed: false });
  if (!nftClass) {
    logger.error(
      `Can not find class ${classId} when deleting instance attribute`,
      indexer
    );
    return;
  }

  const classHeight = nftClass.indexer.blockHeight;

  const instanceCol = await getInstanceCollection();
  const nftInstance = await instanceCol.findOne({
    classId,
    classHeight,
    instanceId,
    isDestroyed: false,
  });
  if (!nftInstance) {
    logger.error(
      `Can not find instance /${classId}/${instanceId} when set timeline item`,
      indexer
    );
    return;
  }

  const instanceHeight = nftInstance.indexer.blockHeight;

  const col = await getInstanceAttributeCollection();
  await col.deleteOne({
    classId,
    classHeight,
    instanceId,
    instanceHeight,
    key,
  });
}

async function insertTransfer(indexer, classId, instanceId, from, to) {
  const classCol = await getClassCollection();
  const nftClass = await classCol.findOne({ classId, isDestroyed: false });
  if (!nftClass) {
    logger.error(
      `Can not find class ${classId} when inserting instance transfer`,
      indexer
    );
    return;
  }

  const classHeight = nftClass.indexer.blockHeight;

  const instanceCol = await getInstanceCollection();
  const nftInstance = await instanceCol.findOne({
    classId,
    classHeight,
    instanceId,
    isDestroyed: false,
  });
  if (!nftInstance) {
    logger.error(
      `Can not find instance /${classId}/${instanceId} when set timeline item`,
      indexer
    );
    return;
  }

  const instanceHeight = nftInstance.indexer.blockHeight;

  const nftTransferCol = await getNftTransferCollection();
  await nftTransferCol.insertOne({
    indexer,
    classId,
    classHeight,
    instanceId,
    instanceHeight,
    from,
    to,
  });
}

module.exports = {
  insertInstance,
  insertInstanceTimelineItem,
  updateInstance,
  insertInstanceAttribute,
  deleteInstanceAttribute,
  insertTransfer,
};
