import Layout from "components/layout";
import nextApi from "services/nextApi";
import { eventsHead, EmptyQuery } from "utils/constants";
import Nav from "components/nav";
import Table from "components/table";
import Pagination from "components/pagination";
import InLink from "components/inLink";
import HashEllipsis from "components/hashEllipsis";
import ThemeText from "components/themeText";

export default function Events({ node, events }) {
  return (
    <Layout>
      <section>
        <Nav data={[{ name: "Events" }]} />
        <Table
          head={eventsHead}
          body={(events?.items || []).map((item) => [
            <InLink
              to={`/${node}/extrinsic/${item?.indexer?.blockHeight}-${item?.sort}`}
            >
              {item?.indexer?.blockHeight}-{item?.sort}
            </InLink>,
            <InLink to={`/${node}/block/${item?.indexer?.blockHeight}`}>
              {item?.indexer?.blockHeight}
            </InLink>,
            item?.indexer?.blockTime,
            <ThemeText>
              <HashEllipsis hash={item?.extrinsicHash} />
            </ThemeText>,
            `${item?.section}(${item?.meta?.name})`,
            item?.meta,
          ])}
          foot={
            <Pagination
              page={events?.page}
              pageSize={events?.pageSize}
              total={Math.ceil(events?.total / events?.pageSize)}
            />
          }
          collapse={900}
        />
      </section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { node } = context.params;
  const { page } = context.query;
  const nPage = parseInt(page) || 1;

  const { result: events } = await nextApi.fetch(`${node}/events`, {
    page: nPage - 1,
  });

  return {
    props: {
      node,
      events: events ?? EmptyQuery,
    },
  };
}
