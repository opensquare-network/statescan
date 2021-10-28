const { insertClassTimelineItem } = require("../../../mongo/service/class");
const { TimelineItemTypes } = require("../../common/constants");
const { UniquesEvents } = require("../../common/constants");
const { updateClassWithDetails } = require("./common");

async function handleAssetStatusChanged(event, indexer, blockEvents, extrinsic) {
  const [classId] = event.data.toJSON();
  await updateClassWithDetails(classId, indexer);

  const { args } = extrinsic.method.toJSON();
  const { owner, issuer, admin, freezer, freeHolding, isFrozen } = args;

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
