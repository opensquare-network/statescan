import axios from "axios";
import { useQuery } from "react-query";

import Nav from "components/Nav";
import Table from "components/Table";
import InLink from "components/ExLink";
import Symbol from "components/Symbol";
import { assetsHead } from "utils/constants";
import { addressEllipsis } from "utils";
import { useNode } from "utils/hooks";

export default function Assets() {
  const node = useNode();

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
      <Nav data={[{ name: "Asset Tracker" }]} />
      <Table
        head={assetsHead}
        body={(data?.items || []).map((item) => [
          `#${item.assetId}`,
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
      />
    </section>
  );
}
