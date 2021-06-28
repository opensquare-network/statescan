import { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { useQuery } from "react-query";

import Nav from "components/Nav";
import { useNode, useSymbol } from "utils/hooks";
import {
  assetHead,
  assetTransfersHead,
  assetHoldersHead,
} from "utils/constants";
import DetailTable from "components/DetailTable";
import Section from "components/Section";
import MinorText from "components/MinorText";
import { addressEllipsis, fromAssetUnit, fromSymbolUnit } from "utils";
import InLink from "components/InLink";
import CopyText from "components/CopyText";
import TabTable from "components/TabTable";
import BreakText from "components/BreakText";
import Pagination from "components/Pgination";
import Tooltip from "components/Tooltip";

export default function Asset() {
  const { id } = useParams();
  const node = useNode();
  const [assetSymbol, setAssetSymbol] = useState();
  const [tabTableData, setTabTableData] = useState();
  const [transfersPage, setTransfersPage] = useState(0);
  const [holdersPage, setHoldersPage] = useState(0);
  const symbol = useSymbol();

  const { data, isLoading } = useQuery(["asset", node, id], async () => {
    const { data } = await axios.get(`${node}/assets/${id}`);
    return data;
  });

  const { data: transfersData, isLoading: isTransfersLoading } = useQuery(
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

  const { data: holdersData, isLoading: isHoldersLoading } = useQuery(
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
          `${item.indexer.blockHeight}-${item.eventSort}`,
          <InLink
            to={`/${node}/extrinsic/${item.indexer.blockHeight}-${item.extrinsicIndex}`}
          >{`${item.indexer.blockHeight}-${item.extrinsicIndex}`}</InLink>,
          <Tooltip label={item.method} bg />,
          item.indexer.blockTime,
          <InLink to={`/${node}/address/${item?.from}`}>
            {addressEllipsis(item?.from)}
          </InLink>,
          <InLink to={`/${node}/address/${item?.to}`}>
            {addressEllipsis(item?.to)}
          </InLink>,
          item.assetSymbol
            ? `${fromAssetUnit(item.balance, item.assetDecimals)} ${
                item.assetSymbol
              }`
            : `${fromSymbolUnit(item.balance, symbol)} ${symbol}`,
        ]),
        foot: (
          <Pagination
            page={transfersData?.page}
            pageSize={transfersData?.pageSize}
            total={transfersData?.total}
            setPage={setTransfersPage}
          />
        ),
        isLoading: isTransfersLoading,
      },
      {
        name: "Holders",
        total: holdersData?.total,
        head: assetHoldersHead,
        body: (holdersData?.items || []).map((item, index) => [
          index + 1,
          <BreakText>
            <InLink to={`/${node}/address/${item?.address}`}>
              {item?.address}
            </InLink>
          </BreakText>,
          fromAssetUnit(item?.balance, item?.assetDecimals),
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
        isLoading: isHoldersLoading,
      },
    ]);
  }, [
    node,
    transfersData,
    holdersData,
    isTransfersLoading,
    isHoldersLoading,
    id,
    symbol,
  ]);

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
          isLoading={isLoading}
          head={assetHead}
          body={[
            <MinorText>{data?.symbol}</MinorText>,
            <MinorText>{data?.name}</MinorText>,
            <MinorText>{`#${data?.assetId}`}</MinorText>,
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
            `${fromAssetUnit(data?.supply, data?.decimals)} ${data?.symbol}`,
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
