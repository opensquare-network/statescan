import Layout from "components/layout";
import Nav from "components/nav";
import { getSymbol } from "utils/hooks";
import {
  assetTransfersHead,
  assetHoldersHead,
  EmptyQuery,
  getAssetHead,
  getNFTClassHead,
  NFTClassInstanceHead,
} from "utils/constants";
import DetailTable from "components/detailTable";
import Section from "components/section";
import MinorText from "components/minorText";
import AddressEllipsis from "components/addressEllipsis";
import { bigNumber2Locale, fromAssetUnit, fromSymbolUnit } from "utils";
import InLink from "components/inLink";
import Address from "components/address";
import TabTable from "components/tabTable";
import Pagination from "components/pagination";
import Tooltip from "components/tooltip";
import Timeline from "components/timeline";
import { ssrNextApi as nextApi } from "services/nextApi";
import PageNotFound from "components/pageNotFound";
import AnalyticsChart from "components/analyticsChart";
import { getAssetInfo } from "utils/assetInfoData";
import AssetInfo from "components/assetInfo";
import Status from "components/status";
import styled from "styled-components";
import { card_border } from "../../../styles/textStyles";
import NftInfo from "../../../components/nftInfo";

const Between = styled.div`
  display: flex;
  padding: 24px;
  ${card_border};
  background: white;
  div {
    flex-grow: 1;
    border: none;
    box-shadow: none;
  }
`;

export default function NftClass({ node }) {
  const symbol = getSymbol(node);
  const assetTransfers = {};
  const assetHolders = {};
  const asset = {};
  const tab = {};

  const tabTableData = [
    {
      name: "Instance",
      page: assetTransfers?.page,
      total: assetTransfers?.total,
      head: NFTClassInstanceHead,
      body: (assetTransfers?.items || []).map((item, index) => [
        <InLink
          key={`${index}-1`}
          to={`/event/${item.indexer.blockHeight}-${item.eventSort}`}
        >
          {`${item.indexer.blockHeight}-${item.eventSort}`}
        </InLink>,
        <InLink
          key={`${index}-2`}
          to={`/extrinsic/${item.indexer.blockHeight}-${item.extrinsicIndex}`}
        >{`${item.indexer.blockHeight}-${item.extrinsicIndex}`}</InLink>,
        <Tooltip key={`${index}-3`} label={item.method} bg />,
        item.indexer.blockTime,
        <AddressEllipsis
          key={`${index}-4`}
          address={item?.from}
          to={`/account/${item?.from}`}
        />,
        <AddressEllipsis
          key={`${index}-5`}
          address={item?.to}
          to={`/account/${item?.to}`}
        />,
        item.assetSymbol
          ? `${bigNumber2Locale(
              fromAssetUnit(item.balance, item.assetDecimals)
            )} ${item.assetSymbol}`
          : `${bigNumber2Locale(
              fromSymbolUnit(item.balance, symbol)
            )} ${symbol}`,
      ]),
      foot: (
        <Pagination
          page={assetTransfers?.page}
          pageSize={assetTransfers?.pageSize}
          total={assetTransfers?.total}
        />
      ),
    },
    {
      name: "Timeline",
      total: asset?.timeline?.length,
      component: <Timeline data={asset?.timeline} node={node} asset={asset} />,
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
                <MinorText key="1">{asset?.symbol}</MinorText>,
                <MinorText key="2">{asset?.name}</MinorText>,
                <MinorText key="3">{`#${asset?.assetId}`}</MinorText>,
                <Address
                  key="4"
                  address={asset?.owner}
                  to={`/account/${asset?.owner}`}
                />,
                <Address
                  key="5"
                  address={asset?.issuer}
                  to={`/account/${asset?.issuer}`}
                />,
                `${bigNumber2Locale(
                  fromAssetUnit(asset?.supply, asset?.decimals)
                )} ${asset?.symbol}`,
                asset?.decimals,
                ...(status === "Active"
                  ? []
                  : [<Status key="6" status={status} />]),
                <MinorText key="7">{assetHolders?.total}</MinorText>,
                <MinorText key="8">{assetTransfers?.total}</MinorText>,
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

  return {
    props: {
      node,
    },
  };
}
