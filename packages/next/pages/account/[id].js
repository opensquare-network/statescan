import _ from "lodash";
import { useEffect } from "react";
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
  nodes,
  teleportsHead,
} from "utils/constants";
import { showIdentityInJSON } from "utils/dataWrapper";
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
import PageNotFound from "components/pageNotFound";
import Identity from "../../components/account/identity";
import TeleportDirection from "../../components/teleportDirection";
import ChainAddressEllipsis from "../../components/chainAddressEllipsis";
import ExplorerLink from "../../components/explorerLink";
import BigNumber from "bignumber.js";
import Source from "../../components/account/source";

function getTeleportSourceAndTarget(node, direction) {
  const chain = nodes.find((item) => item.value === node);
  if (direction === "in") {
    return { source: chain.sub, target: chain.name };
  } else {
    return { source: chain.name, target: chain.sub };
  }
}

export default function Address({
  node,
  id,
  tab,
  addressDetail,
  addressAssets,
  addressTransfers,
  addressExtrinsics,
  addressTeleports,
  addressIdentity,
}) {
  if (!addressDetail) {
    return (
      <Layout node={node}>
        <PageNotFound />
      </Layout>
    );
  }
  const relayChain =
    nodes.find((item) => item.value === node)?.sub?.toLowerCase() || "kusama";
  const symbol = getSymbol(node);
  const teleportSourceAndTarget = (direction) =>
    getTeleportSourceAndTarget(node, direction);

  const nodeInfo = nodes.find((i) => i.value === node);
  const customTeleportHead = _.cloneDeep(teleportsHead);
  const sendAtCol = customTeleportHead.find((item) => item.name === "Sent At");
  if (sendAtCol) {
    sendAtCol.name = <img src={nodeInfo.icon} alt="" />;
  }

  const tabTableData = [
    {
      name: "Assets",
      page: addressAssets?.page,
      total: addressAssets?.total,
      head: addressAssetsHead,
      body: (addressAssets?.items || []).map((item) => [
        <InLink
          to={
            `/asset/${item.assetId}` +
            (item.destroyedAt ? `_${item.createdAt.blockHeight}` : "")
          }
        >{`#${item.assetId}`}</InLink>,
        item.assetSymbol,
        item.assetName,
        bigNumber2Locale(
          fromAssetUnit(item.balance?.$numberDecimal, item.assetDecimals)
        ),
        bigNumber2Locale(fromAssetUnit(item.approved || 0, item.assetDecimals)),
        item.isFrozen?.toString(),
        item.transfers || 0,
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
      page: addressTransfers?.page,
      total: addressTransfers?.total,
      head: addressTransfersHead,
      body: (addressTransfers?.items || []).map((item) => [
        <InLink to={`/event/${item.indexer.blockHeight}-${item.eventSort}`}>
          {`${item.indexer.blockHeight}-${item.eventSort}`}
        </InLink>,
        <InLink
          to={`/extrinsic/${item.indexer.blockHeight}-${item.extrinsicIndex}`}
        >{`${item.indexer.blockHeight}-${item.extrinsicIndex}`}</InLink>,
        <Tooltip label={item.method} bg />,
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
      page: addressExtrinsics?.page,
      total: addressExtrinsics?.total,
      head: addressExtrincsHead,
      body: (addressExtrinsics?.items || []).map((item) => [
        <InLink
          to={`/extrinsic/${item?.indexer?.blockHeight}-${item?.indexer?.index}`}
        >
          {`${item?.indexer?.blockHeight}-${item?.indexer?.index}`}
        </InLink>,
        <HashEllipsis hash={item?.hash} to={`/extrinsic/${item?.hash}`} />,
        item?.indexer?.blockTime,
        <Result isSuccess={item?.isSuccess} />,
        `${item.section}(${item.name})`,
        showIdentityInJSON(item.args),
      ]),
      foot: (
        <Pagination
          page={addressExtrinsics?.page}
          pageSize={addressExtrinsics?.pageSize}
          total={addressExtrinsics?.total}
        />
      ),
    },
    {
      name: "Teleports",
      page: addressTeleports?.page,
      total: addressTeleports?.total,
      head: customTeleportHead,
      body: (addressTeleports?.items || []).map((item) => [
        <InLink
          to={`/extrinsic/${item.indexer.blockHeight}-${item.indexer.index}`}
        >
          {`${item.indexer.blockHeight}-${item.indexer.index}`}
        </InLink>,
        item.indexer.blockTime,
        <TeleportDirection
          from={teleportSourceAndTarget(item.teleportDirection).source}
          to={teleportSourceAndTarget(item.teleportDirection).target}
        />,
        item.beneficiary ? (
          item.teleportDirection === "in" ? (
            <AddressEllipsis address={item.beneficiary} />
          ) : (
            <ChainAddressEllipsis
              chain={teleportSourceAndTarget(item.teleportDirection).target}
              address={item.beneficiary}
            />
          )
        ) : (
          "-"
        ),
        item.teleportDirection === "in" ? (
          <Result isSuccess={item.complete} noText={true} />
        ) : (
          <Result isSuccess={null} noText={true} />
        ),
        item.teleportDirection === "in" ? (
          <ExplorerLink
            chain={teleportSourceAndTarget(item.teleportDirection).source}
            href={`/block/${item.pubSentAt}`}
          >
            {item.pubSentAt}
          </ExplorerLink>
        ) : (
          "-"
        ),
        !item.complete || item.amount === null || item.amount === undefined
          ? "-"
          : `${bigNumber2Locale(
              fromSymbolUnit(
                new BigNumber(item.amount).minus(item.fee || 0).toString(),
                symbol
              )
            )}`,
        item.fee === null || item.fee === undefined
          ? "-"
          : `${bigNumber2Locale(fromSymbolUnit(item.fee, symbol))}`,
        item.amount === null || item.amount === undefined
          ? "-"
          : `${bigNumber2Locale(fromSymbolUnit(item.amount, symbol))}`,
      ]),
      foot: (
        <Pagination
          page={addressTeleports?.page}
          pageSize={addressTeleports?.pageSize}
          total={addressTeleports?.total}
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
                addressDetail?.data?.free?.$numberDecimal || 0,
                symbol
              )} ${symbol}`,
              `${fromSymbolUnit(
                addressDetail?.data?.reserved?.$numberDecimal || 0,
                symbol
              )} ${symbol}`,
              `${fromSymbolUnit(
                addressDetail?.data?.miscFrozen?.$numberDecimal || 0,
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
  const node = process.env.NEXT_PUBLIC_CHAIN;
  const { id } = context.params;
  const { tab, page } = context.query;

  const relayChain =
    nodes.find((item) => item.value === node)?.sub?.toLowerCase() || "kusama";

  const nPage = parseInt(page) || 1;
  const activeTab = tab ?? "assets";

  const [
    { result: addressDetail },
    { result: addressAssets },
    { result: addressTransfers },
    { result: addressExtrinsics },
    { result: addressTeleports },
    addressIdentity,
  ] = await Promise.all([
    nextApi.fetch(`addresses/${id}`),
    nextApi.fetch(`addresses/${id}/assets`, {
      page: activeTab === "assets" ? nPage - 1 : 0,
    }),
    nextApi.fetch(`addresses/${id}/transfers`, {
      page: activeTab === "transfers" ? nPage - 1 : 0,
    }),
    nextApi.fetch(`addresses/${id}/extrinsics`, {
      page: activeTab === "extrinsics" ? nPage - 1 : 0,
    }),
    nextApi.fetch(`addresses/${id}/teleports`, {
      page: activeTab === "teleports" ? nPage - 1 : 0,
    }),
    fetch(
      `${process.env.NEXT_PUBLIC_IDENTITY_SERVER_HOST}/${relayChain}/identity/${id}`
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
      addressAssets: addressAssets ?? EmptyQuery,
      addressTransfers: addressTransfers ?? EmptyQuery,
      addressExtrinsics: addressExtrinsics ?? EmptyQuery,
      addressTeleports: addressTeleports ?? EmptyQuery,
      addressIdentity: _.isEmpty(addressIdentity) ? null : addressIdentity,
    },
  };
}
