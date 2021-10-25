import Layout from "components/layout";
import { ssrNextApi as nextApi } from "services/nextApi";
import { eventsHead, EmptyQuery } from "utils/constants";
import Nav from "components/nav";
import Table from "components/table";
import Pagination from "components/pagination";
import InLink from "components/inLink";
import HashEllipsis from "components/hashEllipsis";
import Filter from "components/filter";

export default function Events({ node, events, filter, allmodulemethods }) {
  return (
    <Layout node={node}>
      <section>
        <Nav data={[{ name: "Events" }]} node={node} />
        <Filter
          total={`All ${events?.total} events`}
          data={filter}
          allmodulemethods={allmodulemethods}
        />
        <Table
          type="event"
          head={eventsHead}
          body={(events?.items || []).map((item, index) => [
            <InLink
              key={`${index}-1`}
              to={`/event/${item?.indexer?.blockHeight}-${item?.sort}`}
            >
              {item?.indexer?.blockHeight.toLocaleString()}-{item?.sort}
            </InLink>,
            <InLink
              key={`${index}-2`}
              to={`/block/${item?.indexer?.blockHeight}`}
            >
              {item?.indexer?.blockHeight.toLocaleString()}
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
            item,
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
  const { page, module, method, sign } = context.query;
  const nPage = parseInt(page) || 1;

  const { result: events } = await nextApi.fetch(`events`, {
    page: nPage - 1,
    pageSize: 25,
    ...(module ? { module } : {}),
    ...(method ? { method } : {}),
    signOnly: sign ? "false" : "true",
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

  const { result: allmodulemethods } = await nextApi.fetch(
    `events/allmodulemethods`
  );

  return {
    props: {
      node,
      events: events ?? EmptyQuery,
      filter,
      allmodulemethods: allmodulemethods ?? EmptyQuery,
    },
  };
}
