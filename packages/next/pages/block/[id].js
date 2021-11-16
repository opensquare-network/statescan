import styled from "styled-components";

import { ssrNextApi as nextApi } from "services/nextApi";
import Layout from "components/layout";
import Section from "components/section";
import Nav from "components/nav";
import DetailTable from "components/detailTable";
import MinorText from "components/minorText";
import CopyText from "components/copyText";
import TabTable from "components/tabTable";
import BreakText from "components/breakText";
import InLink from "components/inLink";
import Result from "components/result";
import Pagination from "components/pagination";
import HashEllipsis from "components/hashEllipsis";
import MonoText from "components/monoText";
import Address from "components/address";

import { timeDuration, time, makeTablePairs } from "utils";
import {
  blockHead,
  blockExtrinsicsHead,
  blockEventsHead,
  EmptyQuery,
  blockLogsHead,
} from "utils/constants";
import PageNotFound from "components/pageNotFound";

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;

  > :not(:first-child) {
    margin-left: 16px;
  }
`;

const AccessoryText = styled.div`
  color: rgba(17, 17, 17, 0.35);
`;

const toArray = (obj) => (Array.isArray(obj) ? obj : [obj]);

export default function Block({
  node,
  id,
  tab,
  event,
  blockDetail,
  blockEvents,
  blockExtrinsics,
}) {
  if (!blockDetail) {
    return (
      <Layout node={node}>
        <PageNotFound />
      </Layout>
    );
  }

  const expand = (blockEvents?.items || []).findIndex(
    (item) => `${item?.indexer?.blockHeight}-${item?.sort}` === event
  );

  const blockLogs = blockDetail?.header?.digest?.logs;

  const tabTableData = [
    {
      name: "Extrinsics",
      page: blockExtrinsics?.page,
      total: blockExtrinsics?.total,
      head: blockExtrinsicsHead,
      type: "extrinsic",
      body: (blockExtrinsics?.items || []).map((item, index) => [
        <InLink
          key={`${index}-1`}
          to={`/extrinsic/${item?.indexer?.blockHeight}-${item?.indexer?.index}`}
        >{`${item?.indexer?.blockHeight.toLocaleString()}-${
          item?.indexer?.index
        }`}</InLink>,
        <HashEllipsis
          key={`${index}-2`}
          hash={item?.hash}
          to={`/extrinsic/${item?.hash}`}
        />,
        <MinorText key={`${index}-3`}>
          <Result isSuccess={item?.isSuccess} />
        </MinorText>,
        <BreakText
          key={`${index}-4`}
        >{`${item?.section}(${item?.name})`}</BreakText>,
        item.args,
      ]),
      foot: (
        <Pagination
          page={blockExtrinsics?.page}
          pageSize={blockExtrinsics?.pageSize}
          total={blockExtrinsics?.total}
        />
      ),
    },
    {
      name: "Events",
      page: blockEvents?.page,
      total: blockEvents?.total,
      head: blockEventsHead,
      type: "event",
      body: (blockEvents?.items || []).map((item, index) => [
        <InLink
          key={`${index}-1`}
          to={`/event/${item?.indexer?.blockHeight}-${item?.sort}`}
        >{`${item?.indexer?.blockHeight.toLocaleString()}-${
          item?.sort
        }`}</InLink>,
        Number.isInteger(item?.phase?.value) ? (
          <InLink
            to={`/extrinsic/${item?.indexer.blockHeight}-${item?.phase?.value}`}
          >{`${item?.indexer?.blockHeight.toLocaleString()}-${
            item?.phase?.value
          }`}</InLink>
        ) : (
          "-"
        ),
        <BreakText
          key={`${index}-2`}
        >{`${item?.section}(${item?.method})`}</BreakText>,
        item,
      ]),
      expand,
      foot: (
        <Pagination
          page={blockEvents?.page}
          pageSize={blockEvents?.pageSize}
          total={blockEvents?.total}
        />
      ),
    },
    {
      name: "Logs",
      head: blockLogsHead,
      total: blockLogs?.length,
      body: (blockLogs || []).map((item, i) => {
        const [itemName] = Object.keys(item);

        let itemFields = [];
        switch (itemName) {
          case "changesTrieRoot": {
            itemFields = ["Hash"];
            break;
          }
          case "preRuntime":
          case "consensus":
          case "seal": {
            itemFields = ["Engine", "Data"];
            break;
          }
          case "changesTrieSignal": {
            itemFields = ["ChangesTrieSignal"];
            break;
          }
          case "other": {
            itemFields = ["Data"];
            break;
          }
        }

        return [
          `${blockDetail?.header?.number.toLocaleString()}-${i}`,
          blockDetail?.header?.number.toLocaleString(),
          <span key="1" style={{ textTransform: "capitalize" }}>
            {itemName}
          </span>,
          makeTablePairs(itemFields, toArray(item[itemName])),
        ];
      }),
      expand,
    },
  ];

  return (
    <Layout node={node}>
      <Section>
        <div>
          <Nav
            data={[{ name: "Block" }, { name: blockDetail?.header?.number }]}
            node={node}
          />
          <DetailTable
            head={blockHead}
            body={[
              <FlexWrapper key="1">
                <MinorText>{time(blockDetail?.blockTime)}</MinorText>
                <AccessoryText>
                  {blockDetail?.blockTime &&
                    timeDuration(blockDetail?.blockTime)}
                </AccessoryText>
              </FlexWrapper>,
              "Finalized",
              <CopyText key="2" text={blockDetail?.hash}>
                <BreakText>
                  <MinorText>
                    <MonoText>{blockDetail?.hash}</MonoText>
                  </MinorText>
                </BreakText>
              </CopyText>,
              <BreakText key="3">
                <MinorText>
                  <MonoText>
                    <InLink
                      to={`/block/${(Number.parseInt(id) - 1).toString()}`}
                    >
                      {blockDetail?.header?.parentHash}
                    </InLink>
                  </MonoText>
                </MinorText>
              </BreakText>,
              <BreakText key="4">
                <MinorText>
                  <MonoText>{blockDetail?.header?.stateRoot}</MonoText>
                </MinorText>
              </BreakText>,
              <BreakText key="5">
                <MinorText>
                  <MonoText>{blockDetail?.header?.extrinsicsRoot}</MonoText>
                </MinorText>
              </BreakText>,
              blockDetail?.author ? (
                <CopyText text={blockDetail?.author}>
                  <Address
                    address={blockDetail?.author}
                    to={`/account/${blockDetail?.author}`}
                  />
                </CopyText>
              ) : (
                "-"
              ),
            ]}
          />
        </div>
        <TabTable data={tabTableData} activeTab={tab} collapse={900} />
      </Section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const node = process.env.NEXT_PUBLIC_CHAIN;
  const { id } = context.params;
  const { tab, page, event } = context.query;

  const nPage = parseInt(page) || 1;
  const activeTab = tab ?? "extrinsics";

  const [
    { result: blockDetail },
    { result: blockEvents },
    { result: blockExtrinsics },
  ] = await Promise.all([
    nextApi.fetch(`blocks/${id}`),
    nextApi.fetch(`blocks/${id}/events`, {
      page: activeTab === "events" ? nPage - 1 : 0,
      pageSize: 25,
    }),
    nextApi.fetch(`blocks/${id}/extrinsics`, {
      page: activeTab === "extrinsics" ? nPage - 1 : 0,
      pageSize: 25
    }),
  ]);

  return {
    props: {
      node,
      id,
      tab: activeTab,
      event: event ?? null,
      blockDetail: blockDetail ?? null,
      blockEvents: blockEvents ?? EmptyQuery,
      blockExtrinsics: blockExtrinsics ?? EmptyQuery,
    },
  };
}
