const { insertClassTimelineItem } = require("../../../mongo/service/class");
const { TimelineItemTypes } = require("@statescan/common");
const { updateMetadata } = require("./common");
const { md5 } = require("../../../utils");

async function handleMetadataSet(event, indexer) {
  const [classId, data, isFrozen] = event.data.toJSON();
  await updateMetadata(classId, indexer);

  const dataHash = md5(data);

  const timelineItem = {
    indexer,
    name: event.method,
    type: TimelineItemTypes.event,
    args: {
      classId,
      data,
      isFrozen,
    },
    dataHash,
  };

  await insertClassTimelineItem(classId, timelineItem);
}

module.exports = {
  handleMetadataSet,
};
