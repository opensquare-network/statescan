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

export default function Extrinsics({
  node,
  extrinsics,
  filter,
  allmodulemethods,
}) {
  return (
    <Layout node={node}>
      <section>
        <Nav data={[{ name: "Extrinsics" }]} node={node} />
        <Filter
          total={`All ${extrinsics?.total} extrinsics`}
          data={filter}
          allmodulemethods={allmodulemethods}
        />
        <Table
          type="extrinsic"
          head={extrinsicsHead}
          body={(extrinsics?.items || []).map((item, index) => [
            <InLink
              key={`${index}-1`}
              to={`/extrinsic/${item?.indexer?.blockHeight}-${item?.indexer?.index}`}
            >
              {item?.indexer?.blockHeight.toLocaleString()}-
              {item?.indexer?.index}
            </InLink>,
            <InLink
              key={`${index}-2`}
              to={`/block/${item?.indexer?.blockHeight}`}
            >
              {item?.indexer?.blockHeight.toLocaleString()}
            </InLink>,
            item?.indexer?.blockTime,
            <HashEllipsis
              key={`${index}-3`}
              hash={item?.hash}
              to={`/extrinsic/${item?.hash}`}
            />,
            <Result key={`${index}-4`} isSuccess={item?.isSuccess} />,
            <BreakText
              key={`${index}-5`}
            >{`${item?.section}(${item?.name})`}</BreakText>,
            item,
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
  const { page, module, method, sign } = context.query;
  const nPage = parseInt(page) || 1;

  const { result: extrinsics } = await nextApi.fetch(`extrinsics`, {
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

  const { result: allmodulemethods } = await nextApi.fetch(
    `extrinsics/allmodulemethods`
  );

  return {
    props: {
      node,
      extrinsics: extrinsics ?? EmptyQuery,
      filter,
      allmodulemethods: allmodulemethods ?? EmptyQuery,
    },
  };
}
