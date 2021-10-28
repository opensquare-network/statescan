const { insertClassTimelineItem } = require("../../../mongo/service/class");
const { TimelineItemTypes } = require("../../common/constants");
const { UniquesEvents } = require("../../common/constants");
const { updateClassWithDetails } = require("./common");

async function handleTeamChanged(event, indexer) {
  const [classId, issuer, admin, freezer] = event.data.toJSON();
  await updateClassWithDetails(classId, indexer);

  const timelineItem = {
    indexer,
    name: UniquesEvents.TeamChanged,
    type: TimelineItemTypes.event,
    args: {
      classId,
      issuer,
      admin,
      freezer,
    },
  };
  await insertClassTimelineItem(classId, timelineItem);
}

module.exports = {
  handleTeamChanged,
};
