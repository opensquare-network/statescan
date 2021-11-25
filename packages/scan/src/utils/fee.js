const BN = require("bn.js");
const { BN_BILLION, BN_ZERO, bnToBn } = require('@polkadot/util');

async function calcFee(api, extrinsic, dispatchInfo) {
  if (dispatchInfo.paysFee !== "Yes") {
    return "0";
  }

  const extrinsicHex = extrinsic.toHex();

  const transactionByteFee = api.consts.transactionPayment.transactionByteFee.toJSON();
  const operationalFeeMultiplier = api.consts.transactionPayment.operationalFeeMultiplier.toJSON();
  const blockWeights = api.consts.system.blockWeights.toJSON();

  const lenFee = bnToBn(transactionByteFee).mul(bnToBn(extrinsicHex.length));

  const weight = dispatchInfo.weight;
  const unadjustedWeightFee = weightToFee(api, weight);
  const adjustedWeightFee = unadjustedWeightFee.mul(bnToBn(operationalFeeMultiplier));

  const blockWeight = blockWeights.perClass[dispatchInfo.class.toLowerCase()];
  const baseFee = weightToFee(api, blockWeight.baseExtrinsic);

  const fee = bnToBn(adjustedWeightFee).iadd(baseFee).iadd(lenFee);

  return fee.toNumber();
}

function weightToFee(api, weight) {
  return (api.consts.transactionPayment?.weightToFee || []).reduce((acc, { coeffFrac, coeffInteger, degree, negative }) => {
    const w = bnToBn(weight).pow(degree);
    const frac = coeffFrac.mul(w).div(BN_BILLION);
    const integer = coeffInteger.mul(w);

    if (negative.isTrue) {
      acc.isub(frac);
      acc.isub(integer);
    } else {
      acc.iadd(frac);
      acc.iadd(integer);
    }

    return acc;
  }, BN_ZERO);
}

module.exports = {
  calcFee,
};
