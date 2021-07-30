import Layout from "components/layout";
import { ssrNextApi as nextApi } from "services/nextApi";
import { eventsHead, EmptyQuery } from "utils/constants";
import Nav from "components/nav";
import Table from "components/table";
import Pagination from "components/pagination";
import InLink from "components/inLink";
import HashEllipsis from "components/hashEllipsis";
import Filter from "components/filter";
import { makeTablePairs } from "utils";

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
              to={`/${node}/event/${item?.indexer?.blockHeight}-${item?.sort}`}
            >
              {item?.indexer?.blockHeight}-{item?.sort}
            </InLink>,
            <InLink to={`/${node}/block/${item?.indexer?.blockHeight}`}>
              {item?.indexer?.blockHeight}
            </InLink>,
            item?.indexer?.blockTime,
            item?.extrinsicHash ? (
              <HashEllipsis
                hash={item?.extrinsicHash}
                to={`/${node}/extrinsic/${item?.extrinsicHash}`}
              />
            ) : (
              "-"
            ),
            `${item?.section}(${item?.meta?.name})`,
            makeTablePairs(
              ["Docs", ...item.meta.args],
              [item.meta.documentation?.join("").trim() || "", ...item.data]
            ),
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
  let { page, module, method } = context.query;
  const nPage = parseInt(page) || 1;

  const { result: events } = await nextApi.fetch(`${node}/events`, {
    page: nPage - 1,
    pageSize: 25,
    ...(module ? { module } : {}),
    ...(method ? { method } : {}),
  });

  const filter = [];
  const { result: modules } = await nextApi.fetch(`${node}/events/modules`);
  filter.push({
    value: module && (modules || []).indexOf(module) > -1 ? module : "",
    name: "Module",
    query: "module",
    subQuery: ["method"],
    options: (modules || []).reduce(
      (acc, cur) => {
        acc.push({ text: cur, value: cur });
        return acc;
      },
      [{ text: "All", value: "" }]
    ),
  });
  if (module) {
    const { result: methods } = await nextApi.fetch(
      `${node}/events/modules/${module}/methods`
    );
    filter.push({
      value: method && (methods || []).indexOf(method) > -1 ? method : "",
      name: "Method",
      query: "method",
      options: (methods || []).reduce(
        (acc, cur) => {
          acc.push({ text: cur, value: cur });
          return acc;
        },
        [{ text: "All", value: "" }]
      ),
    });
  } else {
    filter.push({
      value: "",
      name: "Method",
      query: "method",
      options: [{ text: "All", value: "" }],
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
