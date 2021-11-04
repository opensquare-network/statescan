const { insertInstanceTimelineItem } = require("../../../mongo/service/instance");
const { TimelineItemTypes } = require("../../common/constants");
const { UniquesEvents } = require("../../common/constants");
const { updateClassWithDetails } = require("../class/common");
const { updateMetadata } = require("./common");

async function handleMetadataSet(event, indexer, blockEvents, extrinsic) {
  const [classId, instanceId, data, isFrozen] = event.data.toJSON();
  await updateMetadata(classId, instanceId, indexer);

  const timelineItem = {
    indexer,
    name: UniquesEvents.MetadataSet,
    type: TimelineItemTypes.event,
    args: {
      classId,
      instanceId,
      data,
      isFrozen,
    },
  };

  await insertInstanceTimelineItem(classId, instanceId, timelineItem);
  await updateClassWithDetails(classId, indexer);
}

module.exports = {
  handleMetadataSet,
};
