import styled from "styled-components";
import { useEffect } from "react";
import Layout from "components/layout";
import { ssrNextApi as nextApi } from "services/nextApi";
import { addressesHead, EmptyQuery } from "utils/constants";
import Nav from "components/nav";
import Table from "components/table";
import Pagination from "components/pagination";
import InLink from "components/inLink";
import { getSymbol } from "utils/hooks";
import { bigNumber2Locale, fromSymbolUnit } from "utils";
import BreakText from "components/breakText";

const AccountFont = styled.div`
  font-family: "SF Mono";
`;

export default function Addresses({ node, addresses }) {
  const symbol = getSymbol(node);

  const customAddressesHead = [...addressesHead];
  customAddressesHead[2].name = `${customAddressesHead[2].name} ${symbol}`;
  customAddressesHead[3].name = `${customAddressesHead[3].name} ${symbol}`;

  return (
    <Layout node={node}>
      <section>
        <Nav data={[{ name: "Accounts" }]} node={node} />
        <Table
          head={addressesHead}
          body={(addresses?.items || []).map((item, index) => [
            `#${addresses.page * addresses.pageSize + index + 1}`,
            <BreakText>
              <InLink to={`/${node}/account/${item?.address}`}>
                <AccountFont>{item?.address}</AccountFont>
              </InLink>
            </BreakText>,
            `${bigNumber2Locale(
              fromSymbolUnit(item?.data?.reserved, symbol)
            )} ${symbol}`,
            `${bigNumber2Locale(
              fromSymbolUnit(item?.data?.free, symbol)
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
  const { node } = context.params;
  const { page } = context.query;
  const nPage = parseInt(page) || 1;

  const { result: addresses } = await nextApi.fetch(`${node}/addresses`, {
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
