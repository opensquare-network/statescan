import Address from "components/account/address";

export function showIdentityInJSON(args) {
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
