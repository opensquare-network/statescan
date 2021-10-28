const { insertClassTimelineItem } = require("../../../mongo/service/class");
const { TimelineItemTypes } = require("../../common/constants");
const { UniquesEvents } = require("../../common/constants");
const { queryClassDetails } = require("../../common/class/storage");
const { updateClass } = require("../../../mongo/service/class");

async function handleAssetStatusChanged(event, indexer) {
  const [classId] = event.data.toJSON();
  const detail = await queryClassDetails(classId, indexer);
  const { owner, issuer, admin, freezer, freeHolding, isFrozen } = detail;

  await updateClass(classId, { details });

  const timelineItem = {
    indexer,
    name: UniquesEvents.AssetStatusChanged,
    type: TimelineItemTypes.event,
    args: {
      classId,
      owner,
      issuer,
      admin,
      freezer,
      freeHolding,
      isFrozen,
    },
  };
  await insertClassTimelineItem(classId, timelineItem);
}

module.exports = {
  handleAssetStatusChanged,
};
