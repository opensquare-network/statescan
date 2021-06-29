import { addressEllipsis } from "utils";
import { Popup } from "semantic-ui-react";
import "semantic-ui-css/components/popup.min.css";

export default function AddressEllipsis({ address }) {
  return (
    <Popup
      content={<div>{address}</div>}
      size="mini"
      trigger={<div>{addressEllipsis(address)}</div>}
    />
  );
}
