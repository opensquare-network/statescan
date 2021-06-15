import styled from "styled-components";
import axios from "axios";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";

import Overview from "./Overview";
import Table from "components/Table";
import MinorText from "components/Table/MinorText";
import Link from "components/Link";
import { addressEllipsis } from "utils";
import Symbol from "components/Symbol";
import { nodeSelector } from "store/reducers/nodeSlice";
import { blocksLatestHead, transfersLatestHead } from "utils/constants";

import { assetsData } from "utils/data";

const Wrapper = styled.section`
  > :not(:first-child) {
    margin-top: 32px;
  }
`;

const TableWrapper = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr 1fr;
`;

export default function Home() {
  assetsData.body = assetsData.body.map((item) => {
    item[1] = <Symbol />;
    item[2] = <MinorText>{item[2]}</MinorText>;
    item[3] = <Link>{addressEllipsis(item[3])}</Link>;
    item[4] = <Link>{addressEllipsis(item[4])}</Link>;
    return item;
  });
  assetsData.foot = (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <Link>View all</Link>
    </div>
  );
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

  return (
    <Wrapper>
      <Overview />
      <TableWrapper>
        <Table
          title="Latest Blocks"
          head={blocksLatestHead}
          data={(blocksLatestData || []).map((item) => [
            <Link>{item.header.number}</Link>,
            <MinorText>{item.blockTime}</MinorText>,
            item.extrinsicsCount,
            item.eventsCount,
          ])}
        />
        <Table
          title="Latest Transfers"
          head={transfersLatestHead}
          data={(transfersLatestData || []).map((item) => [
            `${item.indexer.blockHeight}-${item.extrinsicIndex}`,
            <Link>{addressEllipsis(item.from)}</Link>,
            <Link>{addressEllipsis(item.to)}</Link>,
            item.balance,
          ])}
        />
      </TableWrapper>
      {/* <Table title="Assets" data={assetsData} /> */}
    </Wrapper>
  );
}
