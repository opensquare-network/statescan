import styled, { css } from "styled-components";

import Symbol from "components/symbol";
import { card_border } from "styles/textStyles";
import Thumbnail from "../nft/thumbnail";
import Address from "../address";
import { encodeAddressToChain } from "../../utils";

const Wrapper = styled.div`
  width: 100%;
  position: absolute;
  margin-top: 4px;
  padding-top: 8px;
  padding-bottom: 8px;
  max-height: 292px;
  background: #ffffff;
  ${card_border};
  z-index: 99;
  overflow-y: auto;
`;

const Title = styled.div`
  padding: 8px 16px;
  font-weight: bold;
  font-size: 12px;
  line-height: 16px;
  color: rgba(17, 17, 17, 0.35);
`;

const BlockItem = styled.div`
  min-height: 48px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  cursor: pointer;

  :hover {
    background-color: #fafafa;
  }

  ${(p) =>
    p.selected &&
    css`
      background-color: #fafafa;
    `}
`;

const AddressItem = styled(BlockItem)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;

  :hover {
    div > a {
      background-color: #fafafa;
    }
  }
  span > div {
    display: flex;
  }

  div > a {
    max-width: 414px;
    pointer-events: none;
    font-size: 15px;
    color: #111111;
    line-height: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const BlockWrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;

  > img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
`;

const AssetItem = styled.div`
  min-height: 48px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  cursor: pointer;

  :hover {
    background-color: #fafafa;
  }

  ${(p) =>
    p.selected &&
    css`
      background-color: #fafafa;
    `}
`;

const AssetWrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  flex-basis: 112px;

  > img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
`;

const AssetName = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: rgba(17, 17, 17, 0.35);
`;

const IndexWrapper = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: rgba(17, 17, 17, 0.65);
  margin-left: auto;
`;

const Divider = styled.div`
  height: 4px;
`;

export default function SearchHints({ hints, focus, selectedHint, toPage }) {
  if (!focus) return null;
  if (
    !hints ||
    (hints.addresses?.length === 0 &&
      hints.assets?.length === 0 &&
      hints.blocks?.length === 0 &&
      hints.nftClasses.length === 0 &&
      hints.nftInstances.length === 0)
  )
    return null;

  return (
    <Wrapper>
      {hints.addresses?.length > 0 && (
        <>
          <Title>Address</Title>
          {hints.addresses.map((item, index) => (
            <AddressItem
              key={index}
              selected={selectedHint?._id === item._id}
              onClick={() => toPage({ type: "addresses", ...item })}
            >
              <img src="/imgs/icons/account.svg" alt="" />
              <Address
                address={encodeAddressToChain(item?.address)}
                to={`/account/${item?.address}`}
              />
            </AddressItem>
          ))}
        </>
      )}
      {hints.blocks?.length > 0 && (
        <>
          <Title>BLOCKS</Title>
          {hints.blocks.map((item, index) => (
            <BlockItem
              selected={selectedHint?._id === item._id}
              key={index}
              onClick={() => toPage({ type: "blocks", ...item })}
            >
              <BlockWrapper>
                <img src="/imgs/icons/latest-blocks.svg" alt="" />
                <div>Block</div>
              </BlockWrapper>
              <IndexWrapper>{`#${item.header?.number}`}</IndexWrapper>
            </BlockItem>
          ))}
        </>
      )}
      {hints.blocks?.length > 0 && hints.assets?.length > 0 && <Divider />}
      {hints.assets?.length > 0 && (
        <>
          <Title>ASSETS</Title>
          {hints.assets.map((item, index) => (
            <AssetItem
              key={index}
              selected={selectedHint?._id === item._id}
              onClick={() => toPage({ type: "assets", ...item })}
            >
              <AssetWrapper>
                <Symbol assetId={item.assetId} />
                <div>{item.symbol}</div>
              </AssetWrapper>
              <AssetName>{item.name}</AssetName>
              <IndexWrapper>{`#${item.assetId}`}</IndexWrapper>
            </AssetItem>
          ))}
        </>
      )}
      {hints.nftClasses?.length > 0 && (
        <>
          <Title>NFT CLASS</Title>
          {hints.nftClasses.map((item, index) => (
            <AssetItem
              key={index}
              selected={selectedHint?._id === item._id}
              onClick={() => toPage({ type: "nftClasses", ...item })}
            >
              <BlockWrapper>
                <Thumbnail
                  imageThumbnail={item?.nftMetadata?.imageThumbnail}
                  size={24}
                />
                <div style={{ marginLeft: 8, fontWeight: 400 }}>
                  {item?.nftMetadata?.name ?? `[Unrecognized]`}
                </div>
              </BlockWrapper>
              <IndexWrapper>{`#${item.classId}`}</IndexWrapper>
            </AssetItem>
          ))}
        </>
      )}
      {hints.nftInstances?.length > 0 && (
        <>
          <Title>NFT Instance</Title>
          {hints.nftInstances.map((item, index) => (
            <AssetItem
              key={index}
              selected={selectedHint?._id === item._id}
              onClick={() => toPage({ type: "nftInstances", ...item })}
            >
              <BlockWrapper>
                <Thumbnail
                  imageThumbnail={item?.nftMetadata?.imageThumbnail}
                  size={24}
                />
                <div style={{ marginLeft: 8, fontWeight: 400 }}>
                  {item?.nftMetadata?.name ?? `[Unrecognized]`}
                </div>
              </BlockWrapper>
              <IndexWrapper>{`#${item.instanceId}`}</IndexWrapper>
            </AssetItem>
          ))}
        </>
      )}
    </Wrapper>
  );
}
