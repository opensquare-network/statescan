import styled from "styled-components";
import { useCallback, useEffect, useRef, useState } from "react";

import Layout from "components/layout";
import Overview from "components/overview";
import Table from "components/table";
import MinorText from "components/minorText";
import InLink from "components/inLink";
import AddressEllipsis from "components/addressEllipsis";
import { fromAssetUnit, fromSymbolUnit, time, timeDuration } from "utils";
import { blocksLatestHead, transfersLatestHead } from "utils/constants";
import { getSymbol, useOnClickOutside, useWindowSize } from "utils/hooks";
import { useSelector } from "react-redux";
import { overviewSelector } from "store/reducers/chainSlice";
import { ssrNextApi as nextApi } from "services/nextApi";
import { connect } from "services/websocket";
import HeightAge from "../components/block/heightAge";
import TransferHeightAge from "../components/transfer/heightAge";
import AddressCounts from "../components/block/addressCounts";
import AmountFromTo from "../components/transfer/amountFromTo";
import { text_dark_minor } from "styles/textStyles";
import Preview from "components/nft/preview";

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
  table {
    table-layout: auto;
  }
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

const TextDarkMinor = styled.span`
  ${text_dark_minor};
`;

export default function Home({ node, overview: ssrOverview, price }) {
  const pushedOverview = useSelector(overviewSelector);
  const symbol = getSymbol(node);
  const [currentTime, setTime] = useState(Date.now());
  const [previewNftClass, setPreviewNftClass] = useState(null);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    connect();
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const ref = useRef();

  useOnClickOutside(ref, (event) => {
    // exclude manually
    if (document?.querySelector(".modal")?.contains(event.target)) {
      return;
    }
    setShowModal(false);
  });

  const overview = pushedOverview || ssrOverview;

  const size = useWindowSize();
  const collapseSize = 900;

  const pcViewBlockTableData = useCallback(
    () =>
      (overview?.latestBlocks || []).map((item, index) => [
        <HeightAge
          key={`${index}-1`}
          node={node}
          height={item.header.number}
          age={item.blockTime}
          isFinalized={item.isFinalized}
        />,
        <AddressCounts
          key={`${index}-2`}
          node={node}
          validator={item.author}
          extrinsicCount={item.extrinsicsCount}
          eventsCount={item.eventsCount}
        />,
      ]),
    [node, overview?.latestBlocks]
  );

  const mobileViewBlockTableData = useCallback(
    () =>
      (overview?.latestBlocks || []).map((item, index) => [
        <InLink key={`${index}-1`} to={`/block/${item.header.number}`}>
          {item.header.number.toLocaleString()}
        </InLink>,
        <FlexWrapper key={`${index}-2`}>
          <img
            src="/imgs/icons/check-green.svg"
            alt=""
            style={{ marginRight: 8 }}
          />
          <MinorText>{timeDuration(item.blockTime)}</MinorText>
        </FlexWrapper>,
        item.author ? (
          <AddressEllipsis
            address={item.author}
            to={`/account/${item.author}`}
          />
        ) : (
          "Unknown validator"
        ),
        item.extrinsicsCount,
        item.eventsCount,
      ]),
    [overview?.latestBlocks]
  );

  const pcViewTransferTableData = useCallback(
    () =>
      (overview?.latestTransfers || []).map((item, index) => [
        <TransferHeightAge
          key={`${index}-1`}
          node={node}
          extrinsicIndex={item.indexer.extrinsicIndex}
          age={item.indexer.blockTime}
          isEvent={!item.extrinsicHash}
          blockHeight={item.indexer.blockHeight}
        />,
        <AmountFromTo
          key={`${index}-2`}
          node={node}
          from={item.from}
          to={item.to}
          amount={
            item?.assetSymbol
              ? fromAssetUnit(item.balance.$numberDecimal, item.assetDecimals)
              : fromSymbolUnit(item.balance.$numberDecimal, symbol)
          }
          symbol={item.assetSymbol ?? symbol}
          assetId={item.assetId}
        />,
      ]),
    [node, overview?.latestTransfers, symbol]
  );
  const mobileViewTransferTableData = useCallback(
    () =>
      (overview?.latestTransfers || []).map((item, index) => [
        item.extrinsicHash ? (
          <InLink
            to={`/extrinsic/${item.indexer.blockHeight}-${item.indexer.extrinsicIndex}`}
          >
            {`${item.indexer.blockHeight.toLocaleString()}-${
              item.indexer.extrinsicIndex
            }`}
          </InLink>
        ) : (
          <InLink to={`/block/${item.indexer.blockHeight}`}>
            {`${item.indexer.blockHeight.toLocaleString()}`}
          </InLink>
        ),
        <FlexWrapper key={`${index}-1`}>
          <img
            src="/imgs/icons/check-green.svg"
            alt=""
            style={{ marginRight: 8 }}
          />
          <MinorText>{timeDuration(item?.indexer?.blockTime)}</MinorText>
        </FlexWrapper>,
        <AddressEllipsis
          key={`${index}-2`}
          address={item.from}
          to={`/account/${item.from}`}
        />,
        <AddressEllipsis
          key={`${index}-3`}
          address={item.to}
          to={`/account/${item.to}`}
        />,
        item?.assetSymbol
          ? `${fromAssetUnit(
              item.balance.$numberDecimal,
              item.assetDecimals
            )} ${item.assetSymbol}`
          : `${fromSymbolUnit(item.balance.$numberDecimal, symbol)} ${symbol}`,
      ]),
    [overview?.latestTransfers, symbol]
  );

  const [blockTableHead, setBlockTableHead] = useState([]);
  const [blockTableData, setBlockTableData] = useState(null);

  const [transferTableHead, setTransferTableHead] = useState([]);
  const [transferTableData, setTransferTableData] = useState(null);

  useEffect(() => {
    if (!size.width || !time) return;
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
  }, [
    size,
    overview,
    mobileViewBlockTableData,
    mobileViewTransferTableData,
    pcViewBlockTableData,
    pcViewTransferTableData,
  ]);

  return (
    <Layout node={node}>
      <div ref={ref}>
        <Preview
          open={showModal}
          nftClass={previewNftClass}
          closeFn={() => {
            setShowModal(false);
          }}
        />
      </div>
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
            title="Signed Transfers"
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
      </Wrapper>
    </Layout>
  );
}

export async function getServerSideProps() {
  const node = process.env.NEXT_PUBLIC_CHAIN;

  const [{ result: overview }, { result: price }] = await Promise.all([
    nextApi.fetch(`overview`),
    nextApi.fetch(`${node}/prices/daily`),
  ]);

  return {
    props: {
      node,
      overview: overview || null,
      price: price ?? [],
    },
  };
}
