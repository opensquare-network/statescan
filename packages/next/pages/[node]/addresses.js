import { useEffect } from "react";
import Layout from "components/layout";
import nextApi from "services/nextApi";
import { addressesHead, EmptyQuery } from "utils/constants";
import Nav from "components/nav";
import Table from "components/table";
import Pagination from "components/pagination";
import InLink from "components/inLink";
import { getSymbol } from "utils/hooks";

export default function Addresses({ node, addresses }) {
  const symbol = getSymbol(node);

  useEffect(() => {
    addressesHead[2].name = `${addressesHead[2].name} ${symbol}`;
    addressesHead[3].name = `${addressesHead[3].name} ${symbol}`;
  }, [addressesHead]);

  return (
    <Layout node={node}>
      <section>
        <Nav data={[{ name: "Addresses" }]} node={node} />
        <Table
          head={addressesHead}
          body={(addresses?.items || []).map((item) => [
            "-",
            <InLink to={`/${node}/address/${item?.address}`}>
              {item?.address}
            </InLink>,
            "-",
            "-",
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
  const { node } = context.params;
  const { page } = context.query;
  const nPage = parseInt(page) || 1;

  const { result: addresses } = await nextApi.fetch(`${node}/addresses`, {
    page: nPage - 1,
  });

  return {
    props: {
      node,
      addresses: addresses ?? EmptyQuery,
    },
  };
}
