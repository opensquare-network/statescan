import { useRef, useState } from "react";
import Layout from "components/layout";
import Nav from "components/nav";
import CopyText from "components/copyText";
import { EmptyQuery, NFTClassHead, NFTClassInstanceHead } from "utils/constants";
import DetailTable from "components/detailTable";
import Section from "components/section";
import MinorText from "components/minorText";
import AddressEllipsis from "components/addressEllipsis";
import { time } from "utils";
import Address from "components/address";
import TabTable from "components/tabTable";
import Pagination from "components/pagination";
import Timeline from "components/timeline/NFTTimeline";
import Status from "components/status";
import styled, { css } from "styled-components";
import {
  card_border,
  text_dark_major,
  text_dark_minor,
} from "styles/textStyles";
import NftInfo from "components/nftInfo";
import { ssrNextApi as nextApi } from "services/nextApi";
import IpfsLink from "components/ipfsLink";
import SquareBoxComponent from "components/squareBox";
import Thumbnail from "components/nft/thumbnail";
import NftName from "components/nft/name";
import NftImage from "components/nft/nftImage";
import NoData from "components/table/noData";
import Preview from "components/nft/preview";
import { useOnClickOutside } from "utils/hooks";
import { shadow_100 } from "styles/shadows";
import NftLink from "components/nft/nftLink";
import PageNotFound from "components/pageNotFound";

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

const TextDark = styled.span`
  ${text_dark_major};
`;

const TextDarkMinor = styled.span`
  ${text_dark_minor};
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

const BgWhite = styled.div`
  background-color: white;
  padding: 8px;
  ${shadow_100};
  border-radius: 8px;
`;

export default function NftClass({ node, nftClass, nftInstances }) {
  const [showModal, setShowModal] = useState(false);
  const [previewNFTInstance, setPreviewNFTInstance] = useState(null);
  const ref = useRef();

  useOnClickOutside(ref, (event) => {
    // exclude manually
    if (document?.querySelector(".modal")?.contains(event.target)) {
      return;
    }
    setShowModal(false);
  });

  if (!nftClass) {
    return (
      <Layout node={node}>
        <PageNotFound resource="NFT class"/>
      </Layout>
    );
  }

  const tab = null;

  const tabTableData = [
    {
      name: "Instance",
      page: nftInstances?.page,
      total: nftInstances?.total,
      head: NFTClassInstanceHead,
      body: (nftInstances?.items || []).map((instance, index) => [
        <NftLink
          key={`id${index}`}
          nftClass={nftClass}
          nftInstance={instance}
        >
          {instance.instanceId}
        </NftLink>,
        <Thumbnail
          imageThumbnail={
            (instance?.nftMetadata?.recognized === false) ? null :
              (instance?.nftMetadata?.imageThumbnail ??
                nftClass?.nftMetadata?.imageThumbnail)
          }
          key={`thumbnail${index}`}
          onClick={() => {
            setPreviewNFTInstance(instance);
            setShowModal(true);
          }}
          background={
            instance.nftMetadata?.imageMetadata?.background ??
            nftClass?.nftMetadata?.imageMetadata?.background
          }
        />,
        <NftLink
          key={`name-${index}`}
          nftClass={nftClass}
          nftInstance={instance}
        >
          <NftName
            name={instance.nftMetadata?.name ?? nftClass?.nftMetadata?.name}
          />
        </NftLink>,
        <TextDarkMinor key={`time-${index}`}>
          {time(instance.indexer?.blockTime)}
        </TextDarkMinor>,
        <AddressEllipsis
          key={`owner-${index}`}
          address={instance.details?.owner}
          to={`/account/${instance.details?.owner}`}
        />,
        <Status
          key={`status-${index}`}
          status={instance.details?.isFrozen ? "Frozen" : "Active"}
        />,
      ]),
      foot: (
        <Pagination
          page={nftInstances?.page}
          pageSize={nftInstances?.pageSize}
          total={nftInstances?.total}
        />
      ),
    },
    {
      name: "Timeline",
      total: nftClass?.timeline?.length,
      component: <Timeline data={nftClass?.timeline} node={node} />,
    },
    {
      name: "Attributes",
      total: nftClass?.attributes?.length ?? 0,
      component:
        nftClass?.attributes?.length > 0 ? (
          <DetailTable
            head={
              nftClass?.attributes?.map((attr, index) => `#${index + 1}`) ?? []
            }
            body={
              nftClass?.attributes?.map((attr, index) => {
                return (
                  <Row
                    key={`row${index}`}
                    isLast={index === nftClass?.attributes?.length - 1}
                  >
                    <RowItem>{hex2a(attr.key)}</RowItem>
                    <RowItem>{hex2a(attr.value)}</RowItem>
                  </Row>
                );
              }) ?? []
            }
          />
        ) : (
          <BgWhite>
            <NoData />
          </BgWhite>
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

  const status = nftClass?.details?.isFrozen ? "Frozen" : "Active";

  let imageCid;
  if (nftClass?.nftMetadata?.image?.startsWith("ipfs://")) {
    imageCid = nftClass?.nftMetadata?.image.split("/").pop();
  }

  return (
    <Layout node={node}>
      <div ref={ref}>
        <Preview
          open={showModal}
          nftClass={nftClass}
          nftInstance={previewNFTInstance}
          closeFn={() => {
            setShowModal(false);
          }}
        />
      </div>
      <Section>
        <div>
          <Nav
            data={[
              { name: "NFT", path: `/nft` },
              { name: `Class` },
              { name: `${nftClass?.classId}` },
            ]}
            node={node}
          />
          <Between>
            <div>
              <SquareBoxComponent background={nftClass?.nftMetadata?.background}>
                <NftImage nftMetadata={nftClass?.nftMetadata} />
              </SquareBoxComponent>
            </div>
            <DetailTable
              head={NFTClassHead}
              body={[
                <MinorText key="1">{nftClass?.classId}</MinorText>,
                <MinorText key="2">
                  {time(nftClass?.indexer?.blockTime)}
                </MinorText>,
                <MinorText key="3">{nftClass?.details?.instances}</MinorText>,
                <CopyText key="4" text={nftClass?.owner}>
                  <Address
                    address={nftClass?.details?.owner}
                    to={`/account/${nftClass?.details?.owner}`}
                  />
                </CopyText>,
                <CopyText key="5" text={nftClass?.details?.issuer}>
                  <Address
                    address={nftClass?.details?.issuer}
                    to={`/account/${nftClass?.details?.issuer}`}
                  />
                </CopyText>,
                <CopyText key="6" text={nftClass?.details?.admin}>
                  <Address
                    address={nftClass?.details?.admin}
                    to={`/account/${nftClass?.details?.admin}`}
                  />
                </CopyText>,
                <CopyText key="7" text={nftClass?.details?.freezer}>
                  <Address
                    address={nftClass?.details?.freezer}
                    to={`/account/${nftClass?.details?.freezer}`}
                  />
                </CopyText>,
                status === "Frozen" ? (
                  <Status key="8" status={status} />
                ) : undefined,
                imageCid && (
                  <Ipfs key="9">
                    <span>IPFS</span>
                    <IpfsLink cid={imageCid} />
                  </Ipfs>
                ),
              ]}
              info={
                <NftInfo
                  data={{
                    title: nftClass?.nftMetadata?.name ?? "[Unrecognized]",
                    description: nftClass?.nftMetadata?.description ?? "-",
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
          query={["nftClass"]}
        />
      </Section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const node = process.env.NEXT_PUBLIC_CHAIN;
  const { nftClass: classId, page } = context.query;
  const nPage = parseInt(page) || 1;

  const [
    { result: nftClass },
    { result: nftInstances }
  ] = await Promise.all([
    nextApi.fetch(`nft/classes/${classId}`),
    nextApi.fetch(
      `nft/classes/${classId}/instances`,
      { page: nPage - 1, pageSize: 25 }
    ),
  ]);

  return {
    props: {
      node,
      nftClass: nftClass ?? null,
      nftInstances: nftInstances ?? EmptyQuery,
    },
  };
}
