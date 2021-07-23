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

export default function Transfers({ node, transfers }) {
  const symbol = getSymbol(node);

  return (
    <Layout node={node}>
      <section>
        <Nav data={[{ name: "Transfers" }]} node={node} />
        <Table
          head={transfersHead}
          body={(transfers?.items || []).map((item) => [
            <InLink
              to={`/${node}/event/${item?.indexer?.blockHeight}-${item?.eventSort}`}
            >
              {item?.indexer?.blockHeight}-{item?.eventSort}
            </InLink>,
            <InLink to={`/${node}/block/${item?.indexer?.blockHeight}`}>
              {item?.indexer?.blockHeight}
            </InLink>,
            <Tooltip bg label={item?.method} />,
            item?.indexer?.blockTime,
            <AddressEllipsis
              address={item?.from}
              to={`/${node}/account/${item?.from}`}
            />,
            <AddressEllipsis
              address={item?.to}
              to={`/${node}/account/${item?.to}`}
            />,
            item.assetSymbol
              ? `${bigNumber2Locale(
                  fromAssetUnit(item.balance, item.assetDecimals)
                )} ${item.assetSymbol}`
              : `${bigNumber2Locale(
                  fromSymbolUnit(item.balance, symbol)
                )} ${symbol}`,
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
  const { node } = context.params;
  const { page } = context.query;
  const nPage = parseInt(page) || 1;

  const { result: transfers } = await nextApi.fetch(`${node}/transfers`, {
    page: nPage - 1,
  });

  return {
    props: {
      node,
      transfers: transfers ?? EmptyQuery,
    },
  };
}
