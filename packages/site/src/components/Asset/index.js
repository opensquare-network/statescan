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
import Pagination from "components/Pgination";

export default function Asset() {
  const { id } = useParams();
  const node = useNode();
  const [assetSymbol, setAssetSymbol] = useState();
  const [tabTableData, setTabTableData] = useState();
  const [transfersPage, setTransfersPage] = useState(0);
  const [holdersPage, setHoldersPage] = useState(0);

  const { data, loading } = useQuery(["asset", node, id], async () => {
    const { data } = await axios.get(`${node}/assets/${id}`);
    return data;
  });

  const { data: transfersData, loading: transfersLoading } = useQuery(
    ["assetTransfers", node, id, transfersPage],
    async () => {
      const { data } = await axios.get(`${node}/assets/${id}/transfers`, {
        params: {
          page: transfersPage,
        },
      });
      return data;
    }
  );

  const { data: holdersData, loading: holdersLoading } = useQuery(
    ["assetHolders", node, id, holdersPage],
    async () => {
      const { data } = await axios.get(`${node}/assets/${id}/holders`, {
        params: {
          page: holdersPage,
        },
      });
      return data;
    }
  );

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
        foot: (
          <Pagination
            page={transfersData?.page}
            pageSize={transfersData?.pageSize}
            total={transfersData?.total}
            setPage={setTransfersPage}
          />
        ),
        loading: transfersLoading,
      },
      {
        name: "Holders",
        total: holdersData?.total,
        head: assetHoldersHead,
        body: (holdersData?.items || []).map((item) => [
          "-",
          <BreakText>
            <InLink to={`/${node}/address/${item?.address}`}>
              {item?.address}
            </InLink>
          </BreakText>,
          "-",
          item?.balance,
        ]),
        foot: (
          <Pagination
            page={holdersData?.page}
            pageSize={holdersData?.pageSize}
            total={holdersData?.total}
            s
            setPage={setHoldersPage}
          />
        ),
        loading: holdersLoading,
      },
    ]);
  }, [node, transfersData, holdersData, transfersLoading, holdersLoading]);

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
          loading={loading}
          head={assetHead}
          body={[
            <MinorText>{data?.symbol}</MinorText>,
            <MinorText>{data?.name}</MinorText>,
            <MinorText>{`#${data?.assetId}`}</MinorText>,
            <MinorText>{timeUTC(data?.createdAt?.blockTime)}</MinorText>,
            <BreakText>
              <CopyText text={data?.owner}>
                <InLink to={`/${node}/address/${data?.owner}`}>
                  {data?.owner}
                </InLink>
              </CopyText>
            </BreakText>,
            <BreakText>
              <CopyText text={data?.issuer}>
                <InLink to={`/${node}/address/${data?.issuer}`}>
                  {data?.issuer}
                </InLink>
              </CopyText>
            </BreakText>,
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
