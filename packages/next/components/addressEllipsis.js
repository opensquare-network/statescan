import { addressEllipsis } from "utils";
import Tooltip from "components/tooltip";
import MonoText from "./MonoText";

export default function AddressEllipsis({ address }) {
  return (
    <Tooltip content={address}>
      <MonoText>{addressEllipsis(address)}</MonoText>
    </Tooltip>
  );
}
