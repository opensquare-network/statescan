import icons from "./icons";

const Titles = {
  Created: "Create",
  ForceCreated: "Force Create",
  MetadataSet: "Set Metadata",
  MetadataCleared: "Clear Metadata",
  AssetStatusChanged: "Force Asset Status",
  TeamChanged: "Set Team",
  OwnerChanged: "Transfer Ownership",
  AssetFrozen: "Freeze Asset",
  AssetThawed: "Thaw Asset",
  Destroyed: "Destroy",
  Issued: "Mint",
  Burned: "Burn",
};

const getTitle = (timelineItem) => {
  return Titles[timelineItem.method] || timelineItem.method;
};

const getIcon = (timelineItem) => {
  return icons[timelineItem.method] || <div />;
};

const getFields = (timelineItem) => {
  switch (timelineItem.method) {
    case "Created": {
      const [assetId, admin] = timelineItem.eventData;
      return {
        "Asset ID": assetId,
        Admin: admin,
        "Min Balance": timelineItem.asset.minBalance,
      };
    }
    case "ForceCreated": {
      const [assetId, admin] = timelineItem.eventData;
      return {
        "Asset ID": assetId,
        Admin: admin,
        Sufficient: timelineItem.asset.isSufficient,
        "Min Balance": timelineItem.asset.minBalance,
      };
    }
    case "MetadataSet": {
      const [assetId, name, symbol, decimals] = timelineItem.eventData;
      return {
        "Asset ID": assetId,
        Name: timelineItem.asset.name,
        Symbol: timelineItem.asset.symbol,
        Decimals: decimals,
      };
    }
    case "MetadataCleared": {
      const [assetId] = timelineItem.eventData;
      return {
        "Asset ID": assetId,
      };
    }
    case "AssetStatusChanged": {
      const [assetId] = timelineItem.eventData;
      return {
        "Asset ID": assetId,
        Admin: timelineItem.asset.admin,
        Owner: timelineItem.asset.owner,
        Issuer: timelineItem.asset.issuer,
        Freezer: timelineItem.asset.freezer,
        "Min Balance": timelineItem.asset.minBalance,
        Sufficient: timelineItem.asset.isSufficient,
        Frozen: timelineItem.asset.isFrozen,
      };
    }
    case "TeamChanged": {
      const [assetId, issuer, admin, freezer] = timelineItem.eventData;
      return {
        "Asset ID": assetId,
        Admin: admin,
        Issuer: issuer,
        Freezer: freezer,
      };
    }
    case "OwnerChanged": {
      const [assetId, owner] = timelineItem.eventData;
      return {
        "Asset ID": assetId,
        Admin: owner,
      };
    }
    case "AssetFrozen": {
      const [assetId] = timelineItem.eventData;
      return {
        "Asset ID": assetId,
      };
    }
    case "AssetThawed": {
      const [assetId] = timelineItem.eventData;
      return {
        "Asset ID": assetId,
      };
    }
    case "Destoryed": {
      const [assetId] = timelineItem.eventData;
      return {
        "Asset ID": assetId,
      };
    }
    case "Issued": {
      const [assetId, beneficiary, amount] = timelineItem.eventData;
      return {
        "Asset ID": assetId,
        Beneficiary: beneficiary,
        Amount: amount,
      };
    }
    case "Burned": {
      const [assetId, who, amount] = timelineItem.eventData;
      return {
        "Asset ID": assetId,
        Who: who,
        Amount: amount,
      };
    }
  }
};

export default function Timeline({ data }) {
  return (data || []).map((item) => {
    const Icon = getIcon(item);
    return (
      <>
        <div>{getTitle(item)}</div>
        <Icon />
        <pre>{JSON.stringify(getFields(item), null, 2)}</pre>
      </>
    );
  });
}
