const { updateClassWithDetails } = require("../class/common");
const {
  insertInstanceTimelineItem,
} = require("../../../mongo/service/instance");
const { insertNewInstance } = require("./common");
const { UniquesEvents, TimelineItemTypes } = require("@statescan/utils");
const { addIssuance } = require("../../../store/blockIssuance");

async function handleIssued(event, indexer, blockEvents, extrinsic) {
  const [classId, instanceId, owner] = event.data.toJSON();
  if (handleWithBatch(blockEvents)) {
    addIssuance(indexer.blockHeight, { classId, instanceId, owner, indexer });
    return;
  }

  await insertNewInstance(classId, instanceId, indexer);

  const timelineItem = {
    indexer,
    name: UniquesEvents.Issued,
    type: TimelineItemTypes.event,
    args: {
      classId,
      instanceId,
      owner,
    },
  };

  await insertInstanceTimelineItem(classId, instanceId, timelineItem, indexer);
  await updateClassWithDetails(classId, indexer);
}

function handleWithBatch(eventRecords) {
  const hasNoOtherInstanceEvent = eventRecords.every(({ event }) => {
    const { method } = event;
    return ![UniquesEvents.MetadataSet, UniquesEvents.MetadataCleared].includes(
      method
    );
  });

  const issuedEventsCount = eventRecords.filter(
    ({ event }) => UniquesEvents.Issued === event.method
  ).length;

  return hasNoOtherInstanceEvent && issuedEventsCount > 1;
}

module.exports = {
  handleIssued,
};
