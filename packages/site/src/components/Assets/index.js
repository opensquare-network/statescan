import { useSelector } from "react-redux";
import axios from "axios";
import { useQuery } from "react-query";

import { nodeSelector } from "store/reducers/nodeSlice";
import Nav from "components/Nav";
import Table from "components/Table";
import ExLink from "components/ExLink";
import Symbol from "components/Symbol";
import { assetsHead } from "utils/constants";
import { addressEllipsis } from "utils";

export default function Assets() {
  const node = useSelector(nodeSelector);

  const { data } = useQuery(
    ["assets", node],
    async () => {
      const { data } = await axios.get(`${node}/assets`);
      return data;
    },
    {
      enabled: !!node,
    }
  );

  return (
    <section>
      <Nav />
      <Table
        head={assetsHead}
        data={(data?.items || []).map((item) => [
          `#${item.assetId}`,
          <Symbol>{item.symbol}</Symbol>,
          item.name,
          <ExLink>{addressEllipsis(item.owner)}</ExLink>,
          <ExLink>{addressEllipsis(item.issuer)}</ExLink>,
          item.accounts,
          `${item.supply / Math.pow(10, item.decimals)} ${item.symbol}`,
        ])}
      />
    </section>
  );
}
