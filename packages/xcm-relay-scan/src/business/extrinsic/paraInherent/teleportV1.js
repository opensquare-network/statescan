const {
  utils: { bigAdd },
  busLogger,
} = require("@statescan/common");

async function extractV1Teleport(receiveTeleportAsset, indexer) {
  const teleportedAmount = receiveTeleportAsset.assets.reduce(
    (result, asset) => {
      const { id, fungibility } = asset;
      if (!id.isConcrete) {
        return result;
      }

      const concrete = id.asConcrete;
      const { parents, interior } = concrete;
      if (parents.toNumber() !== 0 || !interior.isHere) {
        return result;
      }

      if (!fungibility.isFungible) {
        return result;
      }
      return bigAdd(result, fungibility.asFungible.toString());
    },
    0
  );

  const effects = receiveTeleportAsset.effects;
  const buyExecution = effects.find((effect) => effect.isBuyExecution);
  const depositAsset = effects.find((effect) => effect.isDepositAsset);

  const fee = buyExecution.asBuyExecution.debt.toString();
  if (!depositAsset) {
    busLogger.error(`No deposit found at ${indexer.blockHeight}`);
    return null;
  }

  let beneficiary = depositAsset.asDepositAsset.beneficiary;
  if (beneficiary.parents.toNumber() !== 0) {
    busLogger.error(`beneficiary parents not 0 at ${indexer.blockHeight}`);
  }

  const interior = beneficiary.interior;
  if (interior.isX1 && interior.asX1.isAccountId32) {
    beneficiary = interior.asX1.asAccountId32.id.toString();
  } else if (interior.isX2 && interior.asX2.isAccountId32) {
    beneficiary = interior.asX2.asAccountId32.id.toString();
  }

  return {
    amount: teleportedAmount,
    fee,
    beneficiary,
  };
}

module.exports = {
  extractV1Teleport,
};
