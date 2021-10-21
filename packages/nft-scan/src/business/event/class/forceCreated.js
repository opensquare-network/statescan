const { insertClassTimelineItem } = require("../../../mongo/service/class");
const { TimelineItemTypes } = require("../../common/constants");
const { insertNewClassWithDetails } = require("./common");
const { UniquesEvents } = require("../../common/constants");

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
