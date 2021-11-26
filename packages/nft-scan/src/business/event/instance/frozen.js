const {
  insertInstanceTimelineItem,
} = require("../../../mongo/service/instance");
const { TimelineItemTypes } = require("../../common/constants");
const { UniquesEvents } = require("../../common/constants");
const { updateInstanceWithDetails } = require("./common");

async function handleFrozen(event, indexer, blockEvents, extrinsic) {
  const [classId, instanceId] = event.data.toJSON();
  await updateInstanceWithDetails(classId, instanceId, indexer);

  const timelineItem = {
    indexer,
    name: UniquesEvents.Frozen,
    type: TimelineItemTypes.event,
    args: {
      classId,
      instanceId,
    },
  };
  await insertInstanceTimelineItem(classId, instanceId, timelineItem, indexer);
}

module.exports = {
  handleFrozen,
};
