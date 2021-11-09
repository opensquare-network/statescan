import Address from "components/account/address";
import { makeTablePairs } from "utils";

function cleanTemplateArgs(typeName) {
  let result = typeName;
  let next;
  while ((next = result.replace(/<[^<>]*>/g,"")) !== result) {
    result = next;
  }
  return result;
}

export function makeEventArgs(node, event) {
  const eventData = makeTablePairs(
    [
      "Docs",
      ...event.meta.fields.map((f, i) => {
        return f.typeName && cleanTemplateArgs(f.typeName).split("::").pop() || event.meta.args[i];
      })
    ],
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
