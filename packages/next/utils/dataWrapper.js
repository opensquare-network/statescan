import React from "react";
import dynamic from "next/dynamic";
import Address from "components/account/address";
import _ from "lodash";
import BigNumber from "bignumber.js";
import { hexToString } from "@polkadot/util";
import { hexEllipsis } from ".";
const LongText = dynamic(() => import("components/table/longText"), { ssr: false });


export function convertCallForTableView(call, chain) {
  return {
    ...call,
    args: convertArgsForTableView(call.args, call.section, call.method, chain)
  };
}

export function convertArgsForTableView(args, section, method, chain) {
  if (Array.isArray(args)) {
    return Object.fromEntries(
      args.map((arg, index) => {
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
            if (
              (section === "phalaRegistry" && method === "addPruntime") ||
              (section === "system" && method === "setCode") ||
              (section === "parachainSystem" && method === "enactAuthorizedUpgrade")
            ) {
              return [arg.name, <LongText key={`arg-${index}`} text={arg.value} key="0" />];
            }
            return [arg.name, hexToString(arg.value)];
          }
          case "Balance":
          case "Compact<Balance>": {
            const value = new BigNumber(arg.value).toString();
            return [arg.name, value];
          }
          case "LookupSource":
          case "MultiAddress": {
            if (arg.value.id) {
              return [arg.name, <Address key={`arg-${index}`} address={arg.value.id} />];
            } else {
              return [arg.name, arg.value];
            }
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
    args: convertArgsForJsonView(call.args, call.section, call.method, chain)
  };
}


export function convertArgsForJsonView(args, section, method, chain) {
  return Object.fromEntries(args.map(
    (arg) => ([
      arg.name,
      (() => {
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
            if (
              (section === "phalaRegistry" && method === "addPruntime") ||
              (section === "system" && method === "setCode") ||
              (section === "parachainSystem" && method === "enactAuthorizedUpgrade")
            ) {
              return arg.value?.length <= 200
                ? arg.value
                : hexEllipsis(arg.value);
            }
            return hexToString(arg.value);
          }
          default: {
            return arg.value;
          }
        }
      })(),
    ])
  ));
}
