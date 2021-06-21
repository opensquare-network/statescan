import styled from "styled-components";
import axios from "axios";
import { useQuery } from "react-query";

import Overview from "./Overview";
import Table from "components/Table";
import MinorText from "components/MinorText";
import InLink from "components/InLink";
import Symbol from "components/Symbol";
import { addressEllipsis, timeDuration } from "utils";
import {
  blocksLatestHead,
  transfersLatestHead,
  assetsHead,
} from "utils/constants";
import { useNode } from "utils/hooks";

const Wrapper = styled.section`
  > :not(:first-child) {
    margin-top: 32px;
  }
`;

const TableWrapper = styled.div`
  display: grid;
  column-gap: 24px;
  row-gap: 32px;
  grid-template-columns: repeat(auto-fill, minmax(588px, 1fr));
  @media screen and (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const FootWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default function Home() {
  const node = useNode();

  const { data: blocksLatestData } = useQuery(
    ["blocksLatest", node],
    async () => {
      const { data } = await axios.get(`${node}/blocks/latest`);
      return data;
    },
    {
      enabled: !!node,
    }
  );

  const { data: transfersLatestData } = useQuery(
    ["transfersLatest", node],
    async () => {
      const { data } = await axios.get(`${node}/transfers/latest`);
      return data;
    },
    {
      enabled: !!node,
    }
  );

  const { data: assetsLatestData } = useQuery(
    ["assetsPopular", node],
    async () => {
      const { data } = await axios.get(`${node}/assets/popular`);
      return data;
    },
    {
      enabled: !!node,
    }
  );

  return (
    <Wrapper>
      <Overview />
      <TableWrapper>
        <Table
          title="Latest Blocks"
          head={blocksLatestHead}
          body={(blocksLatestData || []).map((item) => [
            <InLink to={`/${node}/block/${item.header.number}`}>
              {item.header.number}
            </InLink>,
            <MinorText>{timeDuration(item.blockTime)}</MinorText>,
            item.extrinsicsCount,
            item.eventsCount,
          ])}
          collapse={900}
        />
        <Table
          title="Latest Transfers"
          head={transfersLatestHead}
          body={(transfersLatestData || []).map((item) => [
            <InLink to={`/${node}/extrinsic/${item.extrinsicHash}`}>
              {`${item.indexer.blockHeight}-${item.extrinsicIndex}`}
            </InLink>,
            <InLink to={`/${node}/address/${item.from}`}>
              {addressEllipsis(item.from)}
            </InLink>,
            <InLink to={`/${node}/address/${item.to}`}>
              {addressEllipsis(item.to)}
            </InLink>,
            `${item.balance / Math.pow(10, item.assetDecimals)} ${
              item.assetSymbol
            }`,
          ])}
          collapse={900}
        />
      </TableWrapper>
      <Table
        title="Assets"
        head={assetsHead}
        body={(assetsLatestData || []).map((item) => [
          <InLink
            to={`/${node}/asset/${item.assetId}_${item.createdAt.blockHeight}`}
          >{`#${item.assetId}`}</InLink>,
          <Symbol symbol={item.symbol} />,
          item.name,
          <InLink to={`/${node}/address/${item.owner}`}>
            {addressEllipsis(item.owner)}
          </InLink>,
          <InLink to={`/${node}/address/${item.issuer}`}>
            {addressEllipsis(item.issuer)}
          </InLink>,
          item.accounts,
          `${item.supply / Math.pow(10, item.decimals)} ${item.symbol}`,
        ])}
        foot={
          <FootWrapper>
            <InLink to={`${node}/assets`}>view all</InLink>
          </FootWrapper>
        }
        collapse={900}
      />
    </Wrapper>
  );
}
