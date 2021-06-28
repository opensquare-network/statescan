import { useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";

import Nav from "components/Nav";
import Table from "components/Table";
import InLink from "components/InLink";
import Symbol from "components/Symbol";
import { assetsHead } from "utils/constants";
import { addressEllipsis, bigNumber2Locale, fromAssetUnit } from "utils";
import { useNode } from "utils/hooks";
import LineChart from "../Charts/LineChart";
import Pagination from "components/Pgination";

export default function Assets() {
  const node = useNode();
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery(
    ["assets", node],
    async () => {
      const { data } = await axios.get(`${node}/assets`, {
        params: {
          page,
        },
      });
      return data;
    },
    {
      enabled: !!node,
    }
  );

  return (
    <section>
      <Nav data={[{ name: "Asset Tracker" }]} />
      <LineChart />
      <Table
        head={assetsHead}
        body={(data?.items || []).map((item) => [
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
          `${bigNumber2Locale(fromAssetUnit(item.supply, item.decimals))}`,
        ])}
        foot={
          <Pagination
            page={data?.page}
            pageSize={data?.pageSize}
            total={data?.total}
            s
            setPage={setPage}
          />
        }
        isLoading={isLoading}
        collapse={900}
      />
    </section>
  );
}
