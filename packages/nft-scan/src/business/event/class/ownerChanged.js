const { insertClassTimelineItem } = require("../../../mongo/service/class");
const { TimelineItemTypes, UniquesEvents } = require("@statescan/utils");
const { updateClassWithDetails } = require("./common");

async function handleOwnerChanged(event, indexer) {
  const [classId, newOwner] = event.data.toJSON();
  await updateClassWithDetails(classId, indexer);

  const timelineItem = {
    indexer,
    name: UniquesEvents.OwnerChanged,
    type: TimelineItemTypes.event,
    args: {
      classId,
      newOwner,
    },
  };
  await insertClassTimelineItem(classId, timelineItem);
}

module.exports = {
  handleOwnerChanged,
};
