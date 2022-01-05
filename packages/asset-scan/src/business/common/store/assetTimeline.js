const timelineMap = {};

function addTimelineItem(blockHeight, data) {
  timelineMap[blockHeight] = timelineMap[blockHeight] || [];
  timelineMap[blockHeight].push(data);
}

function getTimelineItems(blockHeight) {
  const dataInBlock = timelineMap[blockHeight];
  if (dataInBlock) {
    return dataInBlock;
  }

  return [];
}

function clearTimelineItems(blockHeight) {
  delete timelineMap[blockHeight];
}

module.exports = {
  addAssetTimelineItem: addTimelineItem,
  getAssetTimelineItems: getTimelineItems,
  clearAssetTimelineItems: clearTimelineItems,
};
