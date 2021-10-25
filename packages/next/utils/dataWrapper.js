import React from "react";
import Address from "components/account/address";
import _ from "lodash";
import BigNumber from "bignumber.js";
import { hexToString } from "@polkadot/util";


export function convertCallForTableView(call, chain) {
  return {
    ...call,
    args: convertArgsForTableView(call.args, chain)
  };
}

export function convertArgsForTableView(args, chain) {
  if (Array.isArray(args)) {
    return Object.fromEntries(
      args.map((arg) => {
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
          case "Balance": case "Compact<Balance>": {
            const value = new BigNumber(arg.value).toString();
            return [arg.name, value];
          }
          case "LookupSource": {
            return [arg.name, <Address address={arg.value.id} />];
          }
          default: {
            return [arg.name, arg.value];
          }
        }
      })
    );
  }
}

export function convertCallForJsonView(call, chain) {
  return {
    ...call,
    args: convertArgsForJsonView(call.args, chain)
  };
}


export function convertArgsForJsonView(args, chain) {
  return args.map((arg) => ({
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
    }));
}
