import Layout from "components/layout";
import Nav from "components/nav";
import Table from "components/table";
import InLink from "components/inLink";
import Symbol from "components/symbol";
import AddressEllipsis from "components/addressEllipsis";
import { assetsHead, EmptyQuery } from "utils/constants";
import { bigNumber2Locale, fromAssetUnit } from "utils";
import Pagination from "components/pagination";
import { ssrNextApi as nextApi } from "services/nextApi";
import Name from "../components/account/name";

export default function Assets({ node, assets }) {
  return (
    <Layout node={node}>
      <section>
        <Nav data={[{ name: "Asset Tracker" }]} node={node} />
        <Table
          head={assetsHead}
          body={(assets?.items || []).map((item, index) => [
            <InLink
              key={`${index}-1`}
              to={
                `/asset/${item.assetId}` +
                (item.destroyedAt ? `_${item.createdAt.blockHeight}` : "")
              }
            >{`#${item.assetId}`}</InLink>,
            <Symbol
              key={`${index}-2`}
              symbol={item.symbol}
              assetId={item.assetId}
            />,
            <Name key={`${index}-3`} name={item.name} />,
            <AddressEllipsis
              key={`${index}-4`}
              address={item.owner}
              to={`/account/${item.owner}`}
            />,
            <AddressEllipsis
              key={`${index}-5`}
              address={item.issuer}
              to={`/account/${item.issuer}`}
            />,
            item.accounts,
            `${bigNumber2Locale(fromAssetUnit(item.supply, item.decimals))}`,
          ])}
          foot={
            <Pagination
              page={assets?.page}
              pageSize={assets?.pageSize}
              total={assets?.total}
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
  const { tab, page } = context.query;

  const nPage = parseInt(page) || 1;

  const { result: assets } = await nextApi.fetch(`assets`, {
    page: nPage - 1,
    pageSize: 25,
  });

  return {
    props: {
      node,
      assets: assets ?? EmptyQuery,
    },
  };
}
