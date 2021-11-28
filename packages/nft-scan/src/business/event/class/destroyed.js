const { insertClassTimelineItem } = require("../../../mongo/service/class");
const { TimelineItemTypes, UniquesEvents } = require("@statescan/common");
const { updateClass } = require("../../../mongo/service/class");

async function handleDestroyed(event, indexer) {
  const [classId] = event.data.toJSON();

  const timelineItem = {
    indexer,
    name: UniquesEvents.Destroyed,
    type: TimelineItemTypes.event,
    args: {
      classId,
    },
  };
  await insertClassTimelineItem(classId, timelineItem);

  await updateClass(classId, { isDestroyed: true });
}

module.exports = {
  handleDestroyed,
};
