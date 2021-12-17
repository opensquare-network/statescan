const {
  teleportLogger,
  utils: { bigAdd },
} = require("@statescan/common");

async function extractTeleportFromV0Xcm(v0Xcm, messageId, indexer) {
  if (!v0Xcm.isReceiveTeleportedAsset) {
    return null;
  }

  const teleportAsset = v0Xcm.asReceiveTeleportedAsset;

  let totalAmount = 0;
  for (const asset of teleportAsset.assets) {
    const amount = await getAmountFromAsset(asset, messageId, indexer);
    totalAmount = bigAdd(totalAmount, amount);
  }

  const beneficiary = getBeneficiary(teleportAsset.effects, messageId, indexer);
  const fee = getFee(teleportAsset.effects, messageId, indexer);

  return {
    amount: totalAmount,
    beneficiary,
    fee,
  };
}

function getAmountFromAsset(asset, messageId, indexer) {
  if (!asset.isConcreteFungible) {
    return 0;
  }

  const fungible = asset.asConcreteFungible;
  if (!fungible.id.isX1) {
    teleportLogger.error(
      `Found teleport not isX1, message id: ${messageId} at`,
      indexer
    );
    return 0;
  }

  if (!fungible.id.asX1.isParent) {
    teleportLogger.error(
      `Found teleport isX1 but not from parent, message id: ${messageId} at`,
      indexer
    );
    return 0;
  }

  return fungible.amount.toString();
}

function getBeneficiary(effects, messageId, indexer) {
  const lastEffect = effects[effects.length - 1];
  if (!lastEffect.isDepositAsset) {
    teleportLogger.error(
      `Last effect not isDepositAsset, message id: ${messageId} at`,
      indexer
    );
    return null;
  }

  const dest = lastEffect.asDepositAsset.dest;
  if (dest.isX1) {
    return dest.asX1.asAccountId32.id.toString();
  } else if (dest.isX2) {
    return dest.asX2[1].asAccountId32.id.toString();
  } else {
    teleportLogger.error(
      `dest not isX1 and not isX2, message id: ${messageId} at`,
      indexer
    );
  }

  return null;
}

function getFee(effects, messageId, indexer) {
  const buyExecutionEffect = effects.find((effect) => effect.isBuyExecution);
  if (!buyExecutionEffect) {
    teleportLogger.error(
      `can not find buyExecution effect, message id: ${messageId} at`,
      indexer
    );
    return 0;
  }

  return buyExecutionEffect.asBuyExecution.debt.toString();
}

module.exports = {
  extractTeleportFromV0Xcm,
};
