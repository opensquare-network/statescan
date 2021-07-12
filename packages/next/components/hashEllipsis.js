import { hashEllipsis } from "../utils";
import Tooltip from "./tooltip";
import MonoText from "./monoText";

export default function HashEllipsis({ hash }) {
  return (
    <Tooltip content={hash}>
      <MonoText>{hashEllipsis(hash)}</MonoText>
    </Tooltip>
  );
}
