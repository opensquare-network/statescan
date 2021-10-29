const { insertInstanceTimelineItem } = require("../../../mongo/service/instance");
const { TimelineItemTypes } = require("../../common/constants");
const { insertNewInstance } = require("./common");
const { UniquesEvents } = require("../../common/constants");

async function handleIssued(event, indexer, blockEvents, extrinsic) {
  const [classId, instanceId, owner] = event.data.toJSON();
  await insertNewInstance(classId, instanceId, indexer);

  const timelineItem = {
    indexer,
    name: UniquesEvents.Issued,
    type: TimelineItemTypes.event,
    args: {
      classId,
      instanceId,
      owner,
    },
  };

  await insertInstanceTimelineItem(classId, instanceId, timelineItem);
}

module.exports = {
  handleIssued,
};
