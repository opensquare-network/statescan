const { insertInstanceTimelineItem } = require("../../../mongo/service/instance");
const { TimelineItemTypes } = require("../../common/constants");
const { updateInstanceWithDetails } = require("./common");
const { UniquesEvents } = require("../../common/constants");


async function handleApprovedTransfer(event, indexer, blockEvents, extrinsic) {
  const [classId, instanceId, owner, delegate] = event.data.toJSON();

  const timelineItem = {
    indexer,
    name: UniquesEvents.ApprovedTransfer,
    type: TimelineItemTypes.event,
    args: {
      classId,
      instanceId,
      owner,
      delegate,
    },
  };

  await insertInstanceTimelineItem(classId, instanceId, timelineItem);
  await updateInstanceWithDetails(classId, instanceId, indexer);
}

module.exports = {
  handleApprovedTransfer,
};
