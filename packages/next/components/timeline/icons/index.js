import Created from "./create.svg";
import ForceCreated from "./force-create.svg";
import MetadataSet from "./set-metadata.svg";
import MetadataCleared from "./clear-metadata.svg";
import AssetStatusChanged from "./force-asset-status.svg";
import TeamChanged from "./set-team.svg";
import OwnerChanged from "./transfer-ownership.svg";
import Issued from "./mint.svg";
import Burned from "./burn.svg";
import AssetFrozen from "./freeze-asset.svg";
import AssetThawed from "./thaw-asset.svg";
import Destroyed from "./destroy.svg";
import AttributeSet from "./set-attribute.svg";
import AttributeCleared from "./clear-attribute.svg";
import Redeposited from "./redeposit.svg";
import ApprovedTransfer from "./approve-transfer.svg";
import ApprovalCancelled from "./cancel-approval.svg";
import LinkIcon from "./link.svg";
import Placeholder from "./placeholder.svg";

const icons = {
  Created,
  ForceCreated,
  MetadataSet,
  ClassMetadataSet: MetadataSet,
  CollectionMetadataSet: MetadataSet,
  MetadataCleared,
  ClassMetadataCleared: MetadataCleared,
  AssetStatusChanged,
  TeamChanged,
  OwnerChanged,
  Transferred: OwnerChanged,
  Issued,
  Burned,
  AssetFrozen,
  AssetThawed,
  ClassFrozen: AssetFrozen,
  ClassThawed: AssetThawed,
  Frozen: AssetFrozen,
  Thawed: AssetThawed,
  Destroyed,
  AttributeSet,
  AttributeCleared,
  Redeposited,
  ApprovedTransfer,
  ApprovalCancelled,
  LinkIcon,
  Placeholder,
};

export default icons;
