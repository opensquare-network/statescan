import Layout from "components/layout";
import nextApi from "services/nextApi";
import { eventsHead, EmptyQuery } from "utils/constants";
import Nav from "components/nav";
import Table from "components/table";
import Pagination from "components/pagination";
import InLink from "components/inLink";
import HashEllipsis from "components/hashEllipsis";
import ThemeText from "components/themeText";
import Filter from "components/filter";

export default function Events({ node, events, filter }) {
  return (
    <Layout node={node}>
      <section>
        <Nav data={[{ name: "Events" }]} node={node} />
        <Filter total={`All ${events?.total} events`} data={filter} />
        <Table
          head={eventsHead}
          body={(events?.items || []).map((item) => [
            <InLink
              to={`/${node}/block/${item?.indexer?.blockHeight}-${item?.sort}`}
            >
              {item?.indexer?.blockHeight}-{item?.sort}
            </InLink>,
            <InLink to={`/${node}/block/${item?.indexer?.blockHeight}`}>
              {item?.indexer?.blockHeight}
            </InLink>,
            item?.indexer?.blockTime,
            item?.extrinsicHash ? (
              <ThemeText>
                <HashEllipsis hash={item?.extrinsicHash} />
              </ThemeText>
            ) : (
              "-"
            ),
            `${item?.section}(${item?.meta?.name})`,
            item?.meta,
          ])}
          foot={
            <Pagination
              page={events?.page}
              pageSize={events?.pageSize}
              total={events?.total}
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
  const { page, module, method } = context.query;
  const nPage = parseInt(page) || 1;

  const { result: events } = await nextApi.fetch(`${node}/events`, {
    page: nPage - 1,
    module,
    method,
  });

  const filter = [];
  const { result: modules } = await nextApi.fetch(`${node}/events/modules`);
  filter.push({
    value: module ?? null,
    name: "Module",
    query: "module",
    options: (modules || []).reduce(
      (acc, cur) => {
        acc.push({ text: cur, value: cur });
        return acc;
      },
      [{ text: "All", value: null }]
    ),
  });
  if (module) {
    const { result: methods } = await nextApi.fetch(
      `${node}/events/modules/${module}/methods`
    );
    filter.push({
      value: method ?? null,
      name: "Method",
      query: "method",
      options: (methods || []).reduce(
        (acc, cur) => {
          acc.push({ text: cur, value: cur });
          return acc;
        },
        [{ text: "All", value: null }]
      ),
    });
  }

  return {
    props: {
      node,
      events: events ?? EmptyQuery,
      filter,
    },
  };
}
