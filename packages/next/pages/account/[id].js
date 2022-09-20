import _ from "lodash";

import { ssrNextApi as nextApi } from "services/nextApi";
import Layout from "components/layout";
import Nav from "components/nav";
import AddressEllipsis from "components/addressEllipsis";
import {
  addressEllipsis,
  bigNumber2Locale,
  encodeAddressToChain,
  fromAssetUnit,
  fromSymbolUnit,
} from "utils";
import { getSymbol } from "utils/hooks";
import DetailTable from "components/detailTable";
import {
  addressExtrincsHead,
  addressHead,
  addressTransfersHead,
  EmptyQuery,
  nodes,
} from "utils/constants";
import MinorText from "components/minorText";
import MonoText from "components/monoText";
import BreakText from "components/breakText";
import CopyText from "components/copyText";
import TabTable from "components/tabTable";
import Section from "components/section";
import InLink from "components/inLink";
import Result from "components/result";
import Pagination from "components/pagination";
import Tooltip from "components/tooltip";
import HashEllipsis from "components/hashEllipsis";
import PageError from "components/pageError";
import Identity from "../../components/account/identity";
import Source from "../../components/account/source";
import SymbolLink from "components/symbolLink";
import { isAddress } from "@polkadot/util-crypto";

export default function Address({
  node,
  id,
  tab,
  addressDetail,
  addressTransfers,
  addressExtrinsics,
  addressIdentity,
}) {
  if (!addressDetail) {
    return (
      <Layout node={node}>
        <PageError resource="Account" />
      </Layout>
    );
  }
  const relayChain =
    nodes.find((item) => item.value === node)?.sub?.toLowerCase() || "kusama";
  const symbol = getSymbol(node);

  const tabTableData = [
    {
      name: "Transfers",
      page: addressTransfers?.page,
      total: addressTransfers?.total,
      head: addressTransfersHead,
      body: (addressTransfers?.items || []).map((item, index) => [
        <InLink
          key={index}
          to={`/event/${item.indexer.blockHeight}-${item.indexer.eventIndex}`}
        >
          {`${item.indexer.blockHeight.toLocaleString()}-${
            item.indexer.eventIndex
          }`}
        </InLink>,
        item.extrinsicHash ? (
          <InLink
            to={`/extrinsic/${item.indexer.blockHeight}-${item.indexer.extrinsicIndex}`}
          >{`${item.indexer.blockHeight.toLocaleString()}-${
            item.indexer.extrinsicIndex
          }`}</InLink>
        ) : (
          "-"
        ),
        item.extrinsicHash ? <Tooltip label={item.method} bg /> : "-",
        item.indexer.blockTime,
        item.from !== id ? (
          <AddressEllipsis address={item.from} to={`/account/${item.from}`} />
        ) : (
          <AddressEllipsis address={item.from} />
        ),
        item.to !== id ? (
          <AddressEllipsis address={item.to} to={`/account/${item.to}`} />
        ) : (
          <AddressEllipsis address={item.to} />
        ),
        <>
          {item.assetSymbol
            ? `${bigNumber2Locale(
                fromAssetUnit(item.balance.$numberDecimal, item.assetDecimals)
              )} `
            : `${bigNumber2Locale(
                fromSymbolUnit(item.balance.$numberDecimal, symbol)
              )} `}
          <SymbolLink
            assetId={item.assetId}
            destroyedAt={item.assetDestroyedAt}
            createdAt={item.assetCreatedAt}
          >
            {item.assetSymbol ? item.assetSymbol : symbol}
          </SymbolLink>
        </>,
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
      page: addressExtrinsics?.page,
      total: addressExtrinsics?.total,
      head: addressExtrincsHead,
      type: "extrinsic",
      body: (addressExtrinsics?.items || []).map((item, index) => [
        <InLink
          key={`${index}-1`}
          to={`/extrinsic/${item?.indexer?.blockHeight}-${item?.indexer?.index}`}
        >
          {`${item?.indexer?.blockHeight.toLocaleString()}-${
            item?.indexer?.index
          }`}
        </InLink>,
        <HashEllipsis
          key={`${index}-2`}
          hash={item?.hash}
          to={`/extrinsic/${item?.hash}`}
        />,
        item?.indexer?.blockTime,
        <Result key={`${index}-3`} isSuccess={item?.isSuccess} />,
        `${item.section}(${item.name})`,
        item,
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
            data={[{ name: "Account" }, { name: addressEllipsis(id) }]}
            node={node}
          />
          <DetailTable
            head={addressHead}
            body={[
              <div
                key="1"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  paddingTop: 8,
                  paddingBottom: 8,
                }}
              >
                <Identity identity={addressIdentity} />
                <CopyText text={addressDetail?.address}>
                  <BreakText>
                    <MinorText>
                      <MonoText>{addressDetail?.address}</MonoText>
                    </MinorText>
                  </BreakText>
                </CopyText>
                <Source
                  relayChain={relayChain}
                  address={addressDetail?.address}
                />
              </div>,
              `${fromSymbolUnit(
                addressDetail?.data?.total?.$numberDecimal || 0,
                symbol
              )} ${symbol}`,
              `${fromSymbolUnit(
                addressDetail?.data?.free?.$numberDecimal || 0,
                symbol
              )} ${symbol}`,
              `${fromSymbolUnit(
                addressDetail?.data?.reserved?.$numberDecimal || 0,
                symbol
              )} ${symbol}`,
              <MinorText key="2">{addressDetail?.nonce}</MinorText>,
            ]}
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

  if (!isAddress(id)) {
    return { notFound: true };
  }

  const address = encodeAddressToChain(id);

  if (id !== address) {
    return {
      redirect: {
        permanent: true,
        destination: `/account/${address}`,
      },
      props: {},
    };
  }

  const relayChain =
    nodes.find((item) => item.value === node)?.sub?.toLowerCase() || "kusama";

  const nPage = parseInt(page) || 1;
  const activeTab = tab ?? "assets";

  const [
    { result: addressDetail },
    { result: addressTransfers },
    { result: addressExtrinsics },
    addressIdentity,
  ] = await Promise.all([
    nextApi.fetch(`addresses/${id}`),
    nextApi.fetch(`addresses/${id}/transfers`, {
      page: activeTab === "transfers" ? nPage - 1 : 0,
      pageSize: 25,
    }),
    nextApi.fetch(`addresses/${id}/extrinsics`, {
      page: activeTab === "extrinsics" ? nPage - 1 : 0,
      pageSize: 25,
    }),
    fetch(
      `${process.env.NEXT_PUBLIC_IDENTITY_SERVER_HOST}/${relayChain}/short-ids`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses: [id] }),
      }
    )
      .then((res) => res.json())
      .catch(() => null),
  ]);

  return {
    props: {
      node,
      id,
      tab: activeTab,
      addressDetail: addressDetail ?? {
        address: id,
        data: { free: 0, reserved: 0, miscFrozen: 0, feeFrozen: 0 },
        nonce: 0,
      },
      addressTransfers: addressTransfers ?? EmptyQuery,
      addressExtrinsics: addressExtrinsics ?? EmptyQuery,
      addressIdentity: _.isEmpty(addressIdentity) ? null : addressIdentity[0],
    },
  };
}
