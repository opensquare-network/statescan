const { Modules, UniquesEvents } = require("@statescan/common");
const { handleApprovalCancelled } = require("./approvalCancelled");
const { handleApprovedTransfer } = require("./approvedTransfer");
const { handleBurned } = require("./burned");
const { handleFrozen } = require("./frozen");
const { handleIssued } = require("./issued");
const { handleMetadataCleared } = require("./metadataCleared");
const { handleMetadataSet } = require("./metadataSet");
const { handleThawed } = require("./thawed");
const { handleTransferred } = require("./transferred");
const { handleAttributeCleared } = require("./attributeCleared");
const { handleAttributeSet } = require("./attributeSet");

async function handleEvent(event, indexer, blockEvents, extrinsic) {
  const { section, method } = event;
  if (Modules.Uniques !== section) {
    return;
  }

  if (UniquesEvents.Issued === method) {
    await handleIssued(...arguments);
  } else if (UniquesEvents.Transferred === method) {
    await handleTransferred(...arguments);
  } else if (UniquesEvents.ApprovedTransfer === method) {
    await handleApprovedTransfer(...arguments);
  } else if (UniquesEvents.ApprovalCancelled === method) {
    await handleApprovalCancelled(...arguments);
  } else if (UniquesEvents.Burned === method) {
    await handleBurned(...arguments);
  } else if (UniquesEvents.Frozen === method) {
    await handleFrozen(...arguments);
  } else if (UniquesEvents.Thawed === method) {
    await handleThawed(...arguments);
  } else if (UniquesEvents.MetadataSet === method) {
    await handleMetadataSet(...arguments);
  } else if (UniquesEvents.MetadataCleared === method) {
    await handleMetadataCleared(...arguments);
  } else if (UniquesEvents.AttributeCleared === method) {
    await handleAttributeCleared(...arguments);
  } else if (UniquesEvents.AttributeSet === method) {
    await handleAttributeSet(...arguments);
  }
}

module.exports = {
  handleEvent,
};
