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

export default function Assets({ node, assets }) {
  return (
    <Layout node={node}>
      <section>
        <Nav data={[{ name: "Asset Tracker" }]} node={node} />
        <Table
          head={assetsHead}
          body={(assets?.items || []).map((item) => [
            <InLink
              to={
                `/${node}/asset/${item.assetId}` + (item.destroyedAt
                  ? `_${item.createdAt.blockHeight}`
                  : "")
              }
            >{`#${item.assetId}`}</InLink>,
            <Symbol symbol={item.symbol} />,
            item.name,
            <AddressEllipsis
              address={item.owner}
              to={`/${node}/account/${item.owner}`}
            />,
            <AddressEllipsis
              address={item.issuer}
              to={`/${node}/account/${item.issuer}`}
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
  const { node } = context.params;
  const { tab, page } = context.query;

  const nPage = parseInt(page) || 1;

  const { result: assets } = await nextApi.fetch(`${node}/assets`, {
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
