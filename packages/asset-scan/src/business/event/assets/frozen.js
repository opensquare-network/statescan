async function handleFrozen(
  event,
  eventSort,
  extrinsicIndex,
  extrinsicHash,
  blockIndexer
) {
  const { section, method, data } = event;
  const eventData = data.toJSON();
  const [assetId] = eventData;

}

module.exports = {
  handleFrozen,
};
