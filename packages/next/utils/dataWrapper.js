import Address from "components/account/address";
import _ from "lodash";

export function showIdentityInJSON(args) {
  if (_.isEmpty(args)) {
    return args;
  }
  const keys = Object.keys(args);
  keys.forEach((key) => {
    if (typeof args[key] === "object") {
      showIdentityInJSON(args[key]);
    }
    if (key === "Id" && typeof args[key] === "string") {
      args[key] = <Address address={args[key]} />;
    }
  });
  return args;
}
