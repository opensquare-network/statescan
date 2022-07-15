const { insertClassTimelineItem } = require("../../../mongo/service/class");
const { TimelineItemTypes } = require("@statescan/common");
const { updateClassWithDetails } = require("./common");

async function handleThawed(event, indexer) {
  const [classId] = event.data.toJSON();
  await updateClassWithDetails(classId, indexer);

  const timelineItem = {
    indexer,
    name: event.method,
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
