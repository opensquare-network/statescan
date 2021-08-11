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
import { makeEventArgs } from "utils/eventArgs";

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

const toArray = (obj) => Array.isArray(obj) ? obj : [obj];

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
      body: (blockExtrinsics?.items || []).map((item) => [
        <InLink
          to={`/${node}/extrinsic/${item?.indexer?.blockHeight}-${item?.indexer?.index}`}
        >{`${item?.indexer?.blockHeight}-${item?.indexer?.index}`}</InLink>,
        <HashEllipsis
          hash={item?.hash}
          to={`/${node}/extrinsic/${item?.hash}`}
        />,
        <MinorText>
          <Result isSuccess={item?.isSuccess} />
        </MinorText>,
        <BreakText>{`${item?.section}(${item?.name})`}</BreakText>,
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
      body: (blockEvents?.items || []).map((item) => [
        <InLink
          to={`/${node}/event/${item?.indexer?.blockHeight}-${item?.sort}`}
        >{`${item?.indexer?.blockHeight}-${item?.sort}`}</InLink>,
        Number.isInteger(item?.phase?.value) ? (
          <InLink
            to={`/${node}/extrinsic/${item?.indexer.blockHeight}-${item?.phase?.value}`}
          >{`${item?.indexer?.blockHeight}-${item?.phase?.value}`}</InLink>
        ) : (
          "-"
        ),
        <BreakText>{`${item?.section}(${item?.method})`}</BreakText>,
        makeEventArgs(node, item),
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
        switch(itemName) {
          case "changesTrieRoot": {
            itemFields = ["Hash"];
            break;
          }
          case "preRuntime": case "consensus": case "seal": {
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
          `${blockDetail?.header?.number}-${i}`,
          blockDetail?.header?.number,
          <span style={{ textTransform: "capitalize" }}>
            {itemName}
          </span>,
          makeTablePairs(
            itemFields,
            toArray(item[itemName]),
          ),
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
              <FlexWrapper>
                <MinorText>{time(blockDetail?.blockTime)}</MinorText>
                <AccessoryText>
                  {blockDetail?.blockTime &&
                    timeDuration(blockDetail?.blockTime)}
                </AccessoryText>
              </FlexWrapper>,
              "Finalized",
              <CopyText text={blockDetail?.hash}>
                <BreakText>
                  <MinorText>
                    <MonoText>{blockDetail?.hash}</MonoText>
                  </MinorText>
                </BreakText>
              </CopyText>,
              <BreakText>
                <MinorText>
                  <MonoText>
                    <InLink
                      to={`/${node}/block/${(
                        Number.parseInt(id) - 1
                      ).toString()}`}
                    >
                      {blockDetail?.header?.parentHash}
                    </InLink>
                  </MonoText>
                </MinorText>
              </BreakText>,
              <BreakText>
                <MinorText>
                  <MonoText>{blockDetail?.header?.stateRoot}</MonoText>
                </MinorText>
              </BreakText>,
              <BreakText>
                <MinorText>
                  <MonoText>{blockDetail?.header?.extrinsicsRoot}</MonoText>
                </MinorText>
              </BreakText>,
              blockDetail?.author ? (
                <CopyText text={blockDetail?.author}>
                  <Address address={blockDetail?.author} to={`/${node}/account/${blockDetail?.author}`} />
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
  const { node, id } = context.params;
  const { tab, page, event } = context.query;

  const nPage = parseInt(page) || 1;
  const activeTab = tab ?? "extrinsics";

  const [
    { result: blockDetail },
    { result: blockEvents },
    { result: blockExtrinsics },
  ] = await Promise.all([
    nextApi.fetch(`${node}/blocks/${id}`),
    nextApi.fetch(`${node}/blocks/${id}/events`, {
      page: activeTab === "events" ? nPage - 1 : 0,
    }),
    nextApi.fetch(`${node}/blocks/${id}/extrinsics`, {
      page: activeTab === "extrinsics" ? nPage - 1 : 0,
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
