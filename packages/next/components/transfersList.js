import { useState } from "react";
import styled from "styled-components";
import MinorText from "components/minorText";
import MajorText from "components/majorText";
import AddressEllipsis from "components/addressEllipsis";
import { getSymbol, useTheme } from "utils/hooks";
import { bigNumber2Locale, fromAssetUnit, fromSymbolUnit } from "utils";
import InLink from "components/inLink";

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

export default function TransfersList({ node, assetTransfers }) {
  const [showAll, setShowAll] = useState(false);
  const theme = useTheme();
  const symbol = getSymbol(node);

  return (
    <Wrapper>
      {((showAll ? assetTransfers : assetTransfers.slice(0, 6)) || []).map(
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
                    fromAssetUnit(item.balance, item.assetDecimals)
                  )}`
                : `${bigNumber2Locale(fromSymbolUnit(item.balance, symbol))}`}
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
      {assetTransfers?.length > 6 && (
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
            <MajorText>{assetTransfers.length}</MajorText>
            <MinorText>Transfers in total</MinorText>
          </Footer>
        </>
      )}
    </Wrapper>
  );
}
