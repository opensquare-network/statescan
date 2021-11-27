const { insertClassTimelineItem } = require("../../../mongo/service/class");
const { TimelineItemTypes, UniquesEvents } = require("@statescan/utils");
const { insertNewClassWithDetails } = require("./common");

async function handleForceCreated(event, indexer) {
  const [classId, owner] = event.data.toJSON();
  await insertNewClassWithDetails(classId, indexer);

  const timelineItem = {
    indexer,
    name: UniquesEvents.ForceCreated,
    type: TimelineItemTypes.event,
    args: {
      classId,
      owner,
    },
  };

  await insertClassTimelineItem(classId, timelineItem);
}

module.exports = {
  handleForceCreated,
};
