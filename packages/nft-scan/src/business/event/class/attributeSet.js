const { insertClassAttribute } = require("../../../mongo/service/class");
const { queryClassAttribute } = require("../../common/class/attribute");
const { logger } = require("@statescan/common");

async function handleAttributeSet(event, indexer) {
  const [classId, maybeInstanceId, key] = event.data.toJSON();
  if (maybeInstanceId) {
    return;
  }

  const valueDepositTuple = await queryClassAttribute(classId, key, indexer);
  if (!valueDepositTuple || !Array.isArray(valueDepositTuple)) {
    logger.error(
      "Can not get attribute value at class AttributeSet event",
      indexer
    );
    return;
  }

  const [value, deposit] = valueDepositTuple;
  await insertClassAttribute(classId, key, value, deposit, indexer);
}

module.exports = {
  handleAttributeSet,
};
