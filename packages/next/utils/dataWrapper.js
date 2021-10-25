import React from "react";
import Address from "components/account/address";
import _ from "lodash";
import BigNumber from "bignumber.js";

export function convertCallForTableView(call, chain) {
  if (!call) {
    return {};
  }
  return {
    ...call,
    args: Object.fromEntries(
      call.args.map((arg) => {
        switch (arg.type) {
          case "Call":
          case "CallOf": {
            return [arg.name, convertCallForTableView(arg.value, chain)];
          }
          case "Vec<Call>":
          case "Vec<CallOf>": {
            return [
              arg.name,
              arg.value.map((v) => convertCallForTableView(v, chain)),
            ];
          }
          case "Bytes": {
            return [arg.name, hexToString(arg.value)];
          }
          case "Balance": {
            const value = new BigNumber(arg.value).toString();
            return [arg.name, value];
          }
          case "AccountId": {
            return [arg.name, <Address address={arg.value} />];
          }
          default: {
            return [arg.name, arg.value];
          }
        }
      })
    ),
  };
}

export function convertCallForJsonView(call, chain) {
  if (!call) {
    return {};
  }
  return {
    ...call,
    args: call.args.map((arg) => ({
      ...arg,
      value: (() => {
        switch (arg.type) {
          case "Call":
          case "CallOf": {
            return convertCallForJsonView(arg.value, chain);
          }
          case "Vec<Call>":
          case "Vec<CallOf>": {
            return arg.value.map((v) => convertCallForJsonView(v, chain));
          }
          case "Bytes": {
            return hexToString(arg.value);
          }
          default: {
            return arg.value;
          }
        }
      })(),
    })),
  };
}
