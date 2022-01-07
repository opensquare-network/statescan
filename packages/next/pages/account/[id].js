import styled from "styled-components";
import _ from "lodash";

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
import { getSymbol, useOnClickOutside } from "utils/hooks";
import DetailTable from "components/detailTable";
import {
  addressAssetsHead,
  addressExtrincsHead,
  addressHead,
  addressNftInstanceHead,
  addressTransfersHead,
  EmptyQuery,
  nftTransferHead,
  nodes,
  teleportsHeadIn,
  teleportsHeadOut,
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
import TeleportDirection from "../../components/teleportDirection";
import ExplorerLink from "../../components/explorerLink";
import BigNumber from "bignumber.js";
import Source from "../../components/account/source";
import Symbol from "components/symbol";
import SymbolLink from "components/symbolLink";
import { text_dark_major, text_dark_minor } from "styles/textStyles";
import { time } from "utils";
import Status from "components/status";
import Thumbnail from "components/nft/thumbnail";
import NftName from "components/nft/name";
import { useRef, useState } from "react";
import Preview from "components/nft/preview";
import NftLink from "components/nft/nftLink";
import Filter from "components/filter";

const TextDark = styled.span`
  ${text_dark_major};
`;

const TextDarkMinor = styled.span`
  ${text_dark_minor};
`;

const AssetPrice = styled.div`
  font-size: 12px;
  line-height: 16px;
  color: rgba(17, 17, 17, 0.35);
`;

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
  direction,
  addressDetail,
  addressAssets,
  addressTransfers,
  addressExtrinsics,
  addressTeleports,
  addressIdentity,
  addressNftInstances,
  addressNftTransfers,
}) {
  const [showModal, setShowModal] = useState(false);
  const [previewNftInstance, setPreviewNftInstance] = useState(null);
  const ref = useRef();

  useOnClickOutside(ref, (event) => {
    // exclude manually
    if (document?.querySelector(".modal")?.contains(event.target)) {
      return;
    }
    setShowModal(false);
  });

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
  const teleportSourceAndTarget = (direction) =>
    getTeleportSourceAndTarget(node, direction);

  const inDirection = (
    <TeleportDirection
      from={teleportSourceAndTarget("in").source}
      to={teleportSourceAndTarget("in").target}
    />
  );
  const outDirection = (
    <TeleportDirection
      from={teleportSourceAndTarget("out").source}
      to={teleportSourceAndTarget("out").target}
    />
  );
  const filter = [
    {
      value: direction,
      name: "Direction",
      query: "direction",
      options: [
        { text: inDirection, value: "in" },
        { text: outDirection, value: "out" },
      ],
    },
  ];
  let teleportsHead, teleportsBody;
  if (direction === "in") {
    teleportsHead = teleportsHeadIn;
    teleportsBody = (addressTeleports?.items || []).map((item, index) => [
      <InLink
        key={`${index}-1`}
        to={`/extrinsic/${item.indexer.blockHeight}-${item.indexer.extrinsicIndex}`}
      >
        {`${item.indexer.blockHeight.toLocaleString()}-${
          item.indexer.extrinsicIndex
        }`}
      </InLink>,
      item.indexer.blockTime,
      item.beneficiary ? (
        <AddressEllipsis
          address={item.beneficiary}
          to={`/account/${item.beneficiary}`}
        />
      ) : (
        "-"
      ),
      inDirection,
      <Result key={`${index}-2`} isSuccess={item.complete} noText={true} />,
      <ExplorerLink
        key={`${index}-3`}
        chain={teleportSourceAndTarget("in").source}
        href={`/block/${item.sentAt}`}
      >
        {item.sentAt.toLocaleString()}
      </ExplorerLink>,
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
    ]);
  } else if (direction === "out") {
    teleportsHead = teleportsHeadOut;
    teleportsBody = (addressTeleports?.items || []).map((item, index) => [
      <InLink
        key={`${index}-1`}
        to={`/extrinsic/${item.indexer.blockHeight}-${item.indexer.extrinsicIndex}`}
      >
        {`${item.indexer.blockHeight.toLocaleString()}-${
          item.indexer.extrinsicIndex
        }`}
      </InLink>,
      item.indexer.blockTime,
      [
        <AddressEllipsis
          key={`${index}-2-1`}
          address={item.beneficiary}
          to={`/account/${item.beneficiary}`}
        />,
        <AddressEllipsis
          key={`${index}-2-2`}
          address={item.signer}
          to={`/account/${item.signer}`}
        />,
      ],
      outDirection,
      <Result
        key={`${index}-3`}
        isSuccess={
          item.relayChainInfo?.outcome?.complete ??
          (item.relayChainInfo?.outcome?.incomplete ||
          item.relayChainInfo?.outcome?.error
            ? false
            : undefined)
        }
        noText={true}
      />,
      item.relayChainInfo?.enterAt?.blockHeight ? (
        <ExplorerLink
          key={`${index}-4`}
          chain={teleportSourceAndTarget("in").source}
          href={`/block/${item.relayChainInfo.enterAt.blockHeight}`}
        >
          {item.relayChainInfo.enterAt.blockHeight.toLocaleString()}
        </ExplorerLink>
      ) : (
        "-"
      ),
      item.relayChainInfo?.executedAt?.blockHeight ? (
        <ExplorerLink
          key={`${index}-5`}
          chain={teleportSourceAndTarget("in").source}
          href={`/block/${item.relayChainInfo.executedAt.blockHeight}`}
        >
          {item.relayChainInfo.executedAt.blockHeight.toLocaleString()}
        </ExplorerLink>
      ) : (
        "-"
      ),
      item.amount !== null && item.amount !== undefined
        ? `${bigNumber2Locale(fromSymbolUnit(item.amount, symbol))}`
        : "-",
    ]);
  }

  const tabTableData = [
    {
      name: "Assets",
      page: addressAssets?.page,
      total: addressAssets?.total,
      head: addressAssetsHead,
      body: (addressAssets?.items || []).map((item, index) => [
        <InLink
          key={`${index}-1`}
          to={
            `/asset/${item.assetId}` +
            (item.assetDestroyedAt ? `_${item.assetCreatedAt.blockHeight}` : "")
          }
        >{`#${item.assetId}`}</InLink>,
        <Symbol
          key={`${index}-2`}
          symbol={item.assetSymbol}
          assetId={item.assetId}
          createdAt={item.assetCreatedAt}
          destroyedAt={item.assetDestroyedAt}
        />,
        item.assetName,
        <div key={`${index}-3`}>
          {bigNumber2Locale(
            fromAssetUnit(item.balance?.$numberDecimal, item.assetDecimals)
          )}
          {item.price?.value && item.balance && (
            <AssetPrice>{`$${bigNumber2Locale(
              (
                Number(
                  fromAssetUnit(
                    item.balance?.$numberDecimal,
                    item.assetDecimals
                  )
                ) * Number(item.price.value)
              ).toFixed(2)
            )}`}</AssetPrice>
          )}
        </div>,
        bigNumber2Locale(fromAssetUnit(item.approved?.$numberDecimal || 0, item.assetDecimals)),
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
      body: (addressTransfers?.items || []).map((item, index) => [
        <InLink
          key={index}
          to={`/event/${item.indexer.blockHeight}-${item.indexer.eventIndex}`}
        >
          {`${item.indexer.blockHeight.toLocaleString()}-${item.indexer.eventIndex}`}
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
            : `${bigNumber2Locale(fromSymbolUnit(item.balance.$numberDecimal, symbol))} `}
          <SymbolLink assetId={item.assetId} destroyedAt={item.assetDestroyedAt} createdAt={item.assetCreatedAt}>
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
    {
      name: "Teleports",
      addQuery: direction === "out" && { direction },
      page: addressTeleports?.page,
      total: addressTeleports?.total,
      head: teleportsHead,
      body: teleportsBody,
      filter: (
        <Filter
          total={`All ${addressTeleports?.total} teleports`}
          warning="There are issues with teleports scan and we are fixing them."
          data={filter}
          addQuery={{ tab: "teleports" }}
        />
      ),
      foot: (
        <Pagination
          page={addressTeleports?.page}
          pageSize={addressTeleports?.pageSize}
          total={addressTeleports?.total}
        />
      ),
    },
    {
      name: "NFT",
      page: addressNftInstances?.page,
      total: addressNftInstances?.total,
      head: addressNftInstanceHead,
      body: (addressNftInstances?.items || []).map((instance, index) => {
        const name = (instance.nftMetadata ?? instance.class.nftMetadata)?.name;
        const imageThumbnail =
          instance?.nftMetadata?.recognized === false
            ? null
            : instance.nftMetadata?.image
            ? instance.nftMetadata.imageThumbnail
            : instance.class.nftMetadata?.imageThumbnail;
        const background = instance.nftMetadata?.image
          ? instance.nftMetadata.imageMetadata?.background
          : instance.class.nftMetadata?.imageMetadata?.background;
        return [
          <NftLink key={`classid${index}`} nftClass={instance.class}>
            {instance.classId}
          </NftLink>,
          <NftLink
            key={`instanceid${index}`}
            nftClass={instance.class}
            nftInstance={instance}
          >
            {instance.instanceId}
          </NftLink>,
          <Thumbnail
            imageThumbnail={imageThumbnail}
            key={`thumbnail${index}`}
            onClick={() => {
              setPreviewNftInstance(instance);
              setShowModal(true);
            }}
            background={background}
          />,
          <TextDark key={`name-${index}`}>
            <NftLink nftClass={instance.class} nftInstance={instance}>
              <NftName name={name} />
            </NftLink>
          </TextDark>,
          <TextDarkMinor key={`time-${index}`}>
            {time(instance.indexer?.blockTime)}
          </TextDarkMinor>,
          <Status
            key={`status-${index}`}
            status={instance.details?.isFrozen ? "Frozen" : "Active"}
          />,
        ];
      }),
      foot: (
        <Pagination
          page={addressNftInstances?.page}
          pageSize={addressNftInstances?.pageSize}
          total={addressNftInstances?.total}
        />
      ),
    },
    {
      name: "NFT Transfer",
      page: addressNftTransfers?.page,
      total: addressNftTransfers?.total,
      head: nftTransferHead,
      body: (addressNftTransfers?.items || []).map((item, index) => {
        const instance = item.instance;
        const name = (instance.nftMetadata ?? instance.class.nftMetadata)?.name;
        const imageThumbnail =
          instance?.nftMetadata?.recognized === false
            ? null
            : instance.nftMetadata?.image
            ? instance.nftMetadata.imageThumbnail
            : instance.class.nftMetadata?.imageThumbnail;
        const background = instance.nftMetadata?.image
          ? instance.nftMetadata.imageMetadata?.background
          : instance.class.nftMetadata?.imageMetadata?.background;

        return [
          <InLink
            key={`link${index}`}
            to={`/extrinsic/${item.indexer.blockHeight}-${item.indexer.extrinsicIndex}`}
          >
            {`${item.indexer.blockHeight.toLocaleString()}-${
              item.indexer.extrinsicIndex
            }`}
          </InLink>,
          <NftLink
            key={`instance${index}`}
            nftClass={instance.class}
            nftInstance={instance}
          >
            {`${item.classId}-${item.instanceId}`}
          </NftLink>,
          item.indexer?.blockTime,
          <Thumbnail
            imageThumbnail={imageThumbnail}
            key={`thumbnail${index}`}
            onClick={() => {
              setPreviewNftInstance(instance);
              setShowModal(true);
            }}
            background={background}
          />,
          <TextDark key={`name-${index}`}>
            <NftLink nftClass={instance.class} nftInstance={instance}>
              <NftName name={name} />
            </NftLink>
          </TextDark>,
          item.from !== id ? (
            <AddressEllipsis
              key={`from-${index}`}
              address={item.from}
              to={`/account/${item.from}`}
            />
          ) : (
            <AddressEllipsis key={`from-${index}`} address={item.from} />
          ),
          item.to !== id ? (
            <AddressEllipsis
              key={`to-${index}`}
              address={item.to}
              to={`/account/${item.to}`}
            />
          ) : (
            <AddressEllipsis key={`to-${index}`} address={item.to} />
          ),
        ];
      }),
      foot: (
        <Pagination
          page={addressNftTransfers?.page}
          pageSize={addressNftTransfers?.pageSize}
          total={addressNftTransfers?.total}
        />
      ),
    },
  ];

  return (
    <Layout node={node}>
      <div ref={ref}>
        <Preview
          open={showModal}
          nftClass={previewNftInstance?.class}
          nftInstance={previewNftInstance}
          closeFn={() => {
            setShowModal(false);
          }}
        />
      </div>
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
  const { tab, page, direction } = context.query;

  const relayChain =
    nodes.find((item) => item.value === node)?.sub?.toLowerCase() || "kusama";

  const nPage = parseInt(page) || 1;
  const activeTab = tab ?? "assets";
  const nDirection = direction || "in";

  const [
    { result: addressDetail },
    { result: addressAssets },
    { result: addressTransfers },
    { result: addressExtrinsics },
    { result: addressTeleports },
    addressIdentity,
    { result: addressNftInstances },
    { result: addressNftTransfers },
  ] = await Promise.all([
    nextApi.fetch(`addresses/${id}`),
    nextApi.fetch(`addresses/${id}/assets`, {
      page: activeTab === "assets" ? nPage - 1 : 0,
      pageSize: 25,
    }),
    nextApi.fetch(`addresses/${id}/transfers`, {
      page: activeTab === "transfers" ? nPage - 1 : 0,
      pageSize: 25,
    }),
    nextApi.fetch(`addresses/${id}/extrinsics`, {
      page: activeTab === "extrinsics" ? nPage - 1 : 0,
      pageSize: 25,
    }),
    nextApi.fetch(`addresses/${id}/teleports/${nDirection}`, {
      page: activeTab === "teleports" ? nPage - 1 : 0,
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
    nextApi.fetch(`addresses/${id}/nft/instances`, {
      page: activeTab === "nft" ? nPage - 1 : 0,
      pageSize: 25,
    }),
    nextApi.fetch(`addresses/${id}/nft/transfers`, {
      page: ["nft-transfer", "nft transfer"].includes(activeTab)
        ? nPage - 1
        : 0,
      pageSize: 25,
    }),
  ]);

  return {
    props: {
      node,
      id,
      tab: activeTab,
      direction: nDirection,
      addressDetail: addressDetail ?? {
        address: id,
        data: { free: 0, reserved: 0, miscFrozen: 0, feeFrozen: 0 },
        nonce: 0,
      },
      addressAssets: addressAssets ?? EmptyQuery,
      addressTransfers: addressTransfers ?? EmptyQuery,
      addressExtrinsics: addressExtrinsics ?? EmptyQuery,
      addressTeleports: addressTeleports ?? EmptyQuery,
      addressIdentity: _.isEmpty(addressIdentity) ? null : addressIdentity[0],
      addressNftInstances: addressNftInstances ?? EmptyQuery,
      addressNftTransfers: addressNftTransfers ?? EmptyQuery,
    },
  };
}
