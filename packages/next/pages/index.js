import styled from "styled-components";
import { useCallback, useRef } from "react";

import Layout from "components/layout";
import Overview from "components/overview";
import Table from "components/table";
import MinorText from "components/minorText";
import InLink from "components/inLink";
import Symbol from "components/symbol";
import AddressEllipsis from "components/addressEllipsis";
import {
  abbreviateBigNumber,
  bigNumber2Locale,
  fromAssetUnit,
  fromSymbolUnit,
  time,
  timeDuration,
  getNftStatus,
} from "utils";
import {
  blocksLatestHead,
  transfersLatestHead,
  assetsHead,
  nftsHead,
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
import Tooltip from "../components/tooltip";
import NftLink from "components/nft/nftLink";
import Thumbnail from "components/nft/thumbnail";
import NftName from "components/nft/name";
import { text_dark_minor } from "styles/textStyles";
import Status from "components/status";
import Preview from "components/nft/preview";
import { useOnClickOutside } from "utils/hooks";
import AssetPrice from "components/assetPrice";

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
  const [previewNFTClass, setPreviewNFTCLass] = useState(null);
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
          extrinsicIndex={item.extrinsicIndex}
          age={item?.indexer?.blockTime}
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
              ? fromAssetUnit(item.balance, item.assetDecimals)
              : fromSymbolUnit(item.balance, symbol)
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
            to={`/extrinsic/${item.indexer.blockHeight}-${item.extrinsicIndex}`}
          >
            {`${item.indexer.blockHeight.toLocaleString()}-${
              item.extrinsicIndex
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
          ? `${fromAssetUnit(item.balance, item.assetDecimals)} ${
              item.assetSymbol
            }`
          : `${fromSymbolUnit(item.balance, symbol)} ${symbol}`,
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
          nftClass={previewNFTClass}
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
        <Table
          title="Assets"
          head={assetsHead}
          body={(overview?.popularAssets || []).map((item, index) => [
            <InLink
              key={`${index}-1`}
              to={
                `/asset/${item.assetId}` +
                (item.destroyedAt ? `_${item.createdAt.blockHeight}` : "")
              }
            >{`#${item.assetId}`}</InLink>,
            <Symbol
              key={`${index}-2`}
              symbol={item.symbol}
              assetId={item.assetId}
            />,
            <Name key={`${index}-3`} name={item.name} />,
            <AddressEllipsis
              key={`${index}-4`}
              address={item.owner}
              to={`/account/${item.owner}`}
            />,
            <AddressEllipsis
              key={`${index}-5`}
              address={item.issuer}
              to={`/account/${item.issuer}`}
            />,
            <AssetPrice price={item.price?.value} key={`${index}-6`} />,
            item.accounts,
            <Tooltip
              key={`${index}-7`}
              content={bigNumber2Locale(
                fromAssetUnit(item.supply, item.decimals)
              )}
              isCopy
              noMinWidth={true}
              title="Total Supply"
            >
              {abbreviateBigNumber(fromAssetUnit(item.supply, item.decimals))}
            </Tooltip>,
          ])}
          foot={
            <FootWrapper>
              <InLink to={`/assets`}>View all</InLink>
            </FootWrapper>
          }
          collapse={collapseSize}
        />
        <Table
          title="NFT"
          head={nftsHead}
          body={(overview?.popularNftClasses || []).map((nftClass, index) => [
            <NftLink key={`id${index}`} nftClass={nftClass}>
              {nftClass.classId}
            </NftLink>,
            <Thumbnail
              key={`thumbnail${index}`}
              imageThumbnail={nftClass?.nftMetadata?.imageThumbnail}
              background={nftClass?.nftMetadata?.imageMetadata?.background}
              onClick={() => {
                setPreviewNFTCLass(nftClass);
                setShowModal(true);
              }}
            />,
            <NftLink key={`name${index}`} nftClass={nftClass}>
              <NftName name={nftClass?.nftMetadata?.name} />
            </NftLink>,
            <TextDarkMinor key={`time-${index}`}>
              {time(nftClass?.indexer?.blockTime)}
            </TextDarkMinor>,
            <AddressEllipsis
              key={`owner-${index}`}
              address={nftClass.details?.owner}
              to={`/account/${nftClass.details?.owner}`}
            />,
            <TextDarkMinor key={`instance-${index}`}>
              {nftClass.details?.instances}
            </TextDarkMinor>,
            <Status key={`status-${index}`} status={getNftStatus(nftClass)} />,
          ])}
          foot={
            <FootWrapper>
              <InLink to={`/nft`}>View all</InLink>
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
    { result: popularNftClasses },
  ] = await Promise.all([
    nextApi.fetch(`blocks/latest`),
    nextApi.fetch(`assets/popular`),
    nextApi.fetch(`transfers/latest`),
    nextApi.fetch(`assets/count`),
    nextApi.fetch(`transfers/count`),
    nextApi.fetch(`holders/count`),
    nextApi.fetch(`${node}/prices/daily`),
    nextApi.fetch(`nft/classes/popular`),
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
        popularNftClasses: popularNftClasses ?? [],
      },
      price: price ?? [],
    },
  };
}
