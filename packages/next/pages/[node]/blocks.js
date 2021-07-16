import Layout from "components/layout";
import { ssrNextApi as nextApi } from "services/nextApi";
import { blocksHead, EmptyQuery } from "utils/constants";
import Nav from "components/nav";
import Table from "components/table";
import Pagination from "components/pagination";
import InLink from "components/inLink";
import HashEllipsis from "components/hashEllipsis";
import ThemeText from "components/themeText";

export default function Blocks({ node, blocks }) {
  return (
    <Layout node={node}>
      <section>
        <Nav data={[{ name: "Blocks" }]} node={node} />
        <Table
          head={blocksHead}
          body={(blocks?.items || []).map((item) => [
            <InLink to={`/${node}/block/${item?.header?.number}`}>
              {item?.header?.number}
            </InLink>,
            item?.blockTime,
            "-",
            <ThemeText>
              <HashEllipsis hash={item?.hash} />
            </ThemeText>,
            "-",
            item?.extrinsicsCount,
            item?.eventsCount,
          ])}
          foot={
            <Pagination
              page={blocks?.page}
              pageSize={blocks?.pageSize}
              total={blocks?.total}
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

  const { result: blocks } = await nextApi.fetch(`${node}/blocks`, {
    page: nPage - 1,
  });

  return {
    props: {
      node,
      blocks: blocks ?? EmptyQuery,
    },
  };
}
