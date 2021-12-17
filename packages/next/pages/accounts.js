import Layout from "components/layout";
import { ssrNextApi as nextApi } from "services/nextApi";
import { addressesHead, EmptyQuery } from "utils/constants";
import Nav from "components/nav";
import Table from "components/table";
import Pagination from "components/pagination";
import { getSymbol } from "utils/hooks";
import { bigNumber2Locale, fromSymbolUnit } from "utils";
import Address from "components/address";

export default function Addresses({ node, addresses }) {
  const symbol = getSymbol(node);

  return (
    <Layout node={node}>
      <section>
        <Nav data={[{ name: "Accounts" }]} node={node} />
        <Table
          head={addressesHead}
          body={(addresses?.items || []).map((item, index) => [
            `#${addresses.page * addresses.pageSize + index + 1}`,
            <Address
              key={index}
              address={item?.address}
              to={`/account/${item?.address}`}
            />,
            `${bigNumber2Locale(
              fromSymbolUnit(item?.data?.total?.$numberDecimal || "0", symbol)
            )} ${symbol}`,
          ])}
          foot={
            <Pagination
              page={addresses?.page}
              pageSize={addresses?.pageSize}
              total={addresses?.total}
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
  const { page } = context.query;
  const nPage = parseInt(page) || 1;

  const { result: addresses } = await nextApi.fetch(`addresses`, {
    page: nPage - 1,
    pageSize: 25,
  });

  return {
    props: {
      node,
      addresses: addresses ?? EmptyQuery,
    },
  };
}
