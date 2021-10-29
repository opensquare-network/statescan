const { insertInstanceTimelineItem } = require("../../../mongo/service/instance");
const { TimelineItemTypes } = require("../../common/constants");
const { UniquesEvents } = require("../../common/constants");
const { updateMetadata } = require("./common");

async function handleMetadataCleared(event, indexer) {
  const [classId, instanceId] = event.data.toJSON();
  await updateMetadata(classId, instanceId, indexer);

  const timelineItem = {
    indexer,
    name: UniquesEvents.MetadataCleared,
    type: TimelineItemTypes.event,
    args: {
      classId,
      instanceId,
    },
  };

  await insertInstanceTimelineItem(classId, instanceId, timelineItem);
}

module.exports = {
  handleMetadataCleared,
};
