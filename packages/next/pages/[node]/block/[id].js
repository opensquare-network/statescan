import styled from "styled-components";

import nextApi from "services/nextApi";
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

import { timeDuration, time } from "utils";
import {
  blockHead,
  blockExtrinsicsHead,
  blockEventsHead,
} from "utils/constants";

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
  blockDetail,
  blockEvents,
  blockExtrinsics,
}) {
  const tabTableData = [
    {
      name: "Extrinsics",
      total: blockExtrinsics?.total,
      head: blockExtrinsicsHead,
      body: (blockExtrinsics?.items || []).map((item) => [
        <InLink
          to={`/${node}/extrinsic/${item?.indexer?.blockHeight}-${item?.indexer?.index}`}
        >{`${item?.indexer?.blockHeight}-${item?.indexer?.index}`}</InLink>,
        <InLink to={`/${node}/extrinsic/${item?.hash}`}>
          <HashEllipsis hash={item?.hash} />
        </InLink>,
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
        item.data,
      ]),
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
    <Layout>
      <Section>
        <div>
          <Nav data={[{ name: "Block" }, { name: id }]} />
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
                  <MinorText>{blockDetail?.hash}</MinorText>
                </BreakText>
              </CopyText>,
              <BreakText>
                <MinorText>
                  <InLink
                    to={`/${node}/block/${(
                      Number.parseInt(id) - 1
                    ).toString()}`}
                  >
                    {blockDetail?.header?.parentHash}
                  </InLink>
                </MinorText>
              </BreakText>,
              <BreakText>
                <MinorText>{blockDetail?.header?.stateRoot}</MinorText>
              </BreakText>,
              <BreakText>
                <MinorText>{blockDetail?.header?.extrinsicsRoot}</MinorText>
              </BreakText>,
              blockDetail?.author ? (
                <BreakText>
                  <CopyText text={blockDetail?.author}>
                    <InLink to={`/${node}/address/${blockDetail?.author}`}>
                      {blockDetail?.author}
                    </InLink>
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
  const { tab, page } = context.query;

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
      blockDetail: blockDetail ?? null,
      blockEvents: blockEvents ?? [],
      blockExtrinsics: blockExtrinsics ?? [],
    },
  };
}
