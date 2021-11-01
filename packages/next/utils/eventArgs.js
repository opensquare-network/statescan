import Address from "components/account/address";
import { makeTablePairs } from "utils";

const last = (arr) => arr.length && arr[arr.length - 1] || undefined;

export function makeEventArgs(node, event) {
  const eventData = makeTablePairs(
    ["Docs", ...event.meta.fields.map((f, i) => f.typeName && last(f.typeName.split("::")) || event.meta.args[i])],
    [
      (event?.meta?.docs || event?.meta?.documentation)?.join("").trim() || "",
      ...event.data,
    ]
  );

  return {
    object_type: eventData.object_type,
    object_data: eventData.object_data.map(([type, val]) => {
      if (type === "AccountId") {
        return [type, <Address key="0" address={val} />];
      }
      return [type, val];
    }),
  };
}
