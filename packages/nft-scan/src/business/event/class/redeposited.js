const { insertClassTimelineItem } = require("../../../mongo/service/class");
const { TimelineItemTypes, UniquesEvents } = require("@statescan/utils");
const { updateClassWithDetails } = require("./common");

async function handleRedeposited(event, indexer) {
  const [classId, successfulInstances] = event.data.toJSON();
  await updateClassWithDetails(classId, indexer);

  const timelineItem = {
    indexer,
    name: UniquesEvents.Redeposited,
    type: TimelineItemTypes.event,
    args: {
      classId,
      successfulInstances,
    },
  };
  await insertClassTimelineItem(classId, timelineItem);
}

module.exports = {
  handleRedeposited,
};
