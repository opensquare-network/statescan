import Layout from "components/layout";
import { ssrNextApi as nextApi } from "services/nextApi";
import { eventsHead, EmptyQuery } from "utils/constants";
import Nav from "components/nav";
import Table from "components/table";
import Pagination from "components/pagination";
import InLink from "components/inLink";
import HashEllipsis from "components/hashEllipsis";
import Filter from "components/filter";
import { makeEventArgs } from "utils/eventArgs";

export default function Events({ node, events, filter }) {
  return (
    <Layout node={node}>
      <section>
        <Nav data={[{ name: "Events" }]} node={node} />
        <Filter total={`All ${events?.total} events`} data={filter} />
        <Table
          head={eventsHead}
          body={(events?.items || []).map((item) => [
            <InLink to={`/event/${item?.indexer?.blockHeight}-${item?.sort}`}>
              {item?.indexer?.blockHeight}-{item?.sort}
            </InLink>,
            <InLink to={`/block/${item?.indexer?.blockHeight}`}>
              {item?.indexer?.blockHeight}
            </InLink>,
            item?.indexer?.blockTime,
            item?.extrinsicHash ? (
              <HashEllipsis
                hash={item?.extrinsicHash}
                to={`/extrinsic/${item?.extrinsicHash}`}
              />
            ) : (
              "-"
            ),
            `${item?.section}(${item?.meta?.name})`,
            makeEventArgs(node, item),
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
  const node = process.env.NEXT_PUBLIC_CHAIN;
  let { page, module, method, sign } = context.query;
  const nPage = parseInt(page) || 1;

  const { result: events } = await nextApi.fetch(`events`, {
    page: nPage - 1,
    pageSize: 25,
    ...(module ? { module } : {}),
    ...(method ? { method } : {}),
  });

  const filter = [
    {
      value: sign ?? "",
      name: "Sign",
      query: "sign",
      options: [
        {
          text: "Signed only",
          value: "",
        },
        { text: "All", value: "all" },
      ],
    },
  ];
  const { result: modules } = await nextApi.fetch(`events/modules`);
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
      `events/modules/${module}/methods`
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
