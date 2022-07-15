const { insertClassTimelineItem } = require("../../../mongo/service/class");
const { TimelineItemTypes } = require("@statescan/common");
const { updateMetadata } = require("./common");

async function handleMetadataCleared(event, indexer) {
  const [classId] = event.data.toJSON();
  await updateMetadata(classId, indexer);

  const timelineItem = {
    indexer,
    name: event.method,
    type: TimelineItemTypes.event,
    args: {
      classId,
    },
  };

  await insertClassTimelineItem(classId, timelineItem);
}

module.exports = {
  handleMetadataCleared,
};
