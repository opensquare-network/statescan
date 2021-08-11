import Address from "components/address";
import { makeTablePairs } from "utils";

export function makeEventArgs(node, event) {
  const eventData = makeTablePairs(
    ["Docs", ...event.meta.args],
    [(event?.meta?.docs || event?.meta?.documentation)?.join("").trim() || "", ...event.data]
  )

  return {
    object_type: eventData.object_type,
    object_data: eventData.object_data
      .map(([type, val]) => {
        if (type === "AccountId") {
          return [
            type,
            <Address address={val} to={`/${node}/account/${val}`} />
          ];
        }
        return [type, val];
      })
  }
}