const { handleUpwardMessagesReceived } = require("./upwardMessagesReceived");
const { handleExecutedUpward } = require("./executedUpward");
const { Modules, UmpEvents } = require("@statescan/common");

async function handleUmpEvents(event, indexer, blockEvents, extrinsic) {
  const { section, method } = event;
  if (Modules.Ump !== section) {
    return;
  }

  if (UmpEvents.ExecutedUpward === method) {
    await handleExecutedUpward(...arguments);
  } else if (UmpEvents.UpwardMessagesReceived === method) {
    await handleUpwardMessagesReceived(...arguments);
  }
}

module.exports = {
  handleUmpEvents,
};
