import { hashEllipsis } from "utils";
import Tooltip from "components/Tooltip";

export default function HashEllipsis({ hash }) {
  return (
    <Tooltip content={hash}>
      <div>{hashEllipsis(hash)}</div>
    </Tooltip>
  );
}
