import { useState, useEffect } from "react";
import Layout from "components/layout";
import { ssrNextApi as nextApi } from "services/nextApi";
import { blocksHead, EmptyQuery } from "utils/constants";
import Nav from "components/nav";
import Table from "components/table";
import Pagination from "components/pagination";
import InLink from "components/inLink";
import HashEllipsis from "components/hashEllipsis";
import ThemeText from "components/themeText";
import AddressEllipsis from "components/addressEllipsis";
import {
  listenFirstPageBlocks,
  unSubscribeFirstBlocks,
} from "services/websocket";

export default function Blocks({ node, blocks: ssrBlocks }) {
  const [time, setTime] = useState(Date.now());
  const [firstPageBlocks, setFirstPageBlocks] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const page = ssrBlocks?.page;

  useEffect(() => {
    if (page > 0) {
      unSubscribeFirstBlocks();
      return;
    }

    const unsubscribe = listenFirstPageBlocks(node, setFirstPageBlocks);
    return () => {
      unsubscribe();
    };
  }, [node, page]);

  const blocks = page > 0 ? ssrBlocks : firstPageBlocks || ssrBlocks;

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
            <img
              src={`/imgs/icons/${
                !item?.isFinalized ? "circle-pending" : "check-green"
              }.svg`}
              alt=""
            />,
            <ThemeText>
              <HashEllipsis hash={item?.hash} />
            </ThemeText>,
            item?.author ? (
              <AddressEllipsis
                address={item?.author}
                to={`/${node}/account/${item?.author}`}
              />
            ) : (
              "-"
            ),
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
    pageSize: 25,
  });

  return {
    props: {
      node,
      blocks: blocks ?? EmptyQuery,
    },
  };
}
