const BigNumber = require("bignumber.js");
const { insertTeleport } = require("../../../../mongo/service");

const {
  XcmPalletMethods,
  XcmPalletEvents,
  teleportLogger,
  env: { currentChain },
  utils: { bigAdd },
} = require("@statescan/common");
const { encodeAddress } = require("@polkadot/util-crypto");

async function handleTeleportExtrinsic(extrinsic, indexer, events) {
  const { method } = extrinsic.method;
  if (
    ![
      XcmPalletMethods.limitedTeleportAssets,
      XcmPalletMethods.teleportAssets,
    ].includes(method)
  ) {
    return;
  }

  if (!events.some((e) => XcmPalletEvents.Attempted === e.method)) {
    return;
  }

  const info = extractTeleportInfo(extrinsic);
  if (!info) {
    teleportLogger.error(`unexpected teleport at`, indexer);
    return;
  }

  const teleport = {
    sentAt: indexer.blockHeight,
    direction: 1,
    signer: extrinsic.signer.toString(),
    ...info,
    indexer,
  };

  await insertTeleport(teleport);
}

function isSupportedDest(destArg, indexer) {
  if (!destArg.isV0) {
    teleportLogger.error(`teleport dest not isV0 at`, indexer);
    return false;
  }

  const destArgV0 = destArg.asV0;
  if (!destArgV0.isX1 || !destArgV0.asX1.isParent) {
    teleportLogger.error(`not x1 parent teleport from asset chain at`, indexer);
    return false;
  }

  return true;
}

function extractBeneficiary(beneficiaryArg, indexer) {
  if (!beneficiaryArg.isV0) {
    teleportLogger.error(`teleport beneficiary not isV0 at`, indexer);
    return;
  }

  const beneficiaryArgV0 = beneficiaryArg.asV0;
  if (!beneficiaryArgV0.isX1 || !beneficiaryArgV0.asX1.isAccountId32) {
    teleportLogger.error(`teleport beneficiary not supported at`, indexer);
    return;
  }

  const pubId = beneficiaryArgV0.asX1.asAccountId32.id.toString();
  const chain = currentChain();
  return encodeAddress(pubId, "statemint" === chain ? 0 : 2);
}

function getAssetAmount(assetsArg, indexer) {
  if (!assetsArg.isV0) {
    teleportLogger.error(`teleport assets not isV0 at`, indexer);
    return;
  }

  const assetsArgV0 = assetsArg.asV0;
  return assetsArgV0.reduce((result, asset) => {
    if (!asset.isConcreteFungible) {
      return result;
    }

    return bigAdd(result, asset.asConcreteFungible.amount.toString());
  }, 0);
}

function extractTeleportInfo(extrinsic, indexer) {
  const [destArg, beneficiaryArg, assetsArg] = extrinsic.method.args;

  if (!isSupportedDest(destArg, indexer)) {
    return;
  }

  const beneficiary = extractBeneficiary(beneficiaryArg, indexer);
  if (!beneficiary) {
    teleportLogger.error(
      `can not extract beneficiary from teleport at`,
      indexer
    );
    return;
  }

  const amount = getAssetAmount(assetsArg, indexer);
  if (new BigNumber(amount).isLessThanOrEqualTo(0)) {
    teleportLogger.info(`no fungible at`, indexer);
  }

  return {
    beneficiary,
    amount,
  };
}

module.exports = {
  handleTeleportExtrinsic,
};
