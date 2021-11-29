const { insertClassTimelineItem } = require("../../../mongo/service/class");
const { TimelineItemTypes, UniquesEvents } = require("@statescan/common");
const { queryClassDetails } = require("../../common/class/storage");
const { updateClass } = require("../../../mongo/service/class");

async function handleAssetStatusChanged(
  event,
  indexer,
  blockEvents,
  extrinsic
) {
  const [classId] = event.data.toJSON();
  const details = await queryClassDetails(classId, indexer);
  await updateClass(classId, { details });

  const { owner, issuer, admin, freezer, freeHolding, isFrozen } = details;

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
