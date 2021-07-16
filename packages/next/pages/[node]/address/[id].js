import { ssrNextApi as nextApi } from "services/nextApi";

import Layout from "components/layout";
import Nav from "components/nav";
import AddressEllipsis from "components/addressEllipsis";
import {
  addressEllipsis,
  bigNumber2Locale,
  fromAssetUnit,
  fromSymbolUnit,
} from "utils";
import { getSymbol } from "utils/hooks";
import DetailTable from "components/detailTable";
import {
  addressAssetsHead,
  addressExtrincsHead,
  addressHead,
  addressTransfersHead,
  EmptyQuery,
} from "utils/constants";
import MinorText from "components/minorText";
import BreakText from "components/breakText";
import CopyText from "components/copyText";
import TabTable from "components/tabTable";
import Section from "components/section";
import InLink from "components/inLink";
import Result from "components/result";
import Pagination from "components/pagination";
import Tooltip from "components/tooltip";
import HashEllipsis from "components/hashEllipsis";
import PageNotFound from "components/pageNotFound";

export default function Address({
  node,
  id,
  tab,
  addressDetail,
  addressAssets,
  addressTransfers,
  addressExtrinsics,
}) {
  if (!addressDetail) {
    return (
      <Layout node={node}>
        <PageNotFound />
      </Layout>
    );
  }

  const symbol = getSymbol(node);

  const tabTableData = [
    {
      name: "Assets",
      total: addressAssets?.total,
      head: addressAssetsHead,
      body: (addressAssets?.items || []).map((item) => [
        <InLink
          to={`/${node}/asset/${item.assetId}_${item.assetCreatedAt?.blockHeight}`}
        >{`#${item.assetId}`}</InLink>,
        item.assetSymbol,
        item.assetName,
        bigNumber2Locale(fromAssetUnit(item.balance, item.assetDecimals)),
        item.approved || 0,
        item.isFrozen?.toString(),
        item.transfers,
      ]),
      foot: (
        <Pagination
          page={addressAssets?.page}
          pageSize={addressAssets?.pageSize}
          total={addressAssets?.total}
        />
      ),
    },
    {
      name: "Transfers",
      total: addressTransfers?.total,
      head: addressTransfersHead,
      body: (addressTransfers?.items || []).map((item) => [
        `${item.indexer.blockHeight}-${item.eventSort}`,
        <InLink
          to={`/${node}/extrinsic/${item.indexer.blockHeight}-${item.extrinsicIndex}`}
        >{`${item.indexer.blockHeight}-${item.extrinsicIndex}`}</InLink>,
        <Tooltip label={item.method} bg />,
        item.indexer.blockTime,
        item.from !== id ? (
          <InLink to={`/${node}/address/${item.from}`}>
            <AddressEllipsis address={item.from} />
          </InLink>
        ) : (
          <AddressEllipsis address={item.from} />
        ),
        item.to !== id ? (
          <InLink to={`/${node}/address/${item.to}`}>
            <AddressEllipsis address={item.to} />
          </InLink>
        ) : (
          <AddressEllipsis address={item.to} />
        ),
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
          page={addressTransfers?.page}
          pageSize={addressTransfers?.pageSize}
          total={addressTransfers?.total}
        />
      ),
    },
    {
      name: "Extrinsics",
      total: addressExtrinsics?.total,
      head: addressExtrincsHead,
      body: (addressExtrinsics?.items || []).map((item) => [
        <InLink
          to={`/${node}/extrinsic/${item?.indexer?.blockHeight}-${item?.indexer?.index}`}
        >
          {`${item?.indexer?.blockHeight}-${item?.indexer?.index}`}
        </InLink>,
        <InLink to={`/${node}/extrinsic/${item?.hash}`}>
          <HashEllipsis hash={item?.hash} />
        </InLink>,
        item?.indexer?.blockTime,
        <Result isSuccess={item?.isSuccess} />,
        `${item.section}(${item.name})`,
        item.args,
      ]),
      foot: (
        <Pagination
          page={addressExtrinsics?.page}
          pageSize={addressExtrinsics?.pageSize}
          total={addressExtrinsics?.total}
        />
      ),
    },
  ];

  return (
    <Layout node={node}>
      <Section>
        <div>
          <Nav
            data={[{ name: "Address" }, { name: addressEllipsis(id) }]}
            node={node}
          />
          <DetailTable
            head={addressHead}
            body={[
              <CopyText text={addressDetail?.address}>
                <BreakText>
                  <MinorText>{addressDetail?.address}</MinorText>
                </BreakText>
              </CopyText>,
              `${fromSymbolUnit(
                addressDetail?.data?.free || 0,
                symbol
              )} ${symbol}`,
              `${fromSymbolUnit(
                addressDetail?.data?.reserved || 0,
                symbol
              )} ${symbol}`,
              `${fromSymbolUnit(
                addressDetail?.data?.miscFrozen || 0,
                symbol
              )} ${symbol}`,
              <MinorText>{addressDetail?.nonce}</MinorText>,
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
  const activeTab = tab ?? "assets";

  const [
    { result: addressDetail },
    { result: addressAssets },
    { result: addressTransfers },
    { result: addressExtrinsics },
  ] = await Promise.all([
    nextApi.fetch(`${node}/addresses/${id}`),
    nextApi.fetch(`${node}/addresses/${id}/assets`, { page: nPage - 1 }),
    nextApi.fetch(`${node}/addresses/${id}/transfers`, { page: nPage - 1 }),
    nextApi.fetch(`${node}/addresses/${id}/extrinsics`, { page: nPage - 1 }),
  ]);

  return {
    props: {
      node,
      id,
      tab: activeTab,
      addressDetail: addressDetail ?? null,
      addressAssets: addressAssets ?? EmptyQuery,
      addressTransfers: addressTransfers ?? EmptyQuery,
      addressExtrinsics: addressExtrinsics ?? EmptyQuery,
    },
  };
}
