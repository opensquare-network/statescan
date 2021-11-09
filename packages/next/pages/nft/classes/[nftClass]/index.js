import Layout from "components/layout";
import Nav from "components/nav";
import CopyText from "components/copyText";
import { getNFTClassHead, NFTClassInstanceHead } from "utils/constants";
import DetailTable from "components/detailTable";
import Section from "components/section";
import MinorText from "components/minorText";
import AddressEllipsis from "components/addressEllipsis";
import { time } from "utils";
import InLink from "components/inLink";
import Address from "components/address";
import TabTable from "components/tabTable";
import Pagination from "components/pagination";
import Timeline from "components/timeline/NFTTimeline";
import Status from "components/status";
import styled from "styled-components";
import { card_border, text_dark_major, text_dark_minor } from "styles/textStyles";
import NftInfo from "components/nftInfo";
import { ssrNextApi as nextApi } from "services/nextApi";
import Image from "next/image";
import IpfsLink from "components/ipfsLink";
import SquareBoxComponent from "components/squareBox";

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

const ImgWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #555555;
`

const ThumbnailContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 32px;
  height: 32px;
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
`

const TextDarkMinor = styled.span`
  ${text_dark_minor};
`

export default function NftClass({node, NFTClass, NFTInstances}) {
  const tab = {};

  const tabTableData = [
    {
      name: "Instance",
      page: NFTInstances?.page,
      total: NFTInstances?.total,
      head: NFTClassInstanceHead,
      body: (NFTInstances?.items || []).map((instance, index) => [
        <InLink
          key={`id${index}`}
          to={`/nft/classes/${NFTClass.classId}/instances/${instance.instanceId}`}
        >
          {instance.instanceId}
        </InLink>,
        <ThumbnailContainer key={`class${index}`}>
          <img
            width={32}
            src={
              instance?.ipfsMetadata?.imageThumbnail ?? (
                `https://cloudflare-ipfs.com/ipfs/${NFTClass?.ipfsMetadata?.image.replace('ipfs://ipfs/', '')}` ?? "/imgs/icons/nft.png"
              )
            }
            alt=""
          />
        </ThumbnailContainer>,
        <TextDark key={`name-${index}`}>{instance?.ipfsMetadata?.name ?? (NFTClass?.ipfsMetadata?.name ?? "unrecognized")}</TextDark>,
        <TextDarkMinor key={`time-${index}`}>{time(instance?.indexer?.blockTime)}</TextDarkMinor>,
        <AddressEllipsis
          key={`owner-${index}`}
          address={instance?.details?.owner}
          to={`/account/${instance?.details?.owner}`}
        />,
        <Status key={`status-${index}`} status={instance?.details?.isFrozen ? "Frozen" : "Active"}/>,
      ]),
      foot: (
        <Pagination
          page={NFTInstances?.page}
          pageSize={NFTInstances?.pageSize}
          total={NFTInstances?.total}
        />
      ),
    },
    {
      name: "Timeline",
      total: NFTClass?.timeline?.length,
      component: <Timeline data={NFTClass?.timeline} node={node}/>,
    },
  ];

  const status = NFTClass?.details?.isFrozen ? "Frozen" : "Active";

  return (
    <Layout node={node}>
      <Section>
        <div>
          <Nav
            data={[
              {name: "NFT", path: `/nfts`},
              {name: `Class`},
              {name: `${NFTClass.classId}`},
            ]}
            node={node}
          />
          <Between>
            <div>
              <SquareBoxComponent>
                <ImgWrapper>
                  {NFTClass?.ipfsMetadata?.image && <Image
                    src={`https://cloudflare-ipfs.com/ipfs/${NFTClass?.ipfsMetadata?.image.replace('ipfs://ipfs/', '')}`}
                    width={NFTClass?.ipfsMetadata?.imageMetadata?.width ?? 480}
                    height={NFTClass?.ipfsMetadata?.imageMetadata.height ?? 480}
                    alt=""
                    placeholder="blur"
                    blurDataURL={NFTClass?.ipfsMetadata?.imageThumbnail}
                  />}
                </ImgWrapper>
              </SquareBoxComponent>
            </div>
            <DetailTable
              head={getNFTClassHead(status)}
              body={[
                <MinorText key="1">{NFTClass?.classId}</MinorText>,
                <MinorText key="2">
                  {time(NFTClass?.indexer?.blockTime)}
                </MinorText>,
                <MinorText key="3">{NFTClass?.details?.instances}</MinorText>,
                <CopyText key="4" text={NFTClass?.owner}>
                  <Address
                    address={NFTClass?.details?.owner}
                    to={`/account/${NFTClass?.details?.owner}`}
                  />
                </CopyText>,
                <CopyText key="5" text={NFTClass?.details?.issuer}>
                  <Address
                    address={NFTClass?.details?.issuer}
                    to={`/account/${NFTClass?.details?.issuer}`}
                  />
                </CopyText>,
                ...(status === "Frozen" ? [<Status key="6" status={status}/>] : []),
                <Ipfs key="7">
                  <span>IPFS</span>
                  <IpfsLink cid={NFTClass?.ipfsMetadata?.image.replace('ipfs://ipfs/', '')}/>
                </Ipfs>,
              ]}
              info={
                <NftInfo
                  data={{
                    title: NFTClass?.ipfsMetadata?.name ?? "Unrecognized",
                    description:
                      NFTClass?.ipfsMetadata?.description ?? "Unrecognized",
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
          query={{nftClass: NFTClass.classId}}
        />
      </Section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const node = process.env.NEXT_PUBLIC_CHAIN;
  const {nftClass: classId, page} = context.query;
  const nPage = parseInt(page) || 1;
  const {result: NFTClass} = await nextApi.fetch(`nftclasses/${classId}`);
  const {result: NFTInstances} = await nextApi.fetch(
    `nftclasses/${classId}/instances`,
    {page: nPage - 1},
  );

  return {
    props: {
      node,
      NFTClass: NFTClass ?? null,
      NFTInstances: NFTInstances ?? [],
    },
  };
}
