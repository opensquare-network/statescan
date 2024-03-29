import styled from "styled-components";
import icons from "./icons";
import Time from "./time";
import BlockHeight from "./blockHeight";
import InLink from "components/inLink";
import CopyText from "components/copyText";
import BreakText from "components/breakText";
import { bigNumber2Locale, fromAssetUnit } from "utils";
import BigNumber from "bignumber.js";
import Address from "components/address";
import placeholder from "lodash/fp/placeholder";
import { hexToString, isHex } from "@polkadot/util";

const div = styled.div``;

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
    margin-top: 8px;
  }

  > :nth-child(3) {
    margin-top: 8px;
  }

  @media screen and (max-width: 900px) {
    > :nth-child(2) {
      margin-top: 12px;
    }

    min-width: 0;
  }
`;

const TimelineFields = styled.div`
  flex-grow: 1;
  padding-top: 2px;
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
  text-transform: none;
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
  ClassMetadataSet: "Set Metadata",
  ClassMetadataCleared: "Clear Metadata",
  AssetStatusChanged: "Force Asset Status",
  AttributeSet: "Set Attribute",
  AttributeCleared: "Clear Attribute",
  TeamChanged: "Set Team",
  OwnerChanged: "Transfer Ownership",
  Transferred: "Transfer",
  ApprovedTransfer: "Approve Transfer",
  ApprovalCancelled: "Cancel Approval",
  ClassFrozen: "Freeze Class",
  ClassThawed: "Thaw Class",
  Frozen: "Freeze Asset",
  Thawed: "Thaw Asset",
  Destroyed: "Destroy",
  Issued: "Mint",
  Burned: "Burn",
  Redeposited: "Redeposit",
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

export default function NftTimelineItem({ data }) {
  const getTitle = (timelineItem) =>
    Titles[timelineItem.name] || timelineItem.name;

  const getIcon = (timelineItem) =>
    icons[timelineItem.name] || icons.Placeholder;

  const getFields = (timelineItem) => {
    switch (timelineItem.name) {
      case "Created": {
        return {
          ...timelineItem.args,
          creator: (
            <CopyText>
              {" "}
              <Address
                address={timelineItem.args.creator}
                to={`/account/${timelineItem.args.creator}`}
              />{" "}
            </CopyText>
          ),
          owner: (
            <CopyText>
              {" "}
              <Address
                address={timelineItem.args.owner}
                to={`/account/${timelineItem.args.owner}`}
              />{" "}
            </CopyText>
          ),
        };
      }
      case "ForceCreated": {
        return {
          ...timelineItem.args,
          owner: (
            <CopyText>
              {" "}
              <Address
                address={timelineItem.args.owner}
                to={`/account/${timelineItem.args.owner}`}
              />{" "}
            </CopyText>
          ),
        };
      }
      case "AssetStatusChanged": {
        return {
          ...timelineItem.args,
          owner: (
            <CopyText>
              {" "}
              <Address
                address={timelineItem.args.owner}
                to={`/account/${timelineItem.args.owner}`}
              />{" "}
            </CopyText>
          ),
          issuer: (
            <CopyText>
              {" "}
              <Address
                address={timelineItem.args.issuer}
                to={`/account/${timelineItem.args.issuer}`}
              />{" "}
            </CopyText>
          ),
          admin: (
            <CopyText>
              {" "}
              <Address
                address={timelineItem.args.admin}
                to={`/account/${timelineItem.args.admin}`}
              />{" "}
            </CopyText>
          ),
          freezer: (
            <CopyText>
              {" "}
              <Address
                address={timelineItem.args.freezer}
                to={`/account/${timelineItem.args.freezer}`}
              />{" "}
            </CopyText>
          ),
          freeHolding: timelineItem?.args?.freeHolding?.toString(),
          isFrozen: timelineItem?.args?.isFrozen?.toString(),
        };
      }
      case "TeamChanged": {
        return {
          ...timelineItem.args,
          issuer: (
            <CopyText>
              {" "}
              <Address
                address={timelineItem.args.issuer}
                to={`/account/${timelineItem.args.issuer}`}
              />{" "}
            </CopyText>
          ),
          admin: (
            <CopyText>
              {" "}
              <Address
                address={timelineItem.args.admin}
                to={`/account/${timelineItem.args.admin}`}
              />{" "}
            </CopyText>
          ),
          freezer: (
            <CopyText>
              {" "}
              <Address
                address={timelineItem.args.freezer}
                to={`/account/${timelineItem.args.freezer}`}
              />{" "}
            </CopyText>
          ),
        };
      }
      case "OwnerChanged": {
        return {
          ...timelineItem.args,
          newOwner: (
            <CopyText>
              {" "}
              <Address
                address={timelineItem.args.newOwner}
                to={`/account/${timelineItem.args.newOwner}`}
              />{" "}
            </CopyText>
          ),
        };
      }
      case "Issued": {
        return {
          ...timelineItem.args,
          owner: (
            <CopyText>
              {" "}
              <Address
                address={timelineItem.args.owner}
                to={`/account/${timelineItem.args.owner}`}
              />{" "}
            </CopyText>
          ),
        };
      }
      case "Transferred": {
        return {
          ...timelineItem.args,
          from: (
            <CopyText>
              {" "}
              <Address
                address={timelineItem.args.from}
                to={`/account/${timelineItem.args.from}`}
              />{" "}
            </CopyText>
          ),
          to: (
            <CopyText>
              {" "}
              <Address
                address={timelineItem.args.to}
                to={`/account/${timelineItem.args.to}`}
              />{" "}
            </CopyText>
          ),
        };
      }
      case "ApprovedTransfer":
      case "ApprovalCancelled": {
        return {
          ...timelineItem.args,
          owner: (
            <CopyText>
              {" "}
              <Address
                address={timelineItem.args.owner}
                to={`/account/${timelineItem.args.owner}`}
              />{" "}
            </CopyText>
          ),
          delegate: (
            <CopyText>
              {" "}
              <Address
                address={timelineItem.args.delegate}
                to={`/account/${timelineItem.args.delegate}`}
              />{" "}
            </CopyText>
          ),
        };
      }
      case "ClassMetadataSet":
      case "CollectionMetadataSet":
      case "MetadataSet": {
        return {
          ...timelineItem.args,
          data: (
            <BreakText>
              {isHex(timelineItem.args.data)
                ? hexToString(timelineItem.args.data)
                : timelineItem.args.data}
            </BreakText>
          ),
          isFrozen: timelineItem?.args?.isFrozen?.toString(),
        };
      }
      default:
        if (!timelineItem.args) {
          return placeholder;
        }
        return timelineItem.args;
    }
  };

  const Icon = getIcon(data);

  return (
    <Wrapper className="nft-timeline-item">
      <ItemLine>
        <TopLine className="top-line" />
        <Icon />
        <BotLine className="bot-line" />
      </ItemLine>
      <ItemWrapper>
        <TimelineHeader>
          <BoldText>{getTitle(data)}</BoldText>
          <Time ts={data.indexer.blockTime} />
          <BlockHeight height={data.indexer.blockHeight} />
          <Links>
            <InLink
              to={`/extrinsic/${data.indexer.blockHeight}-${data.indexer.extrinsicIndex}`}
            >
              <LinkItem>
                <span>{"Extrinsic"}</span>
                <icons.LinkIcon />
              </LinkItem>
            </InLink>
            <InLink
              to={`/event/${data.indexer.blockHeight}-${data.indexer.eventIndex}`}
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
