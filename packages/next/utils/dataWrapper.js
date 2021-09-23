import React from "react";
import Address from "components/account/address";
import _ from "lodash";

export function showIdentityInJSON(args, doDeepCopy = false) {
  const copy = doDeepCopy ? { ...args } : args;
  if (_.isEmpty(copy)) {
    return copy;
  }
  const keys = Object.keys(copy);
  keys.forEach((key) => {
    if (typeof copy[key] === "object" && !React.isValidElement(copy[key])) {
      showIdentityInJSON(copy[key]);
    }
    if (key === "Id" && typeof copy[key] === "string") {
      copy[key] = <Address address={copy[key]} />;
    }
  });
  return copy;
}
