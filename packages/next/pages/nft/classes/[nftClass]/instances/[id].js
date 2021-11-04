import Layout from "components/layout";
import Nav from "components/nav";
import CopyText from "components/copyText";
import { getNFTClassHead, NFTClassInstanceHead } from "utils/constants";
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

export default function NftClass({ node, NFTClass, NFTInstances }) {
  const assetHolders = {};
  const asset = {};
  const tab = {};

  const tabTableData = [
    {
      name: "Timeline",
      total: asset?.timeline?.length,
      component: <Timeline data={NFTClass?.timeline} node={node} />,
    },
  ];

  let status = "Active";
  if (asset.isFrozen) {
    status = "Frozen";
  }
  if (asset.destroyedAt) {
    status = "Destroyed";
  }

  return (
    <Layout node={node}>
      <Section>
        <div>
          <Nav
            data={[
              { name: "NFT Classes", path: `/nfts` },
              {
                name: ` ${NFTClass.classId}`,
                path: `/nft/classes/${NFTClass.classId}`,
              },
              { name: `Instances` },
              { name: `1` },
            ]}
            node={node}
          />
          <Between>
            <img src="/imgs/nftClass.png" width={480} alt="" />
            <DetailTable
              head={["ClassId", ...getNFTClassHead(status)]}
              body={[
                <MinorText key="1">{NFTClass?.classId}-1</MinorText>,
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
                <CopyText key="5" text={NFTClass?.details?.owner}>
                  <Address
                    address={NFTClass?.details?.owner}
                    to={`/account/${NFTClass?.details?.owner}`}
                  />
                </CopyText>,
                `${bigNumber2Locale(
                  fromAssetUnit(asset?.supply, asset?.decimals)
                )} ${asset?.symbol}`,
                asset?.decimals,
                ...(status === "Active"
                  ? []
                  : [<Status key="6" status={status} />]),
                <MinorText key="7">{assetHolders?.total}</MinorText>,
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
        <TabTable data={tabTableData} activeTab={tab} collapse={900} />
      </Section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const node = process.env.NEXT_PUBLIC_CHAIN;
  const { nftClass: classId } = context.query;
  // todo : query instance data (not ready yet)
  const { result: NFTClass } = await nextApi.fetch(`nftclasses/${classId}`);

  return {
    props: {
      node,
      NFTClass,
    },
  };
}
