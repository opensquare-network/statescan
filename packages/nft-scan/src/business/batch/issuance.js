const { updateClassWithDetails } = require("../event/class/common");
const { TimelineItemTypes, UniquesEvents } = require("../common/constants");
const { getClasses } = require("../../mongo/service/class");
const {
  getInstanceCollection,
  getInstanceTimelineCollection,
} = require("../../mongo");
const { getIssuance } = require("../../store/blockIssuance");

function getInstanceDetailWhenIssued(owner) {
  return {
    owner,
    approved: null,
    isFrozen: false,
    deposit: 0,
  };
}

async function handleBlockIssuance(blockIndexer) {
  const issuanceArr = getIssuance(blockIndexer.blockHeight);
  if (issuanceArr.length <= 0) {
    return;
  }

  const classIds = issuanceArr.map((issuance) => issuance.classId);
  const uniqueClassIds = [...new Set(classIds)];
  const classes = (await getClasses(uniqueClassIds)) || [];
  const classIdHeightMap = classes.reduce((result, cls) => {
    result[cls.classId] = cls.indexer.blockHeight;
    return result;
  }, {});

  const instanceCol = await getInstanceCollection();
  const instanceBulk = instanceCol.initializeUnorderedBulkOp();

  const timelineCol = await getInstanceTimelineCollection();
  const timelineBulk = timelineCol.initializeUnorderedBulkOp();
  for (const { classId, instanceId, owner, indexer } of issuanceArr) {
    const classHeight = classIdHeightMap[classId];
    if (!classHeight) {
      throw `can not find classHeight of classId ${classId} at ${JSON.stringify(
        indexer
      )}`;
    }

    instanceBulk.insert({
      classId,
      classHeight,
      instanceId,
      indexer,
      details: getInstanceDetailWhenIssued(owner),
      isDestroyed: false,
    });

    timelineBulk.insert({
      indexer,
      name: UniquesEvents.Issued,
      type: TimelineItemTypes.event,
      args: {
        classId,
        instanceId,
        owner,
      },
    });
  }

  await instanceBulk.execute();
  await timelineBulk.execute();

  for (const classId of uniqueClassIds) {
    await updateClassWithDetails(classId, blockIndexer);
  }
}

module.exports = {
  handleBlockIssuance,
};
