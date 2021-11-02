import Layout from "components/layout";
import Nav from "components/nav";
import CopyText from "components/copyText";
import { getNFTClassHead, NFTClassInstanceHead } from "utils/constants";
import DetailTable from "components/detailTable";
import Section from "components/section";
import MinorText from "components/minorText";
import AddressEllipsis from "components/addressEllipsis";
import { bigNumber2Locale, fromAssetUnit, time } from "utils";
import InLink from "components/inLink";
import Address from "components/address";
import TabTable from "components/tabTable";
import Pagination from "components/pagination";
import Timeline from "components/timeline/NFTTimeline";
import Status from "components/status";
import styled from "styled-components";
import { card_border } from "../../../styles/textStyles";
import NftInfo from "../../../components/nftInfo";
import { ssrNextApi as nextApi } from "../../../services/nextApi";

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
  const classInstances = {
    total: 2,
    items: [
      {
        id: 1,
        class: "/imgs/icons/nft.png",
        name: "Elementum amet, duis tellus",
        createdTime: "2021-10-25 20:12:00",
        owner: "EPk1wv1TvVFfsiG73YLuLAtGacfPmojyJKvmifobBzUTxFv",
        instanceCount: 10,
        status: "Active",
      },
      {
        id: 2,
        class: "/imgs/icons/nft.png",
        name: "Elementum amet, duis tellus",
        createdTime: "2021-10-25 20:12:00",
        owner: "EPk1wv1TvVFfsiG73YLuLAtGacfPmojyJKvmifobBzUTxFv",
        instanceCount: 10,
        status: "Frozen",
      },
    ],
  };
  const assetHolders = {};
  const asset = {};
  const tab = {};

  const tabTableData = [
    {
      name: "Instance",
      page: classInstances?.page,
      total: classInstances?.total,
      head: NFTClassInstanceHead,
      body: (classInstances?.items || []).map((instance, index) => [
        <InLink key={`id${index}`} to={`/nft/classes/${instance.id}`}>
          {instance.id}
        </InLink>,
        <img width={32} key={`class${index}`} src={instance.class} alt="" />,
        instance.name,
        instance.createdTime,
        <AddressEllipsis
          key={`owner-${index}`}
          address={instance.owner}
          to={`/account/${instance.owner}`}
        />,
        <Status key={`status-${index}`} status={instance.status} />,
      ]),
      foot: (
        <Pagination
          page={classInstances?.page}
          pageSize={classInstances?.pageSize}
          total={classInstances?.total}
        />
      ),
    },
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
            data={[{ name: "NFT", path: `/nfts` }, { name: "Class 1" }]}
            node={node}
          />
          <Between>
            <img src="/imgs/nftClass.png" width={480} alt="" />
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
                <MinorText key="8">{classInstances?.total}</MinorText>,
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
  const { id: classId } = context.query;
  const { result: NFTClass } = await nextApi.fetch(`nftclasses/${classId}`);
  const { result: NFTInstances } = await nextApi.fetch(
    `nftclasses/${classId}/instances`
  );

  return {
    props: {
      node,
      NFTClass,
      NFTInstances: NFTInstances ?? [],
    },
  };
}
