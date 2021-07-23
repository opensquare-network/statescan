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

import { timeDuration, time, makeTablePairs } from "utils";
import {
  blockHead,
  blockExtrinsicsHead,
  blockEventsHead,
  EmptyQuery,
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

  const tabTableData = [
    {
      name: "Extrinsics",
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
      total: blockEvents?.total,
      head: blockEventsHead,
      body: (blockEvents?.items || []).map((item) => [
        `${item?.indexer?.blockHeight}-${item?.sort}`,
        Number.isInteger(item?.phase?.value) ? (
          <InLink
            to={`/${node}/extrinsic/${item?.indexer.blockHeight}-${item?.phase?.value}`}
          >{`${item?.indexer?.blockHeight}-${item?.phase?.value}`}</InLink>
        ) : (
          "-"
        ),
        <BreakText>{`${item?.section}(${item?.method})`}</BreakText>,
        makeTablePairs(
          ["Docs", ...item.meta.args],
          [item.meta.documentation?.join("") || "", ...item.data]
        ),
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
              "-",
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
                <BreakText>
                  <CopyText text={blockDetail?.author}>
                    <MonoText>
                      <InLink to={`/${node}/account/${blockDetail?.author}`}>
                        {blockDetail?.author}
                      </InLink>
                    </MonoText>
                  </CopyText>
                </BreakText>
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
    nextApi.fetch(`${node}/blocks/${id}/events`, { page: nPage - 1 }),
    nextApi.fetch(`${node}/blocks/${id}/extrinsics`, { page: nPage - 1 }),
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
