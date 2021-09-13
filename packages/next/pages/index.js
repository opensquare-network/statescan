import styled from "styled-components";

import Layout from "components/layout";
import Overview from "components/overview";
import Table from "components/table";
import MinorText from "components/minorText";
import InLink from "components/inLink";
import Symbol from "components/symbol";
import AddressEllipsis from "components/addressEllipsis";
import {
  bigNumber2Locale,
  fromAssetUnit,
  fromSymbolUnit,
  timeDuration,
} from "utils";
import {
  blocksLatestHead,
  transfersLatestHead,
  assetsHead,
} from "utils/constants";
import { getSymbol, useWindowSize } from "utils/hooks";
import { useSelector } from "react-redux";
import { overviewSelector } from "store/reducers/chainSlice";
import { ssrNextApi as nextApi } from "services/nextApi";
import { useEffect, useState } from "react";
import { connect } from "services/websocket";
import HeightAge from "../components/block/heightAge";
import TransferHeightAge from "../components/transfer/heightAge";
import AddressCounts from "../components/block/addressCounts";
import AmountFromTo from "../components/transfer/amountFromTo";
import Name from "../components/account/name";

const Wrapper = styled.section`
  > :not(:first-child) {
    margin-top: 32px;
  }
`;

const TableWrapper = styled.div`
  display: grid;
  column-gap: 24px;
  row-gap: 32px;
  grid-template-columns: repeat(auto-fill, minmax(588px, 1fr));
  @media screen and (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const FootWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export default function Home({ node, overview: ssrOverview, price }) {
  const pushedOverview = useSelector(overviewSelector);
  const symbol = getSymbol(node);
  const [time, setTime] = useState(Date.now());
  useEffect(() => {
    connect();
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const overview = pushedOverview || ssrOverview;

  const size = useWindowSize();
  const collapseSize = 900;

  const pcViewBlockTableData = () =>
    (overview?.latestBlocks || []).map((item) => [
      <HeightAge
        node={node}
        height={item.header.number}
        age={item.blockTime}
        isFinalized={item.isFinalized}
      />,
      <AddressCounts
        node={node}
        validator={item.author}
        extrinsicCount={item.extrinsicsCount}
        eventsCount={item.eventsCount}
      />,
    ]);

  const mobileViewBlockTableData = () =>
    (overview?.latestBlocks || []).map((item) => [
      <InLink to={`/block/${item.header.number}`}>
        {item.header.number.toLocaleString()}
      </InLink>,
      <FlexWrapper>
        <img
          src="/imgs/icons/check-green.svg"
          alt=""
          style={{ marginRight: 8 }}
        />
        <MinorText>{timeDuration(item.blockTime)}</MinorText>
      </FlexWrapper>,
      item.author ? (
        <AddressEllipsis address={item.author} to={`/account/${item.author}`} />
      ) : (
        "Unknown validator"
      ),
      item.extrinsicsCount,
      item.eventsCount,
    ]);

  const pcViewTransferTableData = () =>
    (overview?.latestTransfers || []).map((item) => [
      <TransferHeightAge
        node={node}
        height={`${item.indexer.blockHeight}-${item.extrinsicIndex}`}
        age={item?.indexer?.blockTime}
        isEvent={!item.extrinsicHash}
        blockHeight={item.indexer.blockHeight}
      />,
      <AmountFromTo
        node={node}
        from={item.from}
        to={item.to}
        amount={
          item?.assetSymbol
            ? fromAssetUnit(item.balance, item.assetDecimals)
            : fromSymbolUnit(item.balance, symbol)
        }
        symbol={item.assetSymbol ?? symbol}
      />,
    ]);
  const mobileViewTransferTableData = () =>
    (overview?.latestTransfers || []).map((item) => [
      item.extrinsicHash ? (
        <InLink
          to={`/extrinsic/${item.indexer.blockHeight}-${item.extrinsicIndex}`}
        >
          {`${item.indexer.blockHeight}-${item.extrinsicIndex}`}
        </InLink>
      ) : (
        <InLink to={`/block/${item.indexer.blockHeight}`}>
          {`${item.indexer.blockHeight}`}
        </InLink>
      ),
      <FlexWrapper>
        <img
          src="/imgs/icons/check-green.svg"
          alt=""
          style={{ marginRight: 8 }}
        />
        <MinorText>{timeDuration(item?.indexer?.blockTime)}</MinorText>
      </FlexWrapper>,
      <AddressEllipsis address={item.from} to={`/account/${item.from}`} />,
      <AddressEllipsis address={item.to} to={`/account/${item.to}`} />,
      item?.assetSymbol
        ? `${fromAssetUnit(item.balance, item.assetDecimals)} ${
            item.assetSymbol
          }`
        : `${fromSymbolUnit(item.balance, symbol)} ${symbol}`,
    ]);

  const [blockTableHead, setBlockTableHead] = useState([]);
  const [blockTableData, setBlockTableData] = useState(null);

  const [transferTableHead, setTransferTableHead] = useState([]);
  const [transferTableData, setTransferTableData] = useState(null);

  useEffect(() => {
    if (!size.width) return;
    if (collapseSize > size.width) {
      setBlockTableHead(blocksLatestHead);
      setBlockTableData(mobileViewBlockTableData());
      setTransferTableHead(transfersLatestHead);
      setTransferTableData(mobileViewTransferTableData());
    } else {
      setBlockTableHead([]);
      setBlockTableData(pcViewBlockTableData());
      setTransferTableHead([]);
      setTransferTableData(pcViewTransferTableData());
    }
  }, [size, overview, time]);

  return (
    <Layout node={node}>
      <Wrapper>
        <Overview node={node} overviewData={overview} price={price} />
        <TableWrapper>
          <Table
            title="Latest Blocks"
            head={blockTableHead}
            body={blockTableData}
            collapse={collapseSize}
            foot={
              <FootWrapper>
                <InLink to={`/blocks`}>View all</InLink>
              </FootWrapper>
            }
          />
          <Table
            title="Latest Transfers"
            head={transferTableHead}
            body={transferTableData}
            collapse={collapseSize}
            foot={
              <FootWrapper>
                <InLink to={`/transfers`}>View all</InLink>
              </FootWrapper>
            }
          />
        </TableWrapper>
        <Table
          title="Assets"
          head={assetsHead}
          body={(overview?.popularAssets || []).map((item) => [
            <InLink
              to={
                `/asset/${item.assetId}` +
                (item.destroyedAt ? `_${item.createdAt.blockHeight}` : "")
              }
            >{`#${item.assetId}`}</InLink>,
            <Symbol symbol={item.symbol} />,
            <Name name={item.name} />,
            <AddressEllipsis
              address={item.owner}
              to={`/account/${item.owner}`}
            />,
            <AddressEllipsis
              address={item.issuer}
              to={`/account/${item.issuer}`}
            />,
            item.accounts,
            bigNumber2Locale(fromAssetUnit(item.supply, item.decimals)),
          ])}
          foot={
            <FootWrapper>
              <InLink to={`/assets`}>View all</InLink>
            </FootWrapper>
          }
          collapse={collapseSize}
        />
      </Wrapper>
    </Layout>
  );
}

export async function getServerSideProps() {
  const node = process.env.NEXT_PUBLIC_CHAIN;

  const [
    { result: latestBlocks },
    { result: popularAssets },
    { result: latestTransfers },
    { result: assetsCount },
    { result: transfersCount },
    { result: holdersCount },
    { result: price },
  ] = await Promise.all([
    nextApi.fetch(`blocks/latest`),
    nextApi.fetch(`assets/popular`),
    nextApi.fetch(`transfers/latest`),
    nextApi.fetch(`assets/count`),
    nextApi.fetch(`transfers/count`),
    nextApi.fetch(`holders/count`),
    nextApi.fetch(`${node}/prices/daily`),
  ]);

  return {
    props: {
      node,
      overview: {
        latestBlocks: latestBlocks ?? [],
        latestTransfers: latestTransfers ?? [],
        popularAssets: popularAssets ?? [],
        assetsCount: assetsCount ?? 0,
        transfersCount: transfersCount ?? 0,
        holdersCount: holdersCount ?? 0,
      },
      price: price ?? [],
    },
  };
}
