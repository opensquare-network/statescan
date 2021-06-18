import { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { useQuery } from "react-query";

import Nav from "components/Nav";
import { useNode } from "utils/hooks";
import {
  assetHead,
  assetTransfersHead,
  assetHoldersHead,
} from "utils/constants";
import DetailTable from "components/DetailTable";
import Section from "components/Section";
import MinorText from "components/MinorText";
import { timeUTC, timeDuration, addressEllipsis } from "utils";
import InLink from "components/InLink";
import CopyText from "components/CopyText";
import TabTable from "components/TabTable";
import ThemeText from "components/ThemeText";
import BreakText from "components/BreakText";

export default function Asset() {
  const { id } = useParams();
  const node = useNode();
  const [assetSymbol, setAssetSymbol] = useState();
  const [tabTableData, setTabTableData] = useState();

  const { data } = useQuery(["asset", node, id], async () => {
    const { data } = await axios.get(`${node}/assets/${id}`);
    return data;
  });

  const { data: transfersData } = useQuery(
    ["assetTransfers", node, id],
    async () => {
      const { data } = await axios.get(`${node}/assets/${id}/transfers`);
      return data;
    }
  );

  const { data: holdersData } = useQuery(
    ["assetHolders", node, id],
    async () => {
      const { data } = await axios.get(`${node}/assets/${id}/holders`);
      return data;
    }
  );

  console.log({ holdersData });

  useEffect(() => {
    setAssetSymbol(data?.symbol);
  }, [data]);

  useEffect(() => {
    setTabTableData([
      {
        name: "Transfers",
        total: transfersData?.total,
        head: assetTransfersHead,
        body: (transfersData?.items || []).map((item) => [
          <ThemeText>{`${item?.indexer?.blockHeight}-${item?.extrinsicIndex}`}</ThemeText>,
          <BreakText>
            <ThemeText>{item?.extrinsicHash}</ThemeText>
          </BreakText>,
          <MinorText>{timeDuration(item?.indexer?.blockTime)}</MinorText>,
          <InLink to={`/${node}/address/${item?.from}`}>
            {addressEllipsis(item?.from)}
          </InLink>,
          <InLink to={`/${node}/address/${item?.to}`}>
            {addressEllipsis(item?.to)}
          </InLink>,
          item?.balance,
        ]),
      },
      {
        name: "Holders",
        total: holdersData?.total,
        head: assetHoldersHead,
        body: (holdersData?.items || []).map((item) => [
          "-",
          <InLink to={`/${node}/address/${item?.address}`}>
            {item?.address}
          </InLink>,
          "-",
          item?.balance,
        ]),
      },
    ]);
  }, [node, transfersData, holdersData]);

  return (
    <Section>
      <div>
        <Nav
          data={[
            { name: "Asset Tracker", path: `/${node}/assets` },
            { name: assetSymbol },
          ]}
        />
        <DetailTable
          head={assetHead}
          body={[
            <MinorText>{data?.symbol}</MinorText>,
            <MinorText>{data?.name}</MinorText>,
            <MinorText>{`#${data?.assetId}`}</MinorText>,
            <MinorText>{timeUTC(data?.createdAt?.blockTime)}</MinorText>,
            <CopyText text={data?.owner}>
              <InLink to={`/${node}/address/${data?.owner}`}>
                {data?.owner}
              </InLink>
            </CopyText>,
            <CopyText text={data?.issuer}>
              <InLink to={`/${node}/address/${data?.issuer}`}>
                {data?.issuer}
              </InLink>
            </CopyText>,
            `${data?.supply} ${data?.symbol}`,
            data?.decimals,
            <MinorText>{holdersData?.total}</MinorText>,
            <MinorText>{transfersData?.total}</MinorText>,
          ]}
        />
      </div>
      <TabTable data={tabTableData} collapse={900} />
    </Section>
  );
}
