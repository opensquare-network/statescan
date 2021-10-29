const { insertInstanceAttribute } = require("../../../mongo/service/instance");
const { queryInstanceAttribute } = require("../../common/instance/attribute");
const { logger } = require("../../../logger");

async function handleAttributeSet(event, indexer) {
  const [classId, maybeInstanceId, key] = event.data.toJSON();
  if (!maybeInstanceId) {
    return;
  }

  const valueDepositTuple = await queryInstanceAttribute(classId, maybeInstanceId, key, indexer);
  if (!valueDepositTuple || !Array.isArray(valueDepositTuple)) {
    logger.error(
      "Can not get attribute value at class AttributeSet event",
      indexer
    );
    return;
  }

  const [value, deposit] = valueDepositTuple;
  await insertInstanceAttribute(classId, maybeInstanceId, key, value, deposit, indexer);
}

module.exports = {
  handleAttributeSet,
};
