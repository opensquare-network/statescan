import Layout from "components/layout";
import _ from "lodash";
import { ssrNextApi as nextApi } from "services/nextApi";
import {
  teleportsHeadIn,
  teleportsHeadOut,
  EmptyQuery,
  nodes,
} from "utils/constants";
import Nav from "components/nav";
import Table from "components/table";
import Pagination from "components/pagination";
import InLink from "components/inLink";
import AddressEllipsis from "components/addressEllipsis";
import Filter from "components/filter";
import { bigNumber2Locale, fromSymbolUnit } from "utils";
import TeleportDirection from "components/teleportDirection";
import { getSymbol } from "utils/hooks";
import BigNumber from "bignumber.js";
import Result from "components/result";
import ExplorerLink from "components/explorerLink";

function getTeleportSourceAndTarget(node, direction) {
  const chain = nodes.find((item) => item.value === node);
  if (direction === "in") {
    return { source: chain.sub, target: chain.name };
  } else {
    return { source: chain.name, target: chain.sub };
  }
}

export default function Teleports({ node, teleports, direction }) {
  const symbol = getSymbol(node);
  const teleportSourceAndTarget = (direction) =>
    getTeleportSourceAndTarget(node, direction);

  const inDirection = (
    <TeleportDirection
      from={teleportSourceAndTarget("in").source}
      to={teleportSourceAndTarget("in").target}
    />
  );
  const outDirection = (
    <TeleportDirection
      from={teleportSourceAndTarget("out").source}
      to={teleportSourceAndTarget("out").target}
    />
  );
  const filter = [
    {
      value: direction,
      name: "Direction",
      query: "direction",
      options: [
        { text: inDirection, value: "in" },
        { text: outDirection, value: "out" },
      ],
    },
  ];

  let teleportsHead, teleportsBody;
  if (direction === "in") {
    teleportsHead = teleportsHeadIn;
    teleportsBody = (teleports?.items || []).map((item, index) => [
      <InLink
        key={`${index}-1`}
        to={`/extrinsic/${item.indexer.blockHeight}-${item.indexer.extrinsicIndex}`}
      >
        {`${item.indexer.blockHeight.toLocaleString()}-${
          item.indexer.extrinsicIndex
        }`}
      </InLink>,
      item.indexer.blockTime,
      item.beneficiary ? (
        <AddressEllipsis
          address={item.beneficiary}
          to={`/account/${item.beneficiary}`}
        />
      ) : (
        "-"
      ),
      <Result key={`${index}-2`} isSuccess={item.complete} noText={true} />,
      <ExplorerLink
        key={`${index}-3`}
        chain={teleportSourceAndTarget("in").source}
        href={`/block/${item.sentAt}`}
      >
        {item.sentAt.toLocaleString()}
      </ExplorerLink>,
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
    ]);
  } else if (direction === "out") {
    teleportsHead = teleportsHeadOut;
    teleportsBody = (teleports?.items || []).map((item, index) => [
      <InLink
        key={`${index}-1`}
        to={`/extrinsic/${item.indexer.blockHeight}-${item.indexer.extrinsicIndex}`}
      >
        {`${item.indexer.blockHeight.toLocaleString()}-${
          item.indexer.extrinsicIndex
        }`}
      </InLink>,
      item.indexer.blockTime,
      [
        <AddressEllipsis
          key={`${index}-2-1`}
          address={item.beneficiary}
          to={`/account/${item.beneficiary}`}
        />,
        <AddressEllipsis
          key={`${index}-2-2`}
          address={item.signer}
          to={`/account/${item.signer}`}
        />,
      ],
      <Result
        key={`${index}-3`}
        isSuccess={
          item.relayChainInfo?.outcome?.complete ??
          (item.relayChainInfo?.outcome?.incomplete ? false : undefined)
        }
        noText={true}
      />,
      item.relayChainInfo?.enterAt?.blockHeight ? (
        <ExplorerLink
          key={`${index}-4`}
          chain={teleportSourceAndTarget("in").source}
          href={`/block/${item.relayChainInfo.enterAt.blockHeight}`}
        >
          {item.relayChainInfo.enterAt.blockHeight.toLocaleString()}
        </ExplorerLink>
      ) : (
        "-"
      ),
      item.relayChainInfo?.executedAt?.blockHeight ? (
        <ExplorerLink
          key={`${index}-5`}
          chain={teleportSourceAndTarget("in").source}
          href={`/block/${item.relayChainInfo.executedAt.blockHeight}`}
        >
          {item.relayChainInfo.executedAt.blockHeight.toLocaleString()}
        </ExplorerLink>
      ) : (
        "-"
      ),
      item.relayChainInfo?.outcome?.complete
        ? `${bigNumber2Locale(
            fromSymbolUnit(
              new BigNumber(item.relayChainInfo.outcome.complete)
                .minus(BigNumber(item.relayChainInfo.fee) || 0)
                .toString(),
              symbol
            )
          )}`
        : "-",
      item.relayChainInfo?.fee === null ||
      item.relayChainInfo?.fee === undefined
        ? "-"
        : `${bigNumber2Locale(
            fromSymbolUnit(item.relayChainInfo.fee, symbol)
          )}`,
      item.relayChainInfo?.outcome?.complete === null ||
      item.relayChainInfo?.outcome?.complete === undefined
        ? "-"
        : `${bigNumber2Locale(
            fromSymbolUnit(item.relayChainInfo.outcome.complete, symbol)
          )}`,
    ]);
  }

  return (
    <Layout node={node}>
      <section>
        <Nav data={[{ name: "Teleports" }]} node={node} />
        <Filter
          total={`All ${teleports?.total} teleports`}
          warning="There are issues with teleports scan and we are fixing them."
          data={filter}
        />
        <Table
          head={teleportsHead}
          body={teleportsBody}
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
  const { page, direction } = context.query;

  const nPage = parseInt(page) || 1;
  const nDirection = direction ?? "in";

  const { result: teleports } = await nextApi.fetch(`teleports/${nDirection}`, {
    page: nPage - 1,
    pageSize: 25,
  });

  return {
    props: {
      node,
      teleports: teleports ?? EmptyQuery,
      direction: nDirection,
    },
  };
}
