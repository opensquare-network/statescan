const { insertClassTimelineItem } = require("../../../mongo/service/class");
const { TimelineItemTypes } = require("../../common/constants");
const { insertNewClassWithDetails } = require("./common");
const { UniquesEvents } = require("../../common/constants");

async function handleCreated(event, indexer) {
  const [classId, creator, owner] = event.data.toJSON();
  await insertNewClassWithDetails(classId, indexer);

  const timelineItem = {
    indexer,
    name: UniquesEvents.ForceCreated,
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
