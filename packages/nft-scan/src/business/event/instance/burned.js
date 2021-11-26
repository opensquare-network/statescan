const {
  insertInstanceTimelineItem,
} = require("../../../mongo/service/instance");
const { TimelineItemTypes } = require("../../common/constants");
const { UniquesEvents } = require("../../common/constants");
const { updateInstance } = require("../../../mongo/service/instance");
const { updateClassWithDetails } = require("../class/common");

async function handleBurned(event, indexer, blockEvents, extrinsic) {
  const [classId, instanceId, owner] = event.data.toJSON();

  const timelineItem = {
    indexer,
    name: UniquesEvents.Burned,
    type: TimelineItemTypes.event,
    args: {
      classId,
      instanceId,
      owner,
    },
  };
  await insertInstanceTimelineItem(classId, instanceId, timelineItem, indexer);

  await updateInstance(classId, instanceId, { isDestroyed: true }, indexer);
  await updateClassWithDetails(classId, indexer);
}

module.exports = {
  handleBurned,
};
