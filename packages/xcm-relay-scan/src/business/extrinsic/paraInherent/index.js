const { getUpwardMessageCollection } = require("../../../mongo");
const {
  utils: { bigAdd },
  Modules,
  busLogger,
  specs: { findRegistry },
} = require("@statescan/common");
const { blake2AsHex } = require("@polkadot/util-crypto");
const { extractV1Teleport } = require("./teleportV1");

async function handleParaInherentExtrinsic(extrinsic, indexer) {
  const { section, method } = extrinsic.method;

  if (
    ![Modules.ParaInherent, Modules.ParasInherent].includes(section) ||
    "enter" !== method
  ) {
    return;
  }

  const backedCandidates = extrinsic.method.args[0].backedCandidates;
  for (const { candidate } of backedCandidates) {
    await handleCandidate(candidate, indexer);
  }
}

async function handleCandidate({ descriptor, commitments }, indexer) {
  const paraId = descriptor.paraId.toNumber();
  if (paraId !== 1000 || (commitments.upwardMessages || []).length <= 0) {
    return;
  }

  if (commitments.upwardMessages.length > 1) {
    busLogger.info(
      `Got ${commitments.upwardMessages.length} upward msgs at ${indexer.blockHeight}`
    );
  }

  const col = await getUpwardMessageCollection();
  const bulk = col.initializeUnorderedBulkOp();
  let index = 0;
  for (const msg of commitments.upwardMessages) {
    const msgId = blake2AsHex(msg);
    const message = msg.toHex();
    const extracted = await extractUmp(message, indexer);
    bulk.insert({
      msgId,
      message,
      extracted,
      msgIndex: index++,
      descriptor: descriptor.toJSON(),
      indexer,
    });
  }

  await bulk.execute();
}

async function extractUmp(msg, indexer) {
  const registry = await findRegistry(indexer);
  let versionedXcm;
  try {
    versionedXcm = registry.createType("VersionedXcm", pubMsg, true);
  } catch (e) {
    console.log(`versionedXcm parse failed at ${indexer.blockHeight}`, e);
    return null;
  }

  if (versionedXcm.isV0) {
    const v0 = versionedXcm.asV0;
    if (v0.isReceiveTeleportedAsset) {
      return extractV0Teleport(v0.asReceiveTeleportedAsset, indexer);
    }
  } else if (versionedXcm.isV1) {
    const v1 = versionedXcm.asV1;
    if (v1.isReceiveTeleportedAsset) {
      return extractV1Teleport(v1.asReceiveTeleportedAsset, indexer);
    }
  } else {
    busLogger.error(`Found teleport version not V0 and V1 at`, indexer);
  }
}

async function extractV0Teleport(receiveTeleportAsset, indexer) {
  const teleportedAmount = receiveTeleportAsset.assets.reduce(
    (result, asset) => {
      if (!asset.isConcreteFungible) {
        return result;
      }

      const fungible = asset.asConcreteFungible;
      if (!fungible.id.isHere) {
        return result;
      }

      return bigAdd(result, fungible.amount.toString());
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

  let beneficiary;
  const dest = depositAsset.asDepositAsset.dest;
  if (dest.isX1 && dest.asX1.isAccountId32) {
    beneficiary = dest.asX1.asAccountId32.id.toString();
  } else if (dest.isX2 && dest.asX2.isAccountId32) {
    beneficiary = dest.asX2.asAccountId32.id.toString();
  }

  return {
    amount: teleportedAmount,
    fee,
    beneficiary,
  };
}

module.exports = {
  handleParaInherentExtrinsic,
};
