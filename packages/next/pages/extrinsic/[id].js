import styled from "styled-components";
import { useEffect } from "react";
import { showIdentityInJSON } from "utils/dataWrapper";
import Layout from "components/layout";
import { ssrNextApi as nextApi } from "services/nextApi";
import Section from "components/section";
import Nav from "components/nav";
import DetailTable from "components/detailTable";
import {
  extrinsicHead,
  extrinsicEventsHead,
  EmptyQuery,
} from "utils/constants";
import InLink from "components/inLink";
import CopyText from "components/copyText";
import Result from "components/result";
import MinorText from "components/minorText";
import { capitalize, time, timeDuration } from "utils";
import TabTable from "components/tabTable";
import Pagination from "components/pagination";
import BreakText from "components/breakText";
import TransfersList from "components/transfersList";
import MonoText from "components/monoText";
import PageNotFound from "components/pageNotFound";
import JsonAttributes from "components/jsonAttributes";
import Address from "components/address";
import { makeEventArgs } from "utils/eventArgs";

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
  event,
  extrinsicDetail,
  extrinsicTransfer,
  extrinsicEvents,
}) {
  if (!extrinsicDetail) {
    return (
      <Layout node={node}>
        <PageNotFound />
      </Layout>
    );
  }

  const expand = (extrinsicEvents?.items || []).findIndex(
    (item) => `${item?.indexer?.blockHeight}-${item?.sort}` === event
  );

  const tabTableData = [
    {
      name: "Events",
      page: extrinsicEvents?.page,
      total: extrinsicEvents?.total,
      head: extrinsicEventsHead,
      body: (extrinsicEvents?.items || []).map((item) => [
        <InLink to={`/event/${item?.indexer?.blockHeight}-${item?.sort}`}>
          {`${item?.indexer?.blockHeight}-${item?.sort}`}
        </InLink>,
        `${item?.section}(${item?.method})`,
        makeEventArgs(node, item),
      ]),
      expand,
      foot: (
        <Pagination
          page={extrinsicEvents?.page}
          pageSize={extrinsicEvents?.pageSize}
          total={extrinsicEvents?.total}
        />
      ),
    },
  ];

  useEffect(() => {
    extrinsicDetail.args = showIdentityInJSON(extrinsicDetail.args);
  }, []);

  return (
    <Layout node={node}>
      <Section>
        <div>
          <Nav
            data={[
              { name: "Extrinsic" },
              {
                name: `${extrinsicDetail?.indexer?.blockHeight}-${extrinsicDetail?.indexer?.index}`,
              },
            ]}
            node={node}
          />
          <DetailTable
            head={extrinsicHead}
            badge={[
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              extrinsicTransfer?.length,
              null,
            ]}
            body={[
              <FlexWrapper>
                <MinorText>
                  {time(extrinsicDetail?.indexer?.blockTime)}
                </MinorText>
                <AccessoryText>
                  {timeDuration(extrinsicDetail?.indexer?.blockTime)}
                </AccessoryText>
              </FlexWrapper>,
              <InLink to={`/block/${extrinsicDetail?.indexer?.blockHeight}`}>
                {extrinsicDetail?.indexer?.blockHeight}
              </InLink>,
              extrinsicDetail?.lifetime ? (
                <MinorText>
                  <InLink to={`/lifetime?.[0]}`}>
                    {extrinsicDetail?.lifetime?.[0]}
                  </InLink>
                  {" - "}
                  <InLink to={`/block/${extrinsicDetail?.lifetime?.[1]}`}>
                    {extrinsicDetail?.lifetime?.[1]}
                  </InLink>
                </MinorText>
              ) : undefined,
              <BreakText>
                <CopyText text={extrinsicDetail?.hash}>
                  <MinorText>
                    <MonoText>{extrinsicDetail?.hash}</MonoText>
                  </MinorText>
                </CopyText>
              </BreakText>,
              <MinorText>{capitalize(extrinsicDetail?.section)}</MinorText>,
              <MinorText>{capitalize(extrinsicDetail?.name)}</MinorText>,
              extrinsicDetail?.signer ? (
                <CopyText text={extrinsicDetail?.signer}>
                  <Address
                    address={extrinsicDetail?.signer}
                    to={`/account/${extrinsicDetail?.signer}`}
                  />
                </CopyText>
              ) : (
                "-"
              ),
              extrinsicTransfer?.length > 0 ? (
                <TransfersList node={node} assetTransfers={extrinsicTransfer} />
              ) : undefined,
              extrinsicDetail?.nonce === undefined ? undefined : (
                <MinorText>{extrinsicDetail?.nonce}</MinorText>
              ),
              <MinorText>
                <Result isSuccess={extrinsicDetail?.isSuccess} />
              </MinorText>,
            ]}
            foot={
              <JsonAttributes
                title={"Parameters"}
                data={extrinsicDetail.args}
              />
            }
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
  const activeTab = tab ?? "events";

  const [
    { result: extrinsicDetail },
    { result: extrinsicTransfer },
    { result: extrinsicEvents },
  ] = await Promise.all([
    nextApi.fetch(`extrinsics/${id}`),
    nextApi.fetch(`extrinsics/${id}/transfers`, {
      page: activeTab === "transfers" ? nPage - 1 : 0,
    }),
    nextApi.fetch(`extrinsics/${id}/events`, {
      page: activeTab === "events" ? nPage - 1 : 0,
    }),
  ]);

  return {
    props: {
      node,
      id,
      tab: activeTab,
      event: event ?? null,
      extrinsicDetail: extrinsicDetail ?? null,
      extrinsicTransfer: extrinsicTransfer ?? EmptyQuery,
      extrinsicEvents: extrinsicEvents ?? EmptyQuery,
    },
  };
}
