import Layout from "components/layout";
import Nav from "components/nav";
import CopyText from "components/copyText";
import { getNFTClassHead, getNFTClassInstanceHead, NFTClassInstanceHead } from "utils/constants";
import DetailTable from "components/detailTable";
import Section from "components/section";
import MinorText from "components/minorText";
import { bigNumber2Locale, fromAssetUnit, time } from "utils";
import Address from "components/address";
import TabTable from "components/tabTable";
import Timeline from "components/timeline/NFTTimeline";
import Status from "components/status";
import styled from "styled-components";
import { card_border } from "styles/textStyles";
import NftInfo from "components/nftInfo";
import { ssrNextApi as nextApi } from "services/nextApi";
import IpfsLink from "../../../../../components/ipfsLink";
import Image from "next/image";
import NFTUnrecognizedSvg from  "public/imgs/nft-unrecognized.svg";

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

export default function NftClass({node,NFTInstance,  instanceId, }) {
  const tab = {};
  const tabTableData = [
    {
      name: "Timeline",
      total: NFTInstance?.timeline?.length,
      component: <Timeline data={NFTInstance?.timeline} node={node}/>,
    },
  ];

  let status = "Active";
  if (NFTInstance?.details?.isFrozen) {
    status = "Frozen";
  }
  if (NFTInstance.destroyedAt) {
    status = "Destroyed";
  }

  return (
    <Layout node={node}>
      <Section>
        <div>
          <Nav
            data={[
              {name: "NFT Classes", path: `/nfts`},
              {
                name: ` ${NFTInstance.classId}`,
                path: `/nft/classes/${NFTInstance.classId}`,
              },
              {name: `Instances`},
              {name: instanceId},
            ]}
            node={node}
          />
          <Between>
            {NFTInstance?.ipfsMetadata?.image ? <Image
              src={`https://cloudflare-ipfs.com/ipfs/${NFTInstance?.ipfsMetadata?.image.replace('ipfs://ipfs/', '')}`}
              width={NFTInstance?.ipfsMetadata?.imageMetadata?.width ?? 480}
              height={NFTInstance?.ipfsMetadata?.imageMetadata.height ?? 480}
              alt=""
              placeholder="blur"
              blurDataURL={NFTInstance?.ipfsMetadata?.imageThumbnail}
            /> : <NFTUnrecognizedSvg width="100%" height="100%" viewBox="0 0 480 480"/>
            }
            <DetailTable
              head={["ClassId", ...getNFTClassInstanceHead(status)]}
              body={[
                <MinorText key="1">{NFTInstance?.classId}</MinorText>,
                <MinorText key="1">{NFTInstance?.instanceId}</MinorText>,
                <MinorText key="2">
                  {time(NFTInstance?.indexer?.blockTime)}
                </MinorText>,
                <CopyText key="4" text={NFTInstance?.details?.owner}>
                  <Address
                    address={NFTInstance?.details?.owner}
                    to={`/account/${NFTInstance?.details?.owner}`}
                  />
                </CopyText>,
                <CopyText key="5" text={NFTInstance?.details?.owner}>
                  <Address
                    address={NFTInstance?.details?.owner}
                    to={`/account/${NFTInstance?.details?.owner}`}
                  />
                </CopyText>,
                <Ipfs key="7">
                  <span>IPFS</span>
                  <IpfsLink cid={NFTInstance?.ipfsMetadata?.image?.replace('ipfs://ipfs/', '')}/>
                </Ipfs>,
                ...(status === "Active"
                  ? []
                  : [<Status key="6" status={status}/>]),
              ]}
              info={
                <NftInfo
                  data={{
                    title: "Elementum amet, duis tellus",
                    description:
                      "Massa risus faucibus ut neque justo, quis magna rhoncus, rhoncus.",
                  }}
                />
              }
            />
          </Between>
        </div>
        <TabTable data={tabTableData} activeTab={tab} collapse={900}/>
      </Section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const node = process.env.NEXT_PUBLIC_CHAIN;
  const {nftClass: classId, id: instanceId} = context.query;
  const {result: NFTInstance} = await nextApi.fetch(`nftclasses/${classId}/instances/${instanceId}`);
  return {
    props: {
      node,
      NFTInstance,
      instanceId,
    },
  };
}
