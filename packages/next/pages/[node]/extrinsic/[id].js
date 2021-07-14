import styled from "styled-components";

import Layout from "components/layout";
import nextApi from "services/nextApi";
import Section from "components/section";
import Nav from "components/nav";
import DetailTable from "components/detailTable";
import {
  extrinsicHead,
  extrinsicTransferHead,
  extrinsicEventsHead,
} from "utils/constants";
import InLink from "components/inLink";
import CopyText from "components/copyText";
import Result from "components/result";
import MinorText from "components/minorText";
import { capitalize, objectFromEntries, time, timeDuration, zip } from "utils";
import TabTable from "components/tabTable";
import Pagination from "components/pagination";
import BreakText from "components/breakText";
import TransfersList from "components/transfersList";
import MonoText from "components/monoText";

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

export default function Extrinsic({
  node,
  tab,
  extrinsicDetail,
  extrinsicTransfer,
  extrinsicEvents,
}) {
  const tabTableData = [
    {
      name: "Events",
      total: extrinsicEvents?.total,
      head: extrinsicEventsHead,
      body: (extrinsicEvents?.items || []).map((item) => [
        `${item?.indexer?.blockHeight}-${item?.sort}`,
        `${item?.section}(${item?.method})`,
        objectFromEntries(
          zip(
            ["Docs", ...item.meta.args],
            [item.meta.documentation, ...item.data]
          )
        ),
      ]),
      foot: (
        <Pagination
          page={extrinsicEvents?.page}
          pageSize={extrinsicEvents?.pageSize}
          total={extrinsicEvents?.total}
        />
      ),
    },
  ];

  const hasTransfers = extrinsicTransfer?.length > 0;

  return (
    <Layout>
      <Section>
        <div>
          <Nav
            data={[
              { name: "Extrinsic" },
              {
                name: `${extrinsicDetail?.indexer?.blockHeight}-${extrinsicDetail?.indexer?.index}`,
              },
            ]}
          />
          <DetailTable
            head={hasTransfers ? extrinsicTransferHead : extrinsicHead}
            badge={
              hasTransfers
                ? [
                    null,
                    null,
                    null,
                    null,
                    null,
                    extrinsicTransfer?.length,
                    null,
                  ]
                : null
            }
            body={[
              <FlexWrapper>
                <MinorText>
                  {time(extrinsicDetail?.indexer?.blockTime)}
                </MinorText>
                <AccessoryText>
                  {timeDuration(extrinsicDetail?.indexer?.blockTime)}
                </AccessoryText>
              </FlexWrapper>,
              <InLink
                to={`/${node}/block/${extrinsicDetail?.indexer?.blockHeight}`}
              >
                {extrinsicDetail?.indexer?.blockHeight}
              </InLink>,
              <BreakText>
                <CopyText text={extrinsicDetail?.hash}>
                  <MinorText>
                    <MonoText>{extrinsicDetail?.hash}</MonoText>
                  </MinorText>
                </CopyText>
              </BreakText>,
              <MinorText>{capitalize(extrinsicDetail?.section)}</MinorText>,
              <MinorText>{capitalize(extrinsicDetail?.name)}</MinorText>,
              ...(hasTransfers
                ? [
                    <TransfersList
                      node={node}
                      assetTransfers={extrinsicTransfer}
                    />,
                  ]
                : []),
              <MinorText>
                <Result isSuccess={extrinsicDetail?.isSuccess} />
              </MinorText>,
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
  const activeTab = tab ?? "events";

  const [
    { result: extrinsicDetail },
    { result: extrinsicTransfer },
    { result: extrinsicEvents },
  ] = await Promise.all([
    nextApi.fetch(`${node}/extrinsics/${id}`),
    nextApi.fetch(`${node}/extrinsics/${id}/transfers`, { page: nPage - 1 }),
    nextApi.fetch(`${node}/extrinsics/${id}/events`, { page: nPage - 1 }),
  ]);

  return {
    props: {
      node,
      id,
      tab: activeTab,
      extrinsicDetail: extrinsicDetail ?? null,
      extrinsicTransfer: extrinsicTransfer ?? [],
      extrinsicEvents: extrinsicEvents ?? [],
    },
  };
}
