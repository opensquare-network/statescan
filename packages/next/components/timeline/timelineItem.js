import styled from "styled-components";
import icons from "./icons";
import Time from "./time";
import InLink from "components/inLink";
import CopyText from "components/copyText";
import BreakText from "components/breakText";
import MonoText from "components/monoText";
import { bigNumber2Locale, fromAssetUnit } from "utils";
import BigNumber from "bignumber.js";

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
  padding: 10px 48px 10px 0;
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

const FiledTitle = styled.div`
  padding: 8px 0;
  min-width: 176px;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  flex: 0 0 auto;
`;

const FiledBody = styled.div`
  flex-grow: 1;
  padding: 8px 0 8px 24px;
  font-size: 14px;
  @media screen and (max-width: 900px) {
    padding-left: 0px;
  }
`;

const FiledText = styled.p`
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
    <>
      {bigNumber2Locale(balanceStr)}
      {Number.isInteger(asset.decimals) && asset.symbol ? (
        <span style={{ marginLeft: 8 }}>
          ({bigNumber2Locale(fromAssetUnit(balance, asset.decimals))}{" "}
          {asset.symbol})
        </span>
      ) : (
        <></>
      )}
    </>
  );
}

export default function TimelineItem({ data, node, asset }) {
  const getTitle = (timelineItem) =>
    Titles[timelineItem.method] || timelineItem.method;

  const getIcon = (timelineItem) => icons[timelineItem.method] || <div />;

  const getFields = (timelineItem) => {
    switch (timelineItem.method) {
      case "Created": {
        const [assetId, admin] = timelineItem.eventData;
        return {
          "Asset ID": <FiledText>{`#${assetId}`}</FiledText>,
          Admin: (
            <BreakText>
              <CopyText text={admin}>
                <MonoText>
                  <InLink to={`/${node}/account/${admin}`}>{admin}</InLink>
                </MonoText>
              </CopyText>
            </BreakText>
          ),
          "Min Balance": formatBalance(timelineItem.asset.minBalance, asset),
        };
      }
      case "ForceCreated": {
        const [assetId, admin] = timelineItem.eventData;
        return {
          "Asset ID": <FiledText>{`#${assetId}`}</FiledText>,
          Admin: (
            <BreakText>
              <CopyText text={admin}>
                <MonoText>
                  <InLink to={`/${node}/account/${admin}`}>{admin}</InLink>
                </MonoText>
              </CopyText>
            </BreakText>
          ),
          Sufficient: <FiledText>{timelineItem.asset.isSufficient}</FiledText>,
          "Min Balance": formatBalance(timelineItem.asset.minBalance, asset),
        };
      }
      case "MetadataSet": {
        const [assetId, name, symbol, decimals] = timelineItem.eventData;
        return {
          "Asset ID": <FiledText>{`#${assetId}`}</FiledText>,
          Symbol: <FiledText>{timelineItem.asset.symbol}</FiledText>,
          Name: <FiledText>{timelineItem.asset.name}</FiledText>,
          Decimals: decimals,
        };
      }
      case "MetadataCleared": {
        const [assetId] = timelineItem.eventData;
        return {
          "Asset ID": <FiledText>{`#${assetId}`}</FiledText>,
        };
      }
      case "AssetStatusChanged": {
        const [assetId] = timelineItem.eventData;
        return {
          "Asset ID": <FiledText>{`#${assetId}`}</FiledText>,
          Admin: (
            <BreakText>
              <CopyText text={timelineItem.asset.admin}>
                <MonoText>
                  <InLink to={`/${node}/account/${timelineItem.asset.admin}`}>
                    {timelineItem.asset.admin}
                  </InLink>
                </MonoText>
              </CopyText>
            </BreakText>
          ),
          Owner: (
            <BreakText>
              <CopyText text={timelineItem.asset.owner}>
                <MonoText>
                  <InLink to={`/${node}/account/${timelineItem.asset.owner}`}>
                    {timelineItem.asset.owner}
                  </InLink>
                </MonoText>
              </CopyText>
            </BreakText>
          ),
          Issuer: (
            <BreakText>
              <CopyText text={timelineItem.asset.issuer}>
                <MonoText>
                  <InLink to={`/${node}/account/${timelineItem.asset.issuer}`}>
                    {timelineItem.asset.issuer}
                  </InLink>
                </MonoText>
              </CopyText>
            </BreakText>
          ),
          Freezer: (
            <BreakText>
              <CopyText text={timelineItem.asset.freezer}>
                <MonoText>
                  <InLink to={`/${node}/account/${timelineItem.asset.freezer}`}>
                    {timelineItem.asset.freezer}
                  </InLink>
                </MonoText>
              </CopyText>
            </BreakText>
          ),
          "Min Balance": formatBalance(timelineItem.asset.minBalance, asset),
          Sufficient: <BoldText>{timelineItem.asset.isSufficient}</BoldText>,
          Frozen: <BoldText>{timelineItem.asset.isFrozen}</BoldText>,
        };
      }
      case "TeamChanged": {
        const [assetId, issuer, admin, freezer] = timelineItem.eventData;
        return {
          "Asset ID": <FiledText>{`#${assetId}`}</FiledText>,
          Admin: admin(
            <BreakText>
              <CopyText text={admin}>
                <MonoText>
                  <InLink to={`/${node}/account/${admin}`}>{admin}</InLink>
                </MonoText>
              </CopyText>
            </BreakText>
          ),
          Issuer: (
            <BreakText>
              <CopyText text={issuer}>
                <MonoText>
                  <InLink to={`/${node}/account/${issuer}`}>{issuer}</InLink>
                </MonoText>
              </CopyText>
            </BreakText>
          ),
          Freezer: (
            <BreakText>
              <CopyText text={freezer}>
                <MonoText>
                  <InLink to={`/${node}/account/${freezer}`}>{freezer}</InLink>
                </MonoText>
              </CopyText>
            </BreakText>
          ),
        };
      }
      case "OwnerChanged": {
        const [assetId, owner] = timelineItem.eventData;
        return {
          "Asset ID": <FiledText>{`#${assetId}`}</FiledText>,
          Admin: (
            <BreakText>
              <CopyText text={owner}>
                <MonoText>
                  <InLink to={`/${node}/account/${owner}`}>{owner}</InLink>
                </MonoText>
              </CopyText>
            </BreakText>
          ),
        };
      }
      case "AssetFrozen": {
        const [assetId] = timelineItem.eventData;
        return {
          "Asset ID": <FiledText>{`#${assetId}`}</FiledText>,
        };
      }
      case "AssetThawed": {
        const [assetId] = timelineItem.eventData;
        return {
          "Asset ID": <FiledText>{`#${assetId}`}</FiledText>,
        };
      }
      case "Destoryed": {
        const [assetId] = timelineItem.eventData;
        return {
          "Asset ID": <FiledText>{`#${assetId}`}</FiledText>,
        };
      }
      case "Issued": {
        const [assetId, beneficiary, amount] = timelineItem.eventData;
        return {
          "Asset ID": <FiledText>{`#${assetId}`}</FiledText>,
          Beneficiary: (
            <BreakText>
              <CopyText text={beneficiary}>
                <MonoText>
                  <InLink to={`/${node}/account/${beneficiary}`}>
                    {beneficiary}
                  </InLink>
                </MonoText>
              </CopyText>
            </BreakText>
          ),
          Amount: formatBalance(amount, asset),
        };
      }
      case "Burned": {
        const [assetId, who, amount] = timelineItem.eventData;
        return {
          "Asset ID": <FiledText>{`#${assetId}`}</FiledText>,
          Who: (
            <BreakText>
              <CopyText text={who}>
                <MonoText>
                  <InLink to={`/${node}/account/${who}`}>{who}</InLink>
                </MonoText>
              </CopyText>
            </BreakText>
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
              to={`/${node}/extrinsic/${data.eventIndexer.blockHeight}-${data.extrinsicIndex}`}
            >
              <LinkItem>
                <span>{"Extrinsic"}</span>
                <icons.LinkIcon />
              </LinkItem>
            </InLink>
            <InLink
              to={`/${node}/event/${data.eventIndexer.blockHeight}-${data.eventSort}`}
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
              <FiledTitle>{item[0]}</FiledTitle>
              <FiledBody>{item[1]}</FiledBody>
            </FiledWrapper>
          ))}
        </TimelineFields>
      </ItemWrapper>
    </Wrapper>
  );
}
