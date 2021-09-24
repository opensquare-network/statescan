import _ from "lodash";
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

  const customAddressesHead = _.cloneDeep(addressesHead);
  customAddressesHead[2].name = `${customAddressesHead[2].name} ${symbol}`;
  customAddressesHead[3].name = `${customAddressesHead[3].name} ${symbol}`;

  return (
    <Layout node={node}>
      <section>
        <Nav data={[{ name: "Accounts" }]} node={node} />
        <Table
          head={customAddressesHead}
          body={(addresses?.items || []).map((item, index) => [
            `#${addresses.page * addresses.pageSize + index + 1}`,
            <Address
              key={index}
              address={item?.address}
              to={`/account/${item?.address}`}
            />,
            `${bigNumber2Locale(
              fromSymbolUnit(item?.data?.reserved?.$numberDecimal, symbol)
            )} ${symbol}`,
            `${bigNumber2Locale(
              fromSymbolUnit(item?.data?.free?.$numberDecimal, symbol)
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
