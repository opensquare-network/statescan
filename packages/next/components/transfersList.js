import { useRef, useState } from "react";
import styled from "styled-components";
import MinorText from "components/minorText";
import MajorText from "components/majorText";
import AddressEllipsis from "components/addressEllipsis";
import { getSymbol, useOnClickOutside, useTheme } from "utils/hooks";
import { bigNumber2Locale, fromAssetUnit, fromSymbolUnit } from "utils";
import InLink from "components/inLink";
import Thumbnail from "components/nft/thumbnail";
import Preview from "components/nft/preview";
import NftName from "./nft/name";
import NftLink from "./nft/nftLink";

const Wrapper = styled.div`
  padding: 8px 0;
`;

const TransferItem = styled.div`
  display: flex;
  flex-wrap: wrap;
  line-height: 20px;
  :not(:first-child) {
    margin-top: 4px;
  }

  & > :nth-child(1) {
    margin-right: 8px;
  }
  & > :nth-child(2) {
    margin-right: 32px;
  }
  & > :nth-child(3) {
    margin-right: 8px;
  }
  & > :nth-child(4) {
    margin-right: 32px;
  }
  & > :nth-child(5) {
    margin-right: 8px;
  }
  & > :nth-child(6) {
    margin-right: 4px;
  }
`;

const NftTransferItem = styled.div`
  display: flex;
  flex-wrap: wrap;
  line-height: 20px;
  :not(:first-child) {
    margin-top: 4px;
  }

  & > :nth-child(1) {
    margin-right: 8px;
  }
  & > :nth-child(2) {
    margin-right: 32px;
  }
  & > :nth-child(3) {
    margin-right: 8px;
  }
  & > :nth-child(4) {
    margin-right: 32px;
  }
  & > :nth-child(5) {
    margin-right: 8px;
  }
  & > :nth-child(6) {
    margin-right: 8px;
  }
`;

const Divider = styled.div`
  width: 96px;
  height: 1px;
  background-color: #eeeeee;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const Footer = styled.div`
  display: flex;
  & > :nth-child(1) {
    margin-right: 16px;
  }
  & > :nth-child(2) {
    margin-right: 4px;
  }
`;

const Button = styled.div`
  font-style: normal;
  font-weight: bold;
  color: ${(p) => p.themecolor};
  cursor: pointer;
`;

export default function TransfersList({ node, assetTransfers, nftTransfers }) {
  const [showAll, setShowAll] = useState(false);
  const theme = useTheme();
  const symbol = getSymbol(node);
  const [showModal, setShowModal] = useState(false);
  const [previewNftInstance, setPreviewNftInstance] = useState(null);
  const ref = useRef();

  useOnClickOutside(ref, (event) => {
    // exclude manually
    if (document?.querySelector(".modal")?.contains(event.target)) {
      return;
    }
    setShowModal(false);
  });

  const transfersCount = (assetTransfers?.length || 0) + (nftTransfers?.length || 0);
  let showAssetTransfers = [];
  let showNftTransfers = [];
  if (showAll) {
    showAssetTransfers = assetTransfers;
    showNftTransfers = nftTransfers;
  } else {
    const maxCount = 6;
    showNftTransfers = nftTransfers?.slice(0, 6);
    showAssetTransfers = assetTransfers?.slice(0, maxCount - showNftTransfers.length);
  }

  return (
    <Wrapper>
      <div ref={ref}>
        <Preview
          open={showModal}
          nftClass={previewNftInstance?.nftClass}
          nftInstance={previewNftInstance}
          closeFn={()=>{setShowModal(false)}}
        />
      </div>

      {showNftTransfers.map(
        (item, index) => {
          const instance = item.nftInstance;
          const name = (instance.nftMetadata ?? instance.nftClass.nftMetadata)?.name;
          const imageThumbnail = (instance?.nftMetadata?.recognized === false) ? null : (instance.nftMetadata?.image
            ? instance.nftMetadata.imageThumbnail
            : instance.nftClass.nftMetadata?.imageThumbnail);
          const background = instance.nftMetadata?.image
            ? instance.nftMetadata.imageMetadata?.background
            : instance.nftClass.nftMetadata?.imageMetadata?.background;

          return (
            <NftTransferItem key={index}>
              <MinorText>From</MinorText>
              <AddressEllipsis
                address={item.from}
                to={`/account/${item?.from}`}
              />
              <MinorText>To</MinorText>
              <AddressEllipsis address={item.to} to={`/account/${item?.to}`} />
              <MinorText>For</MinorText>
              <Thumbnail
                size={20}
                imageThumbnail={imageThumbnail}
                onClick={() => {
                  setPreviewNftInstance(instance);
                  setShowModal(true);
                }}
                background={background}
              />
              <NftLink
                nftClass={instance.nftClass}
                nftInstance={instance}
              >
                <NftName name={name} />
              </NftLink>
            </NftTransferItem>
          );
        }
      )}
      {showAssetTransfers.map(
        (item, index) => (
          <TransferItem key={index}>
            <MinorText>From</MinorText>
            <AddressEllipsis
              address={item.from}
              to={`/account/${item?.from}`}
            />
            <MinorText>To</MinorText>
            <AddressEllipsis address={item.to} to={`/account/${item?.to}`} />
            <MinorText>For</MinorText>
            <MajorText>
              {item.assetSymbol
                ? `${bigNumber2Locale(
                    fromAssetUnit(item.balance.$numberDecimal, item.assetDecimals)
                  )}`
                : `${bigNumber2Locale(fromSymbolUnit(item.balance.$numberDecimal, symbol))}`}
            </MajorText>
            {item.assetSymbol ? (
              <InLink
                to={
                  `/asset/${item.assetId}` +
                  (item.destroyedAt ? `_${item.createdAt.blockHeight}` : "")
                }
              >
                {item.assetSymbol}
              </InLink>
            ) : (
              <MinorText>{symbol}</MinorText>
            )}
          </TransferItem>
        )
      )}
      {transfersCount > 6 && (
        <>
          <Divider />
          <Footer>
            <Button
              themecolor={theme.color}
              onClick={() => {
                setShowAll(!showAll);
              }}
            >
              {showAll ? "Hide" : "Show"}
            </Button>
            <MajorText>{transfersCount}</MajorText>
            <MinorText>Transfers in total</MinorText>
          </Footer>
        </>
      )}
    </Wrapper>
  );
}
