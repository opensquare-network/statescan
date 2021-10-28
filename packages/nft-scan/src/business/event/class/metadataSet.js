const { insertClassTimelineItem } = require("../../../mongo/service/class");
const { TimelineItemTypes } = require("../../common/constants");
const { UniquesEvents } = require("../../common/constants");
const { updateMetadata } = require("./common");

async function handleMetadataSet(event, indexer) {
  const [classId, data, isFrozen] = event.data.toJSON();
  await updateMetadata(classId, indexer);

  const timelineItem = {
    indexer,
    name: UniquesEvents.ClassMetadataSet,
    type: TimelineItemTypes.event,
    args: {
      classId,
      data,
      isFrozen,
    },
  };

  await insertClassTimelineItem(classId, timelineItem);
}

module.exports = {
  handleMetadataSet,
};
