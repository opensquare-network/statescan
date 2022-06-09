import Layout from "components/layout";
import Nav from "components/nav";
import {
  assetTransfersHead,
  assetHoldersHead,
  EmptyQuery,
  assetHead,
} from "utils/constants";
import DetailTable from "components/detailTable";
import Section from "components/section";
import MinorText from "components/minorText";
import AddressEllipsis from "components/addressEllipsis";
import { bigNumber2Locale, fromAssetUnit } from "utils";
import InLink from "components/inLink";
import Address from "components/address";
import TabTable from "components/tabTable";
import Pagination from "components/pagination";
import Tooltip from "components/tooltip";
import AssetTimeline from "../../components/timeline/assetTimeline";
import { ssrNextApi as nextApi } from "services/nextApi";
import PageError from "components/pageError";
import AnalyticsChart from "components/analyticsChart";
import { getAssetInfo } from "utils/assetInfoData";
import AssetInfo from "components/assetInfo";
import Status from "../../components/status";
import CopyText from "../../components/copyText";
import AssetPrice from "components/assetPrice";
import { assetGovernances } from "utils/constants";
import { NextSeo } from "next-seo";

export default function Asset({
  node,
  tab,
  asset,
  assetTimeline,
  assetTransfers,
  assetHolders,
  assetAnalytics,
}) {
  if (!asset) {
    return (
      <Layout node={node}>
        <PageError resource="Asset" />
      </Layout>
    );
  }

  const assetSymbol = asset.symbol;

  const tabTableData = [
    {
      name: "Transfers",
      page: assetTransfers?.page,
      total: assetTransfers?.total,
      head: assetTransfersHead,
      body: (assetTransfers?.items || []).map((item, index) => [
        <InLink
          key={`${index}-1`}
          to={`/event/${item.indexer.blockHeight}-${item.indexer.eventIndex}`}
        >
          {`${item.indexer.blockHeight}-${item.indexer.eventIndex}`}
        </InLink>,
        <InLink
          key={`${index}-2`}
          to={`/extrinsic/${item.indexer.blockHeight}-${item.indexer.extrinsicIndex}`}
        >{`${item.indexer.blockHeight}-${item.indexer.extrinsicIndex}`}</InLink>,
        <Tooltip key={`${index}-3`} label={item.method} bg />,
        item.indexer.blockTime,
        <AddressEllipsis
          key={`${index}-4`}
          address={item.from}
          to={`/account/${item.from}`}
        />,
        <AddressEllipsis
          key={`${index}-5`}
          address={item.to}
          to={`/account/${item.to}`}
        />,
        `${bigNumber2Locale(
          fromAssetUnit(item.balance.$numberDecimal, asset.decimals)
        )} ${assetSymbol}`,
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
        <Address
          key={index}
          address={item.address}
          to={`/account/${item.address}`}
        />,
        bigNumber2Locale(
          fromAssetUnit(item.balance.$numberDecimal, asset.decimals)
        ),
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
      page: assetTimeline?.page,
      total: assetTimeline?.total,
      component: (
        <AssetTimeline data={assetTimeline?.items} node={node} asset={asset} />
      ),
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

  const assetInfoData = getAssetInfo(node, asset?.assetId);

  let status = "Active";
  if (asset.isFrozen) {
    status = "Frozen";
  }
  if (asset.destroyedAt) {
    status = "Destroyed";
  }

  const seoTitle = asset?.name || "Statescan";
  const seoDescription =
    assetInfoData?.about || "Kusama & Polkadot Asset Explorer";
  const seoImages = [
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}${
        assetInfoData?.icon ?? "imgs/icons/default.svg"
      }`,
      width: 1200,
      height: 628,
    },
  ];

  return (
    <Layout node={node}>
      <NextSeo
        title={seoTitle}
        description={seoDescription}
        openGraph={{
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/asset/${asset?.assetId}`,
          title: seoTitle,
          description: seoDescription,
          images: seoImages,
          site_name: "Statescan",
        }}
        twitter={{
          handle: "@handle",
          site: "@site",
          cardType: "summary_large_image",
        }}
      />
      <Section>
        <div>
          <Nav
            data={[
              {
                name: asset.destroyedAt ? "Destroyed Assets" : "Asset Tracker",
                path: asset.destroyedAt ? `/destroyed/assets` : `/assets`,
              },
              { name: assetSymbol },
            ]}
            node={node}
          />
          <DetailTable
            head={assetHead}
            body={[
              <MinorText key="1">{asset?.symbol}</MinorText>,
              <MinorText key="2">{asset?.name}</MinorText>,
              <MinorText key="3">{`#${asset?.assetId}`}</MinorText>,
              <CopyText key="4" text={asset?.owner}>
                <Address
                  address={asset?.owner}
                  to={`/account/${asset?.owner}`}
                />
              </CopyText>,
              <CopyText key="5" text={asset?.issuer}>
                <Address
                  address={asset?.issuer}
                  to={`/account/${asset?.issuer}`}
                />
              </CopyText>,
              <AssetPrice price={asset?.price?.value} key="6" />,
              <CopyText key="7" text={asset?.admin}>
                <Address
                  address={asset?.admin}
                  to={`/account/${asset?.admin}`}
                />
              </CopyText>,
              <CopyText key="8" text={asset?.freezer}>
                <Address
                  address={asset?.freezer}
                  to={`/account/${asset?.freezer}`}
                />
              </CopyText>,
              `${bigNumber2Locale(
                fromAssetUnit(asset?.supply, asset?.decimals)
              )} ${asset?.symbol}`,
              asset?.decimals,
              status === "Active" ? undefined : (
                <Status key="9" status={status} />
              ),
              <MinorText key="10">{assetHolders?.total}</MinorText>,
              <MinorText key="11">{assetTransfers?.total}</MinorText>,
            ]}
            info={
              <AssetInfo
                governances={assetGovernances[asset?.assetId]}
                data={assetInfoData}
                symbol={asset.symbol}
                name={asset.name}
              />
            }
          />
        </div>
        <TabTable
          data={tabTableData}
          activeTab={tab}
          collapse={900}
          query={["id"]}
        />
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

  const activeTab = tab ?? "transfers";

  let nPage;
  if (activeTab === "timeline") {
    nPage = parseInt(page) - 1 || "last";
  } else {
    nPage = (parseInt(page) || 1) - 1;
  }

  const [
    { result: assetTimeline },
    { result: assetTransfers },
    { result: assetHolders },
    { result: assetAnalytics },
  ] = await Promise.all([
    nextApi.fetch(`assets/${assetKey}/timeline`, {
      page: activeTab === "timeline" ? nPage : 0,
      pageSize: 3,
    }),
    nextApi.fetch(`assets/${assetKey}/transfers`, {
      page: activeTab === "transfers" ? nPage : 0,
      pageSize: 25,
    }),
    nextApi.fetch(`assets/${assetKey}/holders`, {
      page: activeTab === "holders" ? nPage : 0,
      pageSize: 25,
    }),
    nextApi.fetch(`assets/${assetKey}/statistic`),
  ]);

  return {
    props: {
      node,
      id,
      tab: activeTab,
      asset: asset ?? null,
      assetTimeline: assetTimeline ?? EmptyQuery,
      assetTransfers: assetTransfers ?? EmptyQuery,
      assetHolders: assetHolders ?? EmptyQuery,
      assetAnalytics: assetAnalytics ?? EmptyQuery,
    },
  };
}
