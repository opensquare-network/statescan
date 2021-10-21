const { handleCreated } = require("./created");
const { Modules, UniquesEvents } = require("../../common/constants");

async function handleEvent(event, indexer, blockEvents, extrinsic) {
  const { section, method } = event;
  if (Modules.Uniques !== section) {
    return;
  }

  if ([UniquesEvents.ForceCreated, UniquesEvents.Created].includes(method)) {
    await handleCreated(...arguments);
  }
}

module.exports = {
  handleEvent,
};
