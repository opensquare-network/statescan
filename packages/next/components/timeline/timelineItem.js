import styled from "styled-components";
import icons from "./icons";
import Time from "./time";
import InLink from "components/inLink";
import CopyText from "components/copyText";
import BreakText from "components/breakText";
import { bigNumber2Locale, fromAssetUnit } from "utils";
import BigNumber from "bignumber.js";
import Address from "components/address";

const Wrapper = styled.div`
  display: flex;
  align-items: stretch;
  min-height: 114px;
  :first-child {
    .top-line {
      visibility: hidden;
    }
  }
  :last-child {
    .bot-line {
      visibility: hidden;
    }
    .fileds {
      border-bottom: none;
    }
  }
`;

const ItemLine = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 16px;
`;

const TopLine = styled.div`
  width: 2px;
  height: 20px;
  margin-bottom: 4px;
  background: #eeeeee;
`;

const BotLine = styled.div`
  width: 2px;
  margin-top: 4px;
  background: #eeeeee;
  flex-grow: 1;
`;

const ItemWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 16px;
  flex-grow: 1;
  @media screen and (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const BoldText = styled.p`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
`;

const TimelineHeader = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 48px 24px 0;
  min-width: 280px;
  > :nth-child(2) {
    margin-top: 4px;
  }
  > :nth-child(3) {
    margin-top: 8px;
  }
  @media screen and (max-width: 900px) {
    min-width: 0px;
  }
`;

const TimelineFields = styled.div`
  flex-grow: 1;
  padding-bottom: 16px;
  border-bottom: 1px solid #f8f8f8;
`;

const FiledWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  @media screen and (max-width: 900px) {
    flex-direction: column;
  }
`;

const FieldTitle = styled.div`
  padding: 8px 0;
  min-width: 176px;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  flex: 0 0 auto;
`;

const FieldBody = styled.div`
  flex-grow: 1;
  padding: 8px 0 8px 24px;
  font-size: 14px;
  @media screen and (max-width: 900px) {
    padding-left: 0px;
  }
`;

const FieldText = styled.p`
  font-size: 14px;
  line-height: 20px;
  color: rgba(17, 17, 17, 0.65);
`;

const Links = styled.div`
  display: flex;

  > :not(:first-child) {
    margin-left: 8px;
  }
`;

const LinkItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 2px 8px;

  height: 20px;

  background: #f4f4f4;
  border-radius: 4px;

  span {
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;
    color: rgba(17, 17, 17, 0.65);
  }
  svg {
    margin-left: 8px;
  }

  :hover {
    span {
      color: #111111;
    }
    svg > path {
      stroke-opacity: 0.35;
    }
  }
`;

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

function formatBalance(balance, asset) {
  const balanceStr = new BigNumber(balance).toString();
  return (
    <BreakText>
      {bigNumber2Locale(balanceStr)}
      {Number.isInteger(asset.decimals) && asset.symbol ? (
        <span style={{ marginLeft: 8 }}>
          ({bigNumber2Locale(fromAssetUnit(balance, asset.decimals))}{" "}
          {asset.symbol})
        </span>
      ) : (
        <></>
      )}
    </BreakText>
  );
}

export default function TimelineItem({ data, asset }) {
  const getTitle = (timelineItem) =>
    Titles[timelineItem.method] || timelineItem.method;

  const getIcon = (timelineItem) => icons[timelineItem.method] || <div />;

  const getFields = (timelineItem) => {
    switch (timelineItem.method) {
      case "Created": {
        const [assetId, admin] = timelineItem.eventData;
        return {
          "Asset ID": <FieldText>{`#${assetId}`}</FieldText>,
          Admin: (
            <CopyText text={admin}>
              <Address address={admin} to={`/account/${admin}`} />
            </CopyText>
          ),
          "Min Balance": formatBalance(timelineItem.asset.minBalance, asset),
        };
      }
      case "ForceCreated": {
        const [assetId, admin] = timelineItem.eventData;
        return {
          "Asset ID": <FieldText>{`#${assetId}`}</FieldText>,
          Admin: (
            <CopyText text={admin}>
              <Address address={admin} to={`/account/${admin}`} />
            </CopyText>
          ),
          Sufficient: <FieldText>{timelineItem.asset.isSufficient}</FieldText>,
          "Min Balance": formatBalance(timelineItem.asset.minBalance, asset),
        };
      }
      case "MetadataSet": {
        const [assetId, name, symbol, decimals] = timelineItem.eventData;
        return {
          "Asset ID": <FieldText>{`#${assetId}`}</FieldText>,
          Symbol: <FieldText>{timelineItem.asset.symbol}</FieldText>,
          Name: <FieldText>{timelineItem.asset.name}</FieldText>,
          Decimals: decimals,
        };
      }
      case "MetadataCleared": {
        const [assetId] = timelineItem.eventData;
        return {
          "Asset ID": <FieldText>{`#${assetId}`}</FieldText>,
        };
      }
      case "AssetStatusChanged": {
        const [assetId] = timelineItem.eventData;
        return {
          "Asset ID": <FieldText>{`#${assetId}`}</FieldText>,
          Admin: (
            <CopyText text={timelineItem.asset.admin}>
              <Address
                address={timelineItem.asset.admin}
                to={`/account/${timelineItem.asset.admin}`}
              />
            </CopyText>
          ),
          Owner: (
            <CopyText text={timelineItem.asset.owner}>
              <Address
                address={timelineItem.asset.owner}
                to={`/account/${timelineItem.asset.owner}`}
              />
            </CopyText>
          ),
          Issuer: (
            <CopyText text={timelineItem.asset.issuer}>
              <Address
                address={timelineItem.asset.issuer}
                to={`/account/${timelineItem.asset.issuer}`}
              />
            </CopyText>
          ),
          Freezer: (
            <CopyText text={timelineItem.asset.freezer}>
              <Address
                address={timelineItem.asset.freezer}
                to={`/account/${timelineItem.asset.freezer}`}
              />
            </CopyText>
          ),
          "Min Balance": formatBalance(timelineItem.asset.minBalance, asset),
          Sufficient: <BoldText>{timelineItem.asset.isSufficient}</BoldText>,
          Frozen: <BoldText>{timelineItem.asset.isFrozen}</BoldText>,
        };
      }
      case "TeamChanged": {
        const [assetId, issuer, admin, freezer] = timelineItem.eventData;
        return {
          "Asset ID": <FieldText>{`#${assetId}`}</FieldText>,
          Admin: (
            <CopyText text={admin}>
              <Address address={admin} to={`/account/${admin}`} />
            </CopyText>
          ),
          Issuer: (
            <CopyText text={issuer}>
              <Address address={issuer} to={`/account/${issuer}`} />
            </CopyText>
          ),
          Freezer: (
            <CopyText text={freezer}>
              <Address address={freezer} to={`/account/${freezer}`} />
            </CopyText>
          ),
        };
      }
      case "OwnerChanged": {
        const [assetId, owner] = timelineItem.eventData;
        return {
          "Asset ID": <FieldText>{`#${assetId}`}</FieldText>,
          Admin: (
            <CopyText text={owner}>
              <Address address={owner} to={`/account/${owner}`} />
            </CopyText>
          ),
        };
      }
      case "AssetFrozen": {
        const [assetId] = timelineItem.eventData;
        return {
          "Asset ID": <FieldText>{`#${assetId}`}</FieldText>,
        };
      }
      case "AssetThawed": {
        const [assetId] = timelineItem.eventData;
        return {
          "Asset ID": <FieldText>{`#${assetId}`}</FieldText>,
        };
      }
      case "Destoryed": {
        const [assetId] = timelineItem.eventData;
        return {
          "Asset ID": <FieldText>{`#${assetId}`}</FieldText>,
        };
      }
      case "Issued": {
        const [assetId, beneficiary, amount] = timelineItem.eventData;
        return {
          "Asset ID": <FieldText>{`#${assetId}`}</FieldText>,
          Beneficiary: (
            <CopyText text={beneficiary}>
              <Address address={beneficiary} to={`/account/${beneficiary}`} />
            </CopyText>
          ),
          Amount: formatBalance(amount, asset),
        };
      }
      case "Burned": {
        const [assetId, who, amount] = timelineItem.eventData;
        return {
          "Asset ID": <FieldText>{`#${assetId}`}</FieldText>,
          Who: (
            <CopyText text={who}>
              <Address address={who} to={`/account/${who}`} />
            </CopyText>
          ),
          Amount: formatBalance(amount, asset),
        };
      }
    }
  };

  const Icon = getIcon(data);

  return (
    <Wrapper>
      <ItemLine>
        <TopLine className="top-line" />
        <Icon />
        <BotLine className="bot-line" />
      </ItemLine>
      <ItemWrapper>
        <TimelineHeader>
          <BoldText>{getTitle(data)}</BoldText>
          <Time ts={data.eventIndexer.blockTime} />
          <Links>
            <InLink
              to={`/extrinsic/${data.eventIndexer.blockHeight}-${data.extrinsicIndex}`}
            >
              <LinkItem>
                <span>{"Extrinsic"}</span>
                <icons.LinkIcon />
              </LinkItem>
            </InLink>
            <InLink
              to={`/event/${data.eventIndexer.blockHeight}-${data.eventSort}`}
            >
              <LinkItem>
                <span>{"Event"}</span>
                <icons.LinkIcon />
              </LinkItem>
            </InLink>
          </Links>
        </TimelineHeader>
        <TimelineFields className="fileds">
          {(Object.entries(getFields(data)) || []).map((item, index) => (
            <FiledWrapper key={index}>
              <FieldTitle>{item[0]}</FieldTitle>
              <FieldBody>{item[1]}</FieldBody>
            </FiledWrapper>
          ))}
        </TimelineFields>
      </ItemWrapper>
    </Wrapper>
  );
}
