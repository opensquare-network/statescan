const { u8aToHex, isHex } = require("@polkadot/util");

function decodePossibleCall(arg) {
  const rawValue = arg.toJSON();
  if (!isHex(rawValue)) {
    return normalizeCall(arg);
  }

  let call;
  try {
    call = arg.registry.createType("Call", rawValue);
  } catch (e) {
    return rawValue;
  }
  return normalizeCall(call);
}

function normalizeCall(call) {
  const { section, method } = call;
  const callIndex = u8aToHex(call.callIndex);

  const args = [];
  for (let index = 0; index < call.args.length; index++) {
    const arg = call.args[index];

    const argMeta = call.meta.args[index];
    const name = argMeta.name.toString();
    const type = argMeta.type.toString();

    let value = arg.toJSON();
    if (type === "Call" || type === "CallOf") {
      value = normalizeCall(arg);
    } else if (type === "Vec<Call>" || type === "Vec<CallOf>") {
      value = arg.map(normalizeCall);
    } else if (type === "WrapperKeepOpaque<Call>") {
      value = decodePossibleCall(arg);
    }

    args.push({
      name,
      type,
      value,
    });
  }

  return {
    callIndex,
    section,
    method,
    args,
  };
}

module.exports = {
  normalizeCall,
};
