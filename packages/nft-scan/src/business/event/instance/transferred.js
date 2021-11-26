const {
  insertInstanceTimelineItem,
} = require("../../../mongo/service/instance");
const { TimelineItemTypes } = require("../../common/constants");
const { insertNewTransfer, updateInstanceWithDetails } = require("./common");
const { UniquesEvents } = require("../../common/constants");

async function handleTransferred(event, indexer, blockEvents, extrinsic) {
  const [classId, instanceId, from, to] = event.data.toJSON();
  await insertNewTransfer(classId, instanceId, indexer, from, to);

  const timelineItem = {
    indexer,
    name: UniquesEvents.Transferred,
    type: TimelineItemTypes.event,
    args: {
      classId,
      instanceId,
      from,
      to,
    },
  };

  await insertInstanceTimelineItem(classId, instanceId, timelineItem, indexer);
  await updateInstanceWithDetails(classId, instanceId, indexer);
}

module.exports = {
  handleTransferred,
};
