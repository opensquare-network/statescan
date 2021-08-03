import Layout from "components/layout";
import { addToast } from "../../../store/reducers/toastSlice";
import { useDispatch } from "react-redux";
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
import { ssrNextApi as nextApi } from "services/nextApi";
import MonoText from "components/monoText";
import PageNotFound from "components/pageNotFound";

export default function Asset({
  node,
  tab,
  asset,
  assetTransfers,
  assetHolders,
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
        <InLink
          to={`/${node}/event/${item.indexer.blockHeight}-${item.eventSort}`}
        >
          {`${item.indexer.blockHeight}-${item.eventSort}`}
        </InLink>,
        <InLink
          to={`/${node}/extrinsic/${item.indexer.blockHeight}-${item.extrinsicIndex}`}
        >{`${item.indexer.blockHeight}-${item.extrinsicIndex}`}</InLink>,
        <Tooltip label={item.method} bg />,
        item.indexer.blockTime,
        <AddressEllipsis
          address={item?.from}
          to={`/${node}/account/${item?.from}`}
        />,
        <AddressEllipsis
          address={item?.to}
          to={`/${node}/account/${item?.to}`}
        />,
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
        index + 1,
        <BreakText>
          <MonoText>
            <InLink to={`/${node}/account/${item?.address}`}>
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
      component: <Timeline data={asset?.timeline} node={node} asset={asset} />,
    },
  ];

  return (
    <Layout node={node}>
      <Section>
        <div>
          <Nav
            data={[
              { name: "Asset Tracker", path: `/${node}/assets` },
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
              <BreakText>
                <CopyText text={asset?.owner}>
                  <MonoText>
                    <InLink to={`/${node}/account/${asset?.owner}`}>
                      {asset?.owner}
                    </InLink>
                  </MonoText>
                </CopyText>
              </BreakText>,
              <BreakText>
                <CopyText text={asset?.issuer}>
                  <MonoText>
                    <InLink to={`/${node}/account/${asset?.issuer}`}>
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

  const { result: asset } = await nextApi.fetch(`${node}/assets/${id}`);
  const assetKey = asset
    ? `${asset.assetId}_${asset.createdAt.blockHeight}`
    : id;

  if (!asset) return { props: {} };

  const nPage = parseInt(page) || 1;
  const activeTab = tab ?? "transfers";

  const [{ result: assetTransfers }, { result: assetHolders }] =
    await Promise.all([
      nextApi.fetch(`${node}/assets/${assetKey}/transfers`, {
        page: activeTab === "transfers" ? nPage - 1 : 0,
      }),
      nextApi.fetch(`${node}/assets/${assetKey}/holders`, {
        page: activeTab === "holders" ? nPage - 1 : 0,
      }),
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
