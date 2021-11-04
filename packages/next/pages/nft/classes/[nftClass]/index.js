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
import { card_border } from "styles/textStyles";
import NftInfo from "components/nftInfo";
import { ssrNextApi as nextApi } from "services/nextApi";

const Between = styled.div`
  margin-bottom: 16px;
  padding: 24px;
  display: flex;
  ${card_border};
  background: white;

  > div {
    margin-left: 16px;
    flex-grow: 1;
    border: none;
    box-shadow: none;
  }
  
  img {
    object-fit: contain;
  }
`;

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
        <img width={32} key={`class${index}`} src={
          instance?.ipfsMetadata?.imageThumbnail ?? (
            `https://ipfs-sh.decoo-cloud.cn/ipfs/${NFTClass?.ipfsMetadata?.image.replace('ipfs://ipfs/', '')}` ?? "/imgs/icons/nft.png"
          )
        }
             alt=""/>,
        instance?.ipfsMetadata?.name ?? (NFTClass?.ipfsMetadata?.name ?? "unrecognized"),
        time(instance?.indexer?.blockTime),
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
            data={[{name: "NFT", path: `/nfts`}, {name: "Class 1"}]}
            node={node}
          />
          <Between>
            <img
              src={`https://ipfs-sh.decoo-cloud.cn/ipfs/${NFTClass?.ipfsMetadata?.image.replace('ipfs://ipfs/', '')}`}
              width={480} alt=""/>
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
                <Status key="6" status={status}/>
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
  const {nftClass: classId , page} = context.query;
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
