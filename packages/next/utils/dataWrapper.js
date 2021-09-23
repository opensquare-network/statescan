import React from "react";
import Address from "components/account/address";
import _ from "lodash";

export function showIdentityInJSON(args, doDeepCopy = false) {
  const result = {};
  if (_.isEmpty(args)) {
    return args;
  }
  const keys = Object.keys(args);
  keys.forEach((key) => {
    result[key] = args[key];
    if (typeof args[key] === "object" && !React.isValidElement(args[key])) {
      result[key] = showIdentityInJSON(args[key]);
    }
    if (key === "Id" && typeof args[key] === "string") {
      result[key] = <Address address={args[key]} />;
    }
  });
  return result;
}
