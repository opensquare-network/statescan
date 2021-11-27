const { insertClassTimelineItem } = require("../../../mongo/service/class");
const { TimelineItemTypes, UniquesEvents } = require("@statescan/utils");
const { insertNewClassWithDetails } = require("./common");

async function handleCreated(event, indexer) {
  const [classId, creator, owner] = event.data.toJSON();
  await insertNewClassWithDetails(classId, indexer);

  const timelineItem = {
    indexer,
    name: UniquesEvents.Created,
    type: TimelineItemTypes.event,
    args: {
      classId,
      creator,
      owner,
    },
  };

  await insertClassTimelineItem(classId, timelineItem);
}

module.exports = {
  handleCreated,
};
