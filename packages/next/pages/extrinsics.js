import Layout from "components/layout";
import { ssrNextApi as nextApi } from "services/nextApi";
import { extrinsicsHead, EmptyQuery } from "utils/constants";
import Nav from "components/nav";
import Table from "components/table";
import Pagination from "components/pagination";
import InLink from "components/inLink";
import HashEllipsis from "components/hashEllipsis";
import Result from "components/result";
import BreakText from "components/breakText";
import Filter from "components/filter";
import { useEffect } from "react";
import { showIdentityInJSON } from "utils/dataWrapper";

export default function Extrinsics({ node, extrinsics, filter }) {
  return (
    <Layout node={node}>
      <section>
        <Nav data={[{ name: "Extrinsics" }]} node={node} />
        <Filter total={`All ${extrinsics?.total} extrinsics`} data={filter} />
        <Table
          head={extrinsicsHead}
          body={(extrinsics?.items || []).map((item) => [
            <InLink
              to={`/extrinsic/${item?.indexer?.blockHeight}-${item?.indexer?.index}`}
            >
              {item?.indexer?.blockHeight}-{item?.indexer?.index}
            </InLink>,
            <InLink to={`/block/${item?.indexer?.blockHeight}`}>
              {item?.indexer?.blockHeight}
            </InLink>,
            item?.indexer?.blockTime,
            <HashEllipsis hash={item?.hash} to={`/extrinsic/${item?.hash}`} />,
            <Result isSuccess={item?.isSuccess} />,
            <BreakText>{`${item?.section}(${item?.name})`}</BreakText>,
            showIdentityInJSON(item.args),
          ])}
          foot={
            <Pagination
              page={extrinsics?.page}
              pageSize={extrinsics?.pageSize}
              total={extrinsics?.total}
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
  const { page, module, method } = context.query;
  const nPage = parseInt(page) || 1;

  const { result: extrinsics } = await nextApi.fetch(`extrinsics`, {
    page: nPage - 1,
    pageSize: 25,
    ...(module ? { module } : {}),
    ...(method ? { method } : {}),
  });

  const filter = [];
  const { result: modules } = await nextApi.fetch(`extrinsics/modules`);
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
      `extrinsics/modules/${module}/methods`
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
      extrinsics: extrinsics ?? EmptyQuery,
      filter,
    },
  };
}
