import Layout from "components/layout";
import Nav from "components/nav";
import CopyText from "components/copyText";
import { NFTInstanceHead } from "utils/constants";
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

  ${props => !props.isLast && css`
    padding-bottom: 24px;
    margin-bottom: 24px;
    border-bottom: 1px solid #F8F8F8;
  `};
`
const RowItem = styled.div`
  width: 100%;
  line-height: 20px;
`

export default function NftClass({node, NFTClass, NFTInstance}) {
  const tab = {};
  const nftMetadata = NFTInstance?.nftMetadata ? NFTInstance.nftMetadata : NFTClass?.nftMetadata;
  const tabTableData = [
    {
      name: "Timeline",
      total: NFTInstance?.timeline?.length,
      component: <Timeline data={NFTInstance?.timeline} node={node}/>,
    },
    {
      name: "Attributes",
      total: NFTInstance?.attributes?.length,
      component: NFTInstance?.attributes?.length > 0 ? <DetailTable
        head={NFTInstance?.attributes?.map((attr, index) => `#${index + 1}`) ?? []}
        body={NFTInstance?.attributes?.map((attr, index) => {
          return <Row key={`row${index}`} isLast={index === NFTInstance?.attributes?.length - 1}>
            <RowItem>{hex2a(attr.key)}</RowItem>
            <RowItem>{hex2a(attr.value)}</RowItem>
          </Row>
        }) ?? []}
      /> : <NoData/>,
    },
  ];

  function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }

  let status = "Active";
  if (NFTInstance?.details?.isFrozen) {
    status = "Frozen";
  }
  if (NFTInstance.destroyedAt) {
    status = "Destroyed";
  }

  let imageCid;
  if (nftMetadata?.image?.startsWith("ipfs://")) {
    imageCid = nftMetadata?.image.split("/").pop();
  }

  return (
    <Layout node={node}>
      <Section>
        <div>
          <Nav
            data={[
              {name: "NFT", path: `/nft`},
              {
                name: `Class ${NFTInstance.classId}`,
                path: `/nft/classes/${NFTInstance.classId}`,
              },
              {name: `Instance`},
              {name: NFTInstance?.instanceId},
            ]}
            node={node}
          />
          <Between>
            <div>
              <SquareBoxComponent>
                <NFTImage nftMetadata={nftMetadata}/>
              </SquareBoxComponent>
            </div>
            <DetailTable
              head={["ClassId", ...NFTInstanceHead]}
              body={[
                <MinorText key="1">{NFTInstance?.classId}</MinorText>,
                <MinorText key="2">{NFTInstance?.instanceId}</MinorText>,
                <MinorText key="3">
                  {time(NFTInstance?.indexer?.blockTime)}
                </MinorText>,
                <CopyText key="4" text={NFTInstance?.details?.owner}>
                  <Address
                    address={NFTInstance?.details?.owner}
                    to={`/account/${NFTInstance?.details?.owner}`}
                  />
                </CopyText>,
                status === "Active"
                  ? undefined
                  : <Status key="6" status={status}/>,
                imageCid && (
                  <Ipfs key="7">
                    <span>IPFS</span>
                    <IpfsLink cid={imageCid}/>
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
        <TabTable data={tabTableData} activeTab={tab} collapse={900} query={{nftClass: NFTInstance.classId}}/>
      </Section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const node = process.env.NEXT_PUBLIC_CHAIN;
  const {nftClass: classId, id: instanceId} = context.query;
  const {result: NFTClass} = await nextApi.fetch(`nftclasses/${classId}`);
  const {result: NFTInstance} = await nextApi.fetch(`nftclasses/${classId}/instances/${instanceId}`);
  return {
    props: {
      node,
      NFTClass,
      NFTInstance,
    },
  };
}
