import styled from "styled-components";
import axios from "axios";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";

import Overview from "./Overview";
import Table from "components/Table";
import MinorText from "components/Table/MinorText";
import Link from "components/Link";
import Symbol from "components/Symbol";
import { addressEllipsis, timeDuration } from "utils";
import { nodeSelector } from "store/reducers/nodeSlice";
import {
  blocksLatestHead,
  transfersLatestHead,
  assetsLatestHead,
} from "utils/constants";

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
  const node = useSelector(nodeSelector);

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
    ["assetsLatest", node],
    async () => {
      const { data } = await axios.get(`${node}/assets/latest`);
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
          data={(blocksLatestData || []).map((item) => [
            <Link>{item.header.number}</Link>,
            <MinorText>{timeDuration(item.blockTime)}</MinorText>,
            item.extrinsicsCount,
            item.eventsCount,
          ])}
          collapse={900}
        />
        <Table
          title="Latest Transfers"
          head={transfersLatestHead}
          data={(transfersLatestData || []).map((item) => [
            `${item.indexer.blockHeight}-${item.extrinsicIndex}`,
            <Link>{addressEllipsis(item.from)}</Link>,
            <Link>{addressEllipsis(item.to)}</Link>,
            `${item.balance / Math.pow(10, item.assetDecimals)} ${
              item.assetSymbol
            }`,
          ])}
          collapse={900}
        />
      </TableWrapper>
      <Table
        title="Assets"
        head={assetsLatestHead}
        data={(assetsLatestData || []).map((item) => [
          `#${item.assetId}`,
          <Symbol>{item.symbol}</Symbol>,
          item.name,
          <Link>{addressEllipsis(item.owner)}</Link>,
          <Link>{addressEllipsis(item.issuer)}</Link>,
          item.accounts,
          `${item.supply / Math.pow(10, item.decimals)} ${item.symbol}`,
        ])}
        foot={
          <FootWrapper>
            <Link>view all</Link>
          </FootWrapper>
        }
        collapse={900}
      />
    </Wrapper>
  );
}
