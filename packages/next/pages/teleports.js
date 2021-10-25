import Layout from "components/layout";
import styled from "styled-components";
import _ from "lodash";
import { ssrNextApi as nextApi } from "services/nextApi";
import { teleportsHead, EmptyQuery, nodes } from "utils/constants";
import Nav from "components/nav";
import Table from "components/table";
import Pagination from "components/pagination";
import InLink from "components/inLink";
import AddressEllipsis from "components/addressEllipsis";
import ChainAddressEllipsis from "components/chainAddressEllipsis";
import Filter from "components/filter";
import { bigNumber2Locale, fromSymbolUnit } from "utils";
import TeleportDirection from "components/teleportDirection";
import { getSymbol } from "utils/hooks";
import BigNumber from "bignumber.js";
import Result from "components/result";
import ExplorerLink from "components/explorerLink";

const Icon = styled.img`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
`;

function getTeleportSourceAndTarget(node, direction) {
  const chain = nodes.find((item) => item.value === node);
  if (direction === "in") {
    return { source: chain.sub, target: chain.name };
  } else {
    return { source: chain.name, target: chain.sub };
  }
}

export default function Events({ node, teleports, filter }) {
  const symbol = getSymbol(node);
  const teleportSourceAndTarget = (direction) =>
    getTeleportSourceAndTarget(node, direction);

  const nodeInfo = nodes.find((i) => i.value === node);
  const customTeleportHead = _.cloneDeep(teleportsHead);
  const sendAtCol = customTeleportHead.find((item) => item.name === "Sent At");
  if (sendAtCol) {
    sendAtCol.name = <Icon src={nodeInfo.icon} alt="" />;
  }

  return (
    <Layout node={node}>
      <section>
        <Nav data={[{ name: "Teleports" }]} node={node} />
        <Filter total={`All ${teleports?.total} teleports`} data={filter} />
        <Table
          head={customTeleportHead}
          body={(teleports?.items || []).map((item, index) => [
            <InLink
              key={`${index}-1`}
              to={`/extrinsic/${item.indexer.blockHeight}-${item.indexer.index}`}
            >
              {`${item.indexer.blockHeight.toLocaleString()}-${
                item.indexer.index
              }`}
            </InLink>,
            item.indexer.blockTime,
            <TeleportDirection
              key={`${index}-2`}
              from={teleportSourceAndTarget(item.teleportDirection).source}
              to={teleportSourceAndTarget(item.teleportDirection).target}
            />,
            item.beneficiary ? (
              item.teleportDirection === "in" ? (
                <AddressEllipsis
                  address={item.beneficiary}
                  to={`/account/${item.beneficiary}`}
                />
              ) : (
                <ChainAddressEllipsis
                  chain={teleportSourceAndTarget(item.teleportDirection).target}
                  address={item.beneficiary}
                />
              )
            ) : (
              "-"
            ),
            item.teleportDirection === "in" ? (
              <Result isSuccess={item.complete} noText={true} />
            ) : (
              <Result isSuccess={null} noText={true} />
            ),
            item.teleportDirection === "in" ? (
              <ExplorerLink
                chain={teleportSourceAndTarget(item.teleportDirection).source}
                href={`/block/${item.pubSentAt}`}
              >
                {item.pubSentAt.toLocaleString()}
              </ExplorerLink>
            ) : (
              "-"
            ),
            !item.complete || item.amount === null || item.amount === undefined
              ? "-"
              : `${bigNumber2Locale(
                  fromSymbolUnit(
                    new BigNumber(item.amount).minus(item.fee || 0).toString(),
                    symbol
                  )
                )}`,
            item.fee === null || item.fee === undefined
              ? "-"
              : `${bigNumber2Locale(fromSymbolUnit(item.fee, symbol))}`,
            item.amount === null || item.amount === undefined
              ? "-"
              : `${bigNumber2Locale(fromSymbolUnit(item.amount, symbol))}`,
          ])}
          foot={
            <Pagination
              page={teleports?.page}
              pageSize={teleports?.pageSize}
              total={teleports?.total}
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

  const { result: teleports } = await nextApi.fetch(`teleports`, {
    page: nPage - 1,
    pageSize: 25,
  });

  const filter = [
    // {
    //   value: "",
    //   name: "Type",
    //   query: "type",
    //   options: [{ text: "All", value: "" }],
    // },
  ];

  return {
    props: {
      node,
      teleports: teleports ?? EmptyQuery,
      filter,
    },
  };
}
