import Layout from "components/layout";
import Nav from "components/nav";
import { getSymbol } from "utils/hooks";
import {
  assetHead,
  assetTransfersHead,
  assetHoldersHead,
  EmptyQuery,
} from "utils/constants";
import DetailTable from "components/detailTable";
import Section from "components/section";
import MinorText from "components/minorText";
import AddressEllipsis from "components/addressEllipsis";
import { bigNumber2Locale, fromAssetUnit, fromSymbolUnit } from "utils";
import InLink from "components/inLink";
import Address from "components/address";
import TabTable from "components/tabTable";
import Pagination from "components/pagination";
import Tooltip from "components/tooltip";
import Timeline from "components/timeline";
import { ssrNextApi as nextApi } from "services/nextApi";
import PageNotFound from "components/pageNotFound";
import AnalyticsChart from "components/analyticsChart";

export default function Asset({
  node,
  tab,
  asset,
  assetTransfers,
  assetHolders,
  assetAnalytics,
}) {
  if (!asset) {
    return (
      <Layout node={node}>
        <PageNotFound />
      </Layout>
    );
  }

  const assetSymbol = asset?.symbol;

  const symbol = getSymbol(node);

  const tabTableData = [
    {
      name: "Transfers",
      page: assetTransfers?.page,
      total: assetTransfers?.total,
      head: assetTransfersHead,
      body: (assetTransfers?.items || []).map((item) => [
        <InLink to={`/event/${item.indexer.blockHeight}-${item.eventSort}`}>
          {`${item.indexer.blockHeight}-${item.eventSort}`}
        </InLink>,
        <InLink
          to={`/extrinsic/${item.indexer.blockHeight}-${item.extrinsicIndex}`}
        >{`${item.indexer.blockHeight}-${item.extrinsicIndex}`}</InLink>,
        <Tooltip label={item.method} bg />,
        item.indexer.blockTime,
        <AddressEllipsis address={item?.from} to={`/account/${item?.from}`} />,
        <AddressEllipsis address={item?.to} to={`/account/${item?.to}`} />,
        item.assetSymbol
          ? `${bigNumber2Locale(
              fromAssetUnit(item.balance, item.assetDecimals)
            )} ${item.assetSymbol}`
          : `${bigNumber2Locale(
              fromSymbolUnit(item.balance, symbol)
            )} ${symbol}`,
      ]),
      foot: (
        <Pagination
          page={assetTransfers?.page}
          pageSize={assetTransfers?.pageSize}
          total={assetTransfers?.total}
        />
      ),
    },
    {
      name: "Holders",
      page: assetHolders?.page,
      total: assetHolders?.total,
      head: assetHoldersHead,
      body: (assetHolders?.items || []).map((item, index) => [
        index + assetHolders.page * assetHolders.pageSize + 1,
        <Address address={item?.address} to={`/account/${item?.address}`} />,
        bigNumber2Locale(fromAssetUnit(item?.balance?.$numberDecimal, item?.assetDecimals)),
      ]),
      foot: (
        <Pagination
          page={assetHolders?.page}
          pageSize={assetHolders?.pageSize}
          total={assetHolders?.total}
        />
      ),
    },
    {
      name: "Timeline",
      total: asset?.timeline?.length,
      component: <Timeline data={asset?.timeline} node={node} asset={asset} />,
    },
    {
      name: "Analytics",
      component: (
        <AnalyticsChart
          data={assetAnalytics}
          symbol={asset.symbol}
          name={asset.name}
          decimals={asset.decimals}
        />
      ),
    },
  ];

  return (
    <Layout node={node}>
      <Section>
        <div>
          <Nav
            data={[
              { name: "Asset Tracker", path: `/assets` },
              { name: assetSymbol },
            ]}
            node={node}
          />
          <DetailTable
            head={assetHead}
            body={[
              <MinorText>{asset?.symbol}</MinorText>,
              <MinorText>{asset?.name}</MinorText>,
              <MinorText>{`#${asset?.assetId}`}</MinorText>,
              <Address
                address={asset?.owner}
                to={`/account/${asset?.owner}`}
              />,
              <Address
                address={asset?.issuer}
                to={`/account/${asset?.issuer}`}
              />,
              `${bigNumber2Locale(
                fromAssetUnit(asset?.supply, asset?.decimals)
              )} ${asset?.symbol}`,
              asset?.decimals,
              <MinorText>{assetHolders?.total}</MinorText>,
              <MinorText>{assetTransfers?.total}</MinorText>,
            ]}
          />
        </div>
        <TabTable data={tabTableData} activeTab={tab} collapse={900} />
      </Section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const node = process.env.NEXT_PUBLIC_CHAIN;
  const { id } = context.params;
  const { tab, page } = context.query;

  const { result: asset } = await nextApi.fetch(`assets/${id}`);

  if (!asset) return { props: { node } };

  const assetKey = `${asset.assetId}_${asset.createdAt.blockHeight}`;

  const nPage = parseInt(page) || 1;
  const activeTab = tab ?? "transfers";

  const [
    { result: assetTransfers },
    { result: assetHolders },
    { result: assetAnalytics },
  ] = await Promise.all([
    nextApi.fetch(`assets/${assetKey}/transfers`, {
      page: activeTab === "transfers" ? nPage - 1 : 0,
    }),
    nextApi.fetch(`assets/${assetKey}/holders`, {
      page: activeTab === "holders" ? nPage - 1 : 0,
    }),
    nextApi.fetch(`assets/${assetKey}/statistic`),
  ]);

  return {
    props: {
      node,
      id,
      tab: activeTab,
      asset: asset ?? null,
      assetTransfers: assetTransfers ?? EmptyQuery,
      assetHolders: assetHolders ?? EmptyQuery,
      assetAnalytics: assetAnalytics ?? EmptyQuery,
    },
  };
}
