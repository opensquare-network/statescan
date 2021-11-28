const {
  insertInstanceTimelineItem,
} = require("../../../mongo/service/instance");
const { TimelineItemTypes, UniquesEvents } = require("@statescan/common");
const { updateClassWithDetails } = require("../class/common");
const { updateMetadata } = require("./common");
const { md5 } = require("../../../utils");

async function handleMetadataSet(event, indexer, blockEvents, extrinsic) {
  const [classId, instanceId, data, isFrozen] = event.data.toJSON();
  await updateMetadata(classId, instanceId, indexer);

  const dataHash = md5(data);

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
    dataHash,
  };

  await insertInstanceTimelineItem(classId, instanceId, timelineItem, indexer);
  await updateClassWithDetails(classId, indexer);
}

module.exports = {
  handleMetadataSet,
};
