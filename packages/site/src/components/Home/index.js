import styled from "styled-components";

import Overview from "./Overview";
import Table from "components/Table";
import MinorText from "components/Table/MinorText";
import Link from "components/Link";
import { addressEllipsis } from "utils";
import Symbol from "components/Symbol";

import { lastestBlocksData, latestTransfersData, assetsData } from "utils/data";

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
  lastestBlocksData.body = lastestBlocksData.body.map((item) => {
    item[0] = <Link>{item[0]}</Link>;
    item[1] = <MinorText>{item[1]}</MinorText>;
    return item;
  });
  latestTransfersData.body = latestTransfersData.body.map((item) => {
    item[1] = <Link>{addressEllipsis(item[1])}</Link>;
    item[2] = <Link>{addressEllipsis(item[2])}</Link>;
    return item;
  });
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

  return (
    <Wrapper>
      <Overview />
      <TableWrapper>
        <Table title="Latest Blocks" data={lastestBlocksData} />
        <Table title="Latest Transfers" data={latestTransfersData} />
      </TableWrapper>
      <Table title="Assets" data={assetsData} />
    </Wrapper>
  );
}
