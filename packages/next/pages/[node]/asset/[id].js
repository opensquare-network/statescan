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
import CopyText from "components/copyText";
import TabTable from "components/tabTable";
import BreakText from "components/breakText";
import Pagination from "components/pagination";
import Tooltip from "components/tooltip";
import Timeline from "components/timeline";
import nextApi from "services/nextApi";
import MonoText from "components/monoText";

export default function Asset({
  node,
  tab,
  asset,
  assetTransfers,
  assetHolders,
}) {
  const assetSymbol = asset?.symbol;

  const symbol = getSymbol(node);

  const tabTableData = [
    {
      name: "Transfers",
      total: assetTransfers?.total,
      head: assetTransfersHead,
      body: (assetTransfers?.items || []).map((item) => [
        `${item.indexer.blockHeight}-${item.eventSort}`,
        <InLink
          to={`/${node}/extrinsic/${item.indexer.blockHeight}-${item.extrinsicIndex}`}
        >{`${item.indexer.blockHeight}-${item.extrinsicIndex}`}</InLink>,
        <Tooltip label={item.method} bg />,
        item.indexer.blockTime,
        <InLink to={`/${node}/address/${item?.from}`}>
          <AddressEllipsis address={item?.from} />
        </InLink>,
        <InLink to={`/${node}/address/${item?.to}`}>
          <AddressEllipsis address={item?.to} />
        </InLink>,
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
      total: assetHolders?.total,
      head: assetHoldersHead,
      body: (assetHolders?.items || []).map((item, index) => [
        index + 1,
        <BreakText>
          <MonoText>
            <InLink to={`/${node}/address/${item?.address}`}>
              {item?.address}
            </InLink>
          </MonoText>
        </BreakText>,
        bigNumber2Locale(fromAssetUnit(item?.balance, item?.assetDecimals)),
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
      component: <Timeline data={asset?.timeline} />,
    },
  ];

  return (
    <Layout>
      <Section>
        <div>
          <Nav
            data={[
              { name: "Asset Tracker", path: `/${node}/assets` },
              { name: assetSymbol },
            ]}
          />
          <DetailTable
            head={assetHead}
            body={[
              <MinorText>{asset?.symbol}</MinorText>,
              <MinorText>{asset?.name}</MinorText>,
              <MinorText>{`#${asset?.assetId}`}</MinorText>,
              <BreakText>
                <CopyText text={asset?.owner}>
                  <MonoText>
                    <InLink to={`/${node}/address/${asset?.owner}`}>
                      {asset?.owner}
                    </InLink>
                  </MonoText>
                </CopyText>
              </BreakText>,
              <BreakText>
                <CopyText text={asset?.issuer}>
                  <MonoText>
                    <InLink to={`/${node}/address/${asset?.issuer}`}>
                      {asset?.issuer}
                    </InLink>
                  </MonoText>
                </CopyText>
              </BreakText>,
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
  const { node, id } = context.params;
  const { tab, page } = context.query;

  const nPage = parseInt(page) || 1;
  const activeTab = tab ?? "transfers";

  const [
    { result: asset },
    { result: assetTransfers },
    { result: assetHolders },
  ] = await Promise.all([
    nextApi.fetch(`${node}/assets/${id}`),
    nextApi.fetch(`${node}/assets/${id}/transfers`, { page: nPage - 1 }),
    nextApi.fetch(`${node}/assets/${id}/holders`, { page: nPage - 1 }),
  ]);

  return {
    props: {
      node,
      id,
      tab: activeTab,
      asset: asset ?? null,
      assetTransfers: assetTransfers ?? EmptyQuery,
      assetHolders: assetHolders ?? EmptyQuery,
    },
  };
}
