import styled from "styled-components";
import { ssrNextApi as nextApi } from "services/nextApi";
import Layout from "components/layout";
import Section from "components/section";
import Nav from "components/nav";
import DetailTable from "components/detailTable";
import MinorText from "components/minorText";
import InLink from "components/inLink";
import {
  timeDuration,
  time,
  fromAssetUnit,
  fromSymbolUnit,
  bigNumber2Locale,
  makeTablePairs,
} from "utils";
import { eventHead } from "utils/constants";
import PageNotFound from "components/pageNotFound";
import EventAttributes from "components/EventAttributes";
import { getSymbol } from "utils/hooks";

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

export default function Block({ node, id, eventDetail }) {
  const symbol = getSymbol(node);

  if (!eventDetail) {
    return (
      <Layout node={node}>
        <PageNotFound />
      </Layout>
    );
  }

  return (
    <Layout node={node}>
      <Section>
        <div>
          <Nav data={[{ name: "Event" }, { name: id }]} node={node} />
          <DetailTable
            head={eventHead}
            body={[
              <FlexWrapper>
                <MinorText>{time(eventDetail?.indexer?.blockTime)}</MinorText>
                <AccessoryText>
                  {eventDetail?.indexer?.blockTime &&
                    timeDuration(eventDetail?.indexer?.blockTime)}
                </AccessoryText>
              </FlexWrapper>,
              <InLink
                to={`/${node}/block/${eventDetail?.indexer?.blockHeight}`}
              >
                {eventDetail?.indexer?.blockHeight}
              </InLink>,
              <InLink
                to={`/${node}/extrinsic/${eventDetail?.indexer?.blockHeight}-${eventDetail?.sort}`}
              >
                {`${eventDetail?.indexer?.blockHeight}-${eventDetail?.sort}`}
              </InLink>,
              eventDetail?.sort,
              eventDetail?.section,
              eventDetail?.method,
              eventDetail?.meta?.documentation?.[0],
              eventDetail?.transfer
                ? eventDetail.transfer.assetSymbol
                  ? `${bigNumber2Locale(
                      fromAssetUnit(
                        eventDetail.transfer.balance,
                        eventDetail.transfer.assetDecimals
                      )
                    )} ${eventDetail.transfer.assetSymbol}`
                  : `${bigNumber2Locale(
                      fromSymbolUnit(eventDetail.transfer.balance, symbol)
                    )} ${symbol}`
                : "-",
            ]}
            foot={
              <EventAttributes
                data={makeTablePairs(eventDetail.meta.args, eventDetail.data)}
              />
            }
          />
        </div>
      </Section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { node, id } = context.params;
  const { result: eventDetail } = await nextApi.fetch(`${node}/events/${id}`);

  return {
    props: {
      node,
      id,
      eventDetail: eventDetail ?? null,
    },
  };
}
