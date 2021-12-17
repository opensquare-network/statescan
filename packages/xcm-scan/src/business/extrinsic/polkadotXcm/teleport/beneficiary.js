const { encodeAddress } = require("@polkadot/util-crypto");
const { currentChain } = require("@statescan/common/src/env");
const { teleportLogger } = require("@statescan/common");

function extractBeneficiary(beneficiaryArg, meta, indexer) {
  const type = meta.type.toString();

  if ("MultiLocation" === type) {
    return extractFromMultiLocation(beneficiaryArg, indexer);
  } else if (
    ["XcmVersionedMultiLocation", "VersionedMultiLocation"].includes(type)
  ) {
    return extractBeneficiaryFromVersionedType(beneficiaryArg, indexer);
  }

  teleportLogger.error(
    `unknown teleport beneficiary arg type ${type} at`,
    indexer
  );
}

function extractFromMultiLocation(beneficiaryArg, indexer) {
  if (!beneficiaryArg.isX1 || !beneficiaryArg.asX1.isAccountId32) {
    teleportLogger.error(`teleport beneficiary not supported at`, indexer);
    return;
  }

  const pubId = beneficiaryArg.asX1.asAccountId32.id.toString();
  const chain = currentChain();
  return encodeAddress(pubId, "statemint" === chain ? 0 : 2);
}

function extractBeneficiaryFromVersionedType(beneficiaryArg, indexer) {
  let junction;

  if (beneficiaryArg.isV1) {
    const beneficiaryArgV1 = beneficiaryArg.asV1;
    if (beneficiaryArgV1.parents.toNumber() !== 0) {
      return;
    }

    junction = beneficiaryArgV1.interior;
  } else if (beneficiaryArg.isV0) {
    junction = beneficiaryArg.asV0;
  } else {
    teleportLogger.error(
      `teleport beneficiary not supported version at`,
      indexer
    );
    return;
  }

  if (!junction.isX1 || !junction.asX1.isAccountId32) {
    teleportLogger.error(`teleport beneficiary not supported at`, indexer);
    return;
  }

  const pubId = junction.asX1.asAccountId32.id.toString();
  const chain = currentChain();
  return encodeAddress(pubId, "statemint" === chain ? 0 : 2);
}

module.exports = {
  extractBeneficiary,
};
