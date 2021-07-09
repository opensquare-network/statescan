import { hashEllipsis } from "utils";
import Tooltip from "components/tooltip";

export default function HashEllipsis({ hash }) {
  return (
    <Tooltip content={hash}>
      <div>{hashEllipsis(hash)}</div>
    </Tooltip>
  );
}
