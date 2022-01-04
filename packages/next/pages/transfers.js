import Layout from "components/layout";
import { ssrNextApi as nextApi } from "services/nextApi";
import { transfersHead, EmptyQuery } from "utils/constants";
import Nav from "components/nav";
import Table from "components/table";
import Pagination from "components/pagination";
import InLink from "components/inLink";
import AddressEllipsis from "components/addressEllipsis";
import { bigNumber2Locale, fromSymbolUnit, fromAssetUnit } from "utils";
import { getSymbol } from "utils/hooks";
import Tooltip from "components/tooltip";
import Filter from "components/filter";
import SymbolLink from "components/symbolLink";

export default function Transfers({ node, transfers, filter }) {
  const symbol = getSymbol(node);

  return (
    <Layout node={node}>
      <section>
        <Nav data={[{ name: "Transfers" }]} node={node} />
        <Filter total={`All ${transfers?.total} transfers`} data={filter} />
        <Table
          head={transfersHead}
          body={(transfers?.items || []).map((item, index) => [
            <InLink
              key={`${index}-1`}
              to={`/event/${item?.indexer?.blockHeight}-${item?.indexer.eventIndex}`}
            >
              {item?.indexer?.blockHeight.toLocaleString()}-{item?.indexer.eventIndex}
            </InLink>,
            <InLink
              key={`${index}-2`}
              to={`/block/${item?.indexer?.blockHeight}`}
            >
              {item?.indexer?.blockHeight.toLocaleString()}
            </InLink>,
            item.extrinsicHash ? <Tooltip label={item.method} bg /> : "-",
            item?.indexer?.blockTime,
            <AddressEllipsis
              key={`${index}-3`}
              address={item?.from}
              to={`/account/${item?.from}`}
            />,
            <AddressEllipsis
              key={`${index}-4`}
              address={item?.to}
              to={`/account/${item?.to}`}
            />,
            <>
              {item.assetSymbol
                ? `${bigNumber2Locale(
                    fromAssetUnit(item.balance.$numberDecimal, item.assetDecimals)
                  )} `
                : `${bigNumber2Locale(fromSymbolUnit(item.balance.$numberDecimal, symbol))} `}
              <SymbolLink assetId={item.assetId} destroyedAt={item.assetDestroyedAt} createdAt={item.assetCreatedAt}>
                {item.assetSymbol ? item.assetSymbol : symbol}
              </SymbolLink>
            </>,
          ])}
          foot={
            <Pagination
              page={transfers?.page}
              pageSize={transfers?.pageSize}
              total={transfers?.total}
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
  const { page, sign } = context.query;
  const nPage = parseInt(page) || 1;

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

  const { result: transfers } = await nextApi.fetch(`transfers`, {
    page: nPage - 1,
    pageSize: 25,
    signOnly: sign ? "false" : "true",
  });

  return {
    props: {
      node,
      transfers: transfers ?? EmptyQuery,
      filter,
    },
  };
}
