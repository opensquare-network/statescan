import { addressEllipsis } from "utils";
import Tooltip from "components/Tooltip";

export default function AddressEllipsis({ address }) {
  return (
    <Tooltip content={address}>
      <div>{addressEllipsis(address)}</div>
    </Tooltip>
  );
}
