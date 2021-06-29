import { hashEllipsis } from "utils";
import { Popup } from "semantic-ui-react";
import "semantic-ui-css/components/popup.min.css";

export default function HashEllipsis({ hash }) {
  return (
    <Popup
      content={<div>{hash}</div>}
      size="mini"
      trigger={<div>{hashEllipsis(hash)}</div>}
    />
  );
}
