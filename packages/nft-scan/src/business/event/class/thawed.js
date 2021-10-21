const { insertClassTimelineItem } = require("../../../mongo/service/class");
const { TimelineItemTypes } = require("../../common/constants");
const { UniquesEvents } = require("../../common/constants");
const { updateMetadata } = require("./common");

async function handleThawed(event, indexer) {
  const [classId] = event.data.toJSON();
  await updateMetadata(classId, indexer);

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
