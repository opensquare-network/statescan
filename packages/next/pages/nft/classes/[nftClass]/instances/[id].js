import Layout from "components/layout";
import Nav from "components/nav";
import CopyText from "components/copyText";
import { NFTInstanceHead, NFTTransferHead, EmptyQuery } from "utils/constants";
import DetailTable from "components/detailTable";
import Section from "components/section";
import MinorText from "components/minorText";
import { time } from "utils";
import Address from "components/address";
import TabTable from "components/tabTable";
import Timeline from "components/timeline/NFTTimeline";
import Status from "components/status";
import styled, { css } from "styled-components";
import { card_border } from "styles/textStyles";
import NftInfo from "components/nftInfo";
import { ssrNextApi as nextApi } from "services/nextApi";
import IpfsLink from "../../../../../components/ipfsLink";
import NFTImage from "../../../../../components/nft/NFTImage";
import SquareBoxComponent from "../../../../../components/squareBox";
import NoData from "../../../../../components/table/noData";
import Thumbnail from "components/nft/thumbnail";
import AddressEllipsis from "components/addressEllipsis";
import NftName from "components/nft/name";
import { useRef, useState } from "react";
import Preview from "components/nft/preview";
import { Modal } from "semantic-ui-react";
import { useOnClickOutside } from "utils/hooks";
import Pagination from "components/pagination";
import InLink from "components/inLink";
import { text_dark_major, text_dark_minor } from "styles/textStyles";
import NftLink from "components/nft/nftLink";

const MyModal = styled(Modal)`
  > div {
    box-shadow: none;
    border: none;
  }

  padding: 24px;

  a {
    display: block;
    background-color: #000000;
    font-family: Inter,serif ;
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    line-height: 44px;
    color: #FFFFFF;
    text-align: center;
  }
`

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
`

const TextDarkMinor = styled.span`
  ${text_dark_minor};
`

export default function NftClass({ node, nftClass, nftInstance, nftTransfers }) {
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

  const name = (nftInstance.nftMetadata ?? nftClass.nftMetadata)?.name;
  const imageThumbnail = nftInstance.nftMetadata?.image
    ? nftInstance.nftMetadata.imageThumbnail
    : nftClass.nftMetadata?.imageThumbnail;
  const background = nftInstance.nftMetadata?.image
    ? nftInstance.nftMetadata.imageMetadata?.background
    : nftClass.nftMetadata?.imageMetadata?.background;

  const tab = {};
  const nftMetadata = nftInstance?.nftMetadata
    ? nftInstance?.nftMetadata
    : nftClass?.nftMetadata;
  const tabTableData = [
    {
      name: "Timeline",
      total: nftInstance?.timeline?.length,
      component: <Timeline data={nftInstance?.timeline} node={node} />,
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
      name: "NFT Transfer",
      page: nftTransfers?.page,
      total: nftTransfers?.total,
      head: NFTTransferHead,
      body: (nftTransfers?.items || []).map((item, index) => {
        return [
          <InLink
            key={index}
            to={`/extrinsic/${item.indexer.blockHeight}-${item.indexer.extrinsicIndex}`}
          >
            {`${item.indexer.blockHeight.toLocaleString()}-${item.indexer.extrinsicIndex}`}
          </InLink>,
          <NftLink
            key={`instance${index}`}
            nftClass={nftClass}
            nftInstance={nftInstance}
          >
            {`${item.classId}-${item.instanceId}`}
          </NftLink>,
          <TextDarkMinor key={`time-${index}`}>{time(item.indexer?.blockTime)}</TextDarkMinor>,
          <Thumbnail imageThumbnail={imageThumbnail} key={`thumbnail${index}`}
            onClick={() => {
              setPreviewNFTInstance(nftInstance);
              setShowModal(true);
            }}
            background={background}
          />,
          <TextDark key={`name-${index}`}>
            <NftLink
              nftClass={nftClass}
              nftInstance={nftInstance}
            >
              <NftName name={name} />
            </NftLink>
          </TextDark>,
          <AddressEllipsis key={`from-${index}`} address={item.from} to={`/account/${item.from}`} />,
          <AddressEllipsis key={`to-${index}`} address={item.to} to={`/account/${item.to}`} />,
        ];
      }),
      foot: (
        <Pagination
          page={nftTransfers?.page}
          pageSize={nftTransfers?.pageSize}
          total={nftTransfers?.total}
        />
      ),
    }
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

  return (
    <Layout node={node}>
      <div ref={ref}>
        <MyModal open={showModal} size="tiny">
          <Preview
            nftClass={previewNFTInstance?.class}
            nftInstance={previewNFTInstance}
            closeFn={()=>{setShowModal(false)}}
          />
        </MyModal>
      </div>

      <Section>
        <div>
          <Nav
            data={[
              { name: "NFT", path: `/nft` },
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
                <NFTImage nftMetadata={nftMetadata} />
              </SquareBoxComponent>
            </div>
            <DetailTable
              head={["ClassId", ...NFTInstanceHead]}
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
                    title: nftMetadata?.name ?? "[Unrecognized]",
                    description: nftMetadata?.description ?? "-",
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
          query={{ nftClass: nftInstance?.classId }}
        />
      </Section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const node = process.env.NEXT_PUBLIC_CHAIN;
  const { nftClass: classId, id: instanceId, page } = context.query;
  const nPage = parseInt(page) || 1;

  const [
    { result: nftClass },
    { result: nftInstance },
  ] = await Promise.all([
    nextApi.fetch(`nftclasses/${classId}`),
    nextApi.fetch(
      `nftclasses/${classId}/instances/${instanceId}`
    ),
  ]);
  if (!nftClass || !nftInstance) {
    return {
      props: {
        node,
        nftClass: null,
        nftInstance: null,
        nftTransfers: EmptyQuery,
      }
    };
  }

  const { classHeight, indexer: { blockHeight: instanceHeight } } = nftInstance;
  const [
    { result: nftTransfers },
  ] = await Promise.all([
    nextApi.fetch(
      `nftclasses/${classId}_${classHeight}/instances/${instanceId}_${instanceHeight}/transfers`,
      { page: nPage - 1, pageSize: 25 }
    ),
  ]);
  return {
    props: {
      node,
      nftClass: nftClass,
      nftInstance: nftInstance,
      nftTransfers: nftTransfers ?? EmptyQuery,
    },
  };
}
