async function handleThawed(
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
  handleThawed,
};
