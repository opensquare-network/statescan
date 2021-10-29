const { insertClassTimelineItem } = require("../../../mongo/service/class");
const { TimelineItemTypes } = require("../../common/constants");
const { UniquesEvents } = require("../../common/constants");
const { updateClassWithDetails } = require("./common");

async function handleThawed(event, indexer) {
  const [classId] = event.data.toJSON();
  await updateClassWithDetails(classId, indexer);

  const timelineItem = {
    indexer,
    name: UniquesEvents.ClassThawed,
    type: TimelineItemTypes.event,
    args: {
      classId,
    },
  };
  await insertClassTimelineItem(classId, timelineItem);
}

module.exports = {
  handleThawed,
};
