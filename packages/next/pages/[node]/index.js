import styled from "styled-components";
import { useRouter } from "next/router";

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
import { useSymbol } from "utils/hooks";
import PageNotFound from "components/pageNotFound";
import { useSelector } from "react-redux";
import { overviewSelector } from "store/reducers/chainSlice";
import nextApi from "services/nextApi";
import { useEffect } from "react";
import { connect } from "services/websocket";

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

export default function Home({ node, overview: ssrOverview }) {
  const router = useRouter();
  const pushedOverview = useSelector(overviewSelector);
  const symbol = useSymbol();

  useEffect(() => {
    connect(node);
  }, []);

  const overview = pushedOverview || ssrOverview;

  if ("/404" === router.asPath) {
    return (
      <Layout>
        <PageNotFound />
      </Layout>
    );
  }

  return (
    <Layout>
      <Wrapper>
        <Overview node={node} overviewData={overview} />
        <TableWrapper>
          <Table
            title="Latest Blocks"
            head={blocksLatestHead}
            body={(overview?.latestBlocks || []).map((item) => [
              <InLink to={`/${node}/block/${item.header.number}`}>
                {item.header.number.toLocaleString()}
              </InLink>,
              <MinorText>{timeDuration(item.blockTime)}</MinorText>,
              item.extrinsicsCount,
              item.eventsCount,
            ])}
            collapse={900}
          />
          <Table
            title="Latest Transfers"
            head={transfersLatestHead}
            body={(overview?.latestTransfers || []).map((item) => [
              <InLink
                to={`/${node}/extrinsic/${item.indexer.blockHeight}-${item.extrinsicIndex}`}
              >
                {`${item.indexer.blockHeight}-${item.extrinsicIndex}`}
              </InLink>,
              <InLink to={`/${node}/address/${item.from}`}>
                <AddressEllipsis address={item.from} />
              </InLink>,
              <InLink to={`/${node}/address/${item.to}`}>
                <AddressEllipsis address={item.to} />
              </InLink>,
              item?.assetSymbol
                ? `${fromAssetUnit(item.balance, item.assetDecimals)} ${
                    item.assetSymbol
                  }`
                : `${fromSymbolUnit(item.balance, symbol)} ${symbol}`,
            ])}
            collapse={900}
          />
        </TableWrapper>
        <Table
          title="Assets"
          head={assetsHead}
          body={(overview?.popularAssets || []).map((item) => [
            <InLink
              to={`/${node}/asset/${item.assetId}_${item.createdAt.blockHeight}`}
            >{`#${item.assetId}`}</InLink>,
            <Symbol symbol={item.symbol} />,
            item.name,
            <InLink to={`/${node}/address/${item.owner}`}>
              <AddressEllipsis address={item.owner} />
            </InLink>,
            <InLink to={`/${node}/address/${item.issuer}`}>
              <AddressEllipsis address={item.issuer} />
            </InLink>,
            item.accounts,
            bigNumber2Locale(fromAssetUnit(item.supply, item.decimals)),
          ])}
          foot={
            <FootWrapper>
              <InLink to={`/${node}/assets`}>View all</InLink>
            </FootWrapper>
          }
          collapse={900}
        />
      </Wrapper>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { node } = context.params;

  const [
    { result: latestBlocks },
    { result: popularAssets },
    { result: latestTransfers },
    { result: assetsCount },
    { result: transfersCount },
    { result: holdersCount },
  ] = await Promise.all([
    nextApi.fetch(`${node}/blocks/latest`),
    nextApi.fetch(`${node}/assets/popular`),
    nextApi.fetch(`${node}/transfers/latest`),
    nextApi.fetch(`${node}/assets/count`),
    nextApi.fetch(`${node}/transfers/count`),
    nextApi.fetch(`${node}/holders/count`),
  ]);

  return {
    props: {
      node,
      overview: {
        latestBlocks,
        latestTransfers,
        popularAssets,
        assetsCount,
        transfersCount,
        holdersCount,
      },
    },
  };
}
