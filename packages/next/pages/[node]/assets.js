import Layout from "components/layout";
import Nav from "components/nav";
import Table from "components/table";
import InLink from "components/inLink";
import Symbol from "components/symbol";
import AddressEllipsis from "components/addressEllipsis";
import { assetsHead } from "utils/constants";
import { bigNumber2Locale, fromAssetUnit } from "utils";
import Pagination from "components/pagination";
import nextApi from "services/nextApi";

export default function Assets({ node, assets }) {
  return (
    <Layout>
      <section>
        <Nav data={[{ name: "Asset Tracker" }]} />
        <Table
          head={assetsHead}
          body={(assets?.items || []).map((item) => [
            <InLink
              to={`/${node}/asset/${item.assetId}_${item.createdAt.blockHeight}`}
            >{`#${item.assetId}`}</InLink>,
            <Symbol symbol={item.symbol} />,
            item.name,
            <InLink to={`/${node}/address/${item.owner}`}>
              <AddressEllipsis address={item.owner} />
            </InLink>,
            <InLink to={`/${node}/address/${item.issuer}`}>
              <AddressEllipsis address={item.issuer} />
            </InLink>,
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

  const { result: assets } = await nextApi.fetch(`${node}/assets`);

  return {
    props: {
      node,
      assets,
    },
  };
}
