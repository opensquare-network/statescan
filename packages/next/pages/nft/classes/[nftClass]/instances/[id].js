import Layout from "components/layout";
import Nav from "components/nav";
import CopyText from "components/copyText";
import { nftInstanceHead, nftTransferHead, EmptyQuery } from "utils/constants";
import DetailTable from "components/detailTable";
import Section from "components/section";
import MinorText from "components/minorText";
import { time } from "utils";
import Address from "components/address";
import TabTable from "components/tabTable";
import Timeline from "components/timeline/nftTimeline";
import Status from "components/status";
import styled, { css } from "styled-components";
import { card_border } from "styles/textStyles";
import NftInfo from "components/nftInfo";
import { ssrNextApi as nextApi } from "services/nextApi";
import IpfsLink from "components/ipfsLink";
import NftImage from "components/nft/nftImage";
import SquareBoxComponent from "components/squareBox";
import NoData from "components/table/noData";
import Thumbnail from "components/nft/thumbnail";
import AddressEllipsis from "components/addressEllipsis";
import NftName from "components/nft/name";
import Pagination from "components/pagination";
import InLink from "components/inLink";
import { text_dark_major } from "styles/textStyles";
import NftLink from "components/nft/nftLink";
import PageError from "components/pageError";

const Between = styled.div`
  margin-bottom: 16px;
  padding: 24px 0 24px 0;
  display: flex;
  @media screen and (max-width: 1064px) {
    flex-flow: column;
  }
  ${card_border};
  background: white;
  gap: 16px;

  > :first-child {
    margin: 0 0 0 24px;
    @media screen and (max-width: 1064px) {
      margin: 0 24px 0 24px;
    }
    border: none;
    box-shadow: none;

    // Styled the square box
    > div {
      max-width: 480px;
      @media screen and (min-width: 1064px) {
        width: 480px;
      }
    }
  }

  > :nth-child(2) {
    padding: 0;
    margin-right: 24px;
    border: none;
    box-shadow: none;
    flex-grow: 1;
  }

  img {
    object-fit: contain;
  }
`;

const Ipfs = styled.div`
  display: flex;
  font-size: 14px;
  line-height: 20px;
  color: rgba(17, 17, 17, 0.65);

  > :first-child {
    margin-right: 9.65px;
  }
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  flex-wrap: wrap;

  div:first-child {
    margin-bottom: 16px;
  }

  ${(props) =>
    !props.isLast &&
    css`
      padding-bottom: 24px;
      margin-bottom: 24px;
      border-bottom: 1px solid #f8f8f8;
    `};
`;
const RowItem = styled.div`
  width: 100%;
  line-height: 20px;
`;

const TextDark = styled.span`
  ${text_dark_major};
`;

export default function NftInstance({
  node,
  nftClass,
  nftInstance,
  nftTransfers,
  nftInstanceTimeline,
}) {
  if (!nftClass || !nftInstance) {
    return (
      <Layout node={node}>
        <PageError resource="NFT instance" />
      </Layout>
    );
  }

  const name = nftInstance?.nftMetadata?.name ?? nftClass?.nftMetadata?.name;
  const imageThumbnail =
    nftInstance?.nftMetadata?.recognized === false
      ? null
      : nftInstance?.nftMetadata?.image
      ? nftInstance?.nftMetadata?.imageThumbnail
      : nftClass?.nftMetadata?.imageThumbnail;
  const background = nftInstance?.nftMetadata?.image
    ? nftInstance.nftMetadata.imageMetadata?.background
    : nftClass?.nftMetadata?.imageMetadata?.background;
  const description =
    nftInstance?.nftMetadata?.description ?? nftClass?.nftMetadata?.description;

  const tab = null;
  const nftMetadata = nftInstance?.nftMetadata
    ? nftInstance?.nftMetadata
    : nftClass?.nftMetadata;
  const tabTableData = [
    {
      name: "Timeline",
      total: nftInstanceTimeline?.total,
      component: (
        <Timeline
          data={nftInstanceTimeline?.items}
          node={node}
          meta={nftInstanceTimeline}
        />
      ),
    },
    {
      name: "Attributes",
      total: nftInstance?.attributes?.length,
      component:
        nftInstance?.attributes?.length > 0 ? (
          <DetailTable
            head={
              nftInstance?.attributes?.map((attr, index) => `#${index + 1}`) ??
              []
            }
            body={
              nftInstance?.attributes?.map((attr, index) => {
                return (
                  <Row
                    key={`row${index}`}
                    isLast={index === nftInstance?.attributes?.length - 1}
                  >
                    <RowItem>{hex2a(attr.key)}</RowItem>
                    <RowItem>{hex2a(attr.value)}</RowItem>
                  </Row>
                );
              }) ?? []
            }
          />
        ) : (
          <NoData />
        ),
    },
    {
      name: "Transfers",
      page: nftTransfers?.page,
      total: nftTransfers?.total,
      head: nftTransferHead,
      body: (nftTransfers?.items || []).map((item, index) => {
        return [
          <InLink
            key={index}
            to={`/extrinsic/${item.indexer.blockHeight}-${item.indexer.extrinsicIndex}`}
          >
            {`${item.indexer.blockHeight.toLocaleString()}-${
              item.indexer.extrinsicIndex
            }`}
          </InLink>,
          <NftLink
            key={`instance${index}`}
            nftClass={nftClass}
            nftInstance={nftInstance}
          >
            {`${item.classId}-${item.instanceId}`}
          </NftLink>,
          item.indexer?.blockTime,
          <Thumbnail
            imageThumbnail={imageThumbnail}
            key={`thumbnail${index}`}
            background={background}
          />,
          <TextDark key={`name-${index}`}>
            <NftName name={name} />
          </TextDark>,
          <AddressEllipsis
            key={`from-${index}`}
            address={item.from}
            to={`/account/${item.from}`}
          />,
          <AddressEllipsis
            key={`to-${index}`}
            address={item.to}
            to={`/account/${item.to}`}
          />,
        ];
      }),
      foot: (
        <Pagination
          page={nftTransfers?.page}
          pageSize={nftTransfers?.pageSize}
          total={nftTransfers?.total}
        />
      ),
    },
  ];

  function hex2a(hexx) {
    var hex = hexx.toString(); //force conversion
    var str = "";
    for (var i = 0; i < hex.length; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }

  let status = "Active";
  if (nftInstance?.details?.isFrozen) {
    status = "Frozen";
  }
  if (nftInstance?.isDestroyed) {
    status = "Destroyed";
  }

  let imageCid;
  if (nftMetadata?.image?.startsWith("ipfs://")) {
    imageCid = nftMetadata?.image.split("/").pop();
  }

  const isDestroyed = nftInstance.isDestroyed || nftClass.isDestroyed;
  return (
    <Layout node={node}>
      <Section>
        <div>
          <Nav
            data={[
              {
                name: isDestroyed ? "Destroyed NFT" : "NFT",
                path: isDestroyed ? `/destroyed/nft` : `/nft`,
              },
              {
                name: `Class ${nftInstance?.classId}`,
                path: `/nft/classes/${nftInstance?.classId}`,
              },
              { name: `Instance` },
              { name: nftInstance?.instanceId },
            ]}
            node={node}
          />
          <Between>
            <div>
              <SquareBoxComponent background={nftMetadata?.background}>
                <NftImage nftMetadata={nftMetadata} />
              </SquareBoxComponent>
            </div>
            <DetailTable
              head={["Class ID  ", ...nftInstanceHead]}
              body={[
                <MinorText key="1">{nftInstance?.classId}</MinorText>,
                <MinorText key="2">{nftInstance?.instanceId}</MinorText>,
                <MinorText key="3">
                  {time(nftInstance?.indexer?.blockTime)}
                </MinorText>,
                <CopyText key="4" text={nftInstance?.details?.owner}>
                  <Address
                    address={nftInstance?.details?.owner}
                    to={`/account/${nftInstance?.details?.owner}`}
                  />
                </CopyText>,
                status === "Active" ? undefined : (
                  <Status key="6" status={status} />
                ),
                imageCid && (
                  <Ipfs key="7">
                    <span>IPFS</span>
                    <IpfsLink cid={imageCid} />
                  </Ipfs>
                ),
              ]}
              info={
                <NftInfo
                  data={{
                    title: name ?? "[Unrecognized]",
                    description: description ?? "-",
                  }}
                />
              }
            />
          </Between>
        </div>
        <TabTable
          data={tabTableData}
          activeTab={tab}
          collapse={900}
          query={["nftClass", "id"]}
        />
      </Section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const node = process.env.NEXT_PUBLIC_CHAIN;
  const {
    nftClass: paramClassId,
    id: paramInstanceId,
    page,
    tab: activeTab,
  } = context.query;

  let nPage;
  if (activeTab === "timeline") {
    nPage = page ? parseInt(page) - 1 : "last";
  } else {
    nPage = (parseInt(page) || 1) - 1;
  }

  const [{ result: nftClass }, { result: nftInstance }] = await Promise.all([
    nextApi.fetch(`nft/classes/${paramClassId}`),
    nextApi.fetch(`nft/classes/${paramClassId}/instances/${paramInstanceId}`),
  ]);
  if (!nftClass || !nftInstance) {
    return {
      props: {
        node,
        nftClass: null,
        nftInstance: null,
        nftTransfers: EmptyQuery,
      },
    };
  }

  const {
    classId,
    classHeight,
    instanceId,
    indexer: { blockHeight: instanceHeight },
  } = nftInstance;
  const [{ result: nftTransfers }, { result: nftInstanceTimeline }] =
    await Promise.all([
      nextApi.fetch(
        `nft/classes/${classId}_${classHeight}/instances/${instanceId}_${instanceHeight}/transfers`,
        { page: nPage - 1, pageSize: 25 }
      ),
      nextApi.fetch(`nft/classes/${classId}/instances/${instanceId}/timeline`, {
        page: activeTab === "timeline" ? nPage : "last",
        pageSize: 25,
      }),
    ]);
  return {
    props: {
      node,
      nftClass: nftClass,
      nftInstance: nftInstance,
      nftTransfers: nftTransfers ?? EmptyQuery,
      nftInstanceTimeline: nftInstanceTimeline ?? EmptyQuery,
    },
  };
}
