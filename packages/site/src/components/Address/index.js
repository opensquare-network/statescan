import { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { useQuery } from "react-query";

import Nav from "components/Nav";
import { addressEllipsis, fromSymbolUnit } from "utils";
import { useNode, useSymbol } from "utils/hooks";
import DetailTable from "components/DetailTable";
import { addressHead } from "utils/constants";
import MinorText from "components/MinorText";
import BreakText from "components/BreakText";
import CopyText from "components/CopyText";
import TabTable from "components/TabTable";
import {
  addressExtrincsHead,
  addressAssetsHead,
  addressTransfersHead,
} from "utils/constants";
import Section from "components/Section";
import InLink from "components/InLink";
import ThemeText from "components/ThemeText";
import { timeDuration } from "utils";
import Result from "components/Result";
import Pagination from "components/Pgination";

export default function Address() {
  const { id } = useParams();
  const node = useNode();
  const symbol = useSymbol();
  const [tabTableData, setTabTableData] = useState();
  const [extrinsicsPage, setExtrinsicsPage] = useState(0);
  const [assetsPage, setAssetsPage] = useState(0);
  const [transfersPage, setTransfersPage] = useState(0);

  const { data, isLoading } = useQuery(["address", id, node], async () => {
    const { data } = await axios.get(`${node}/addresses/${id}`);
    return data;
  });

  const { data: extrinsicsData, isLoading: isExtrinsicsLoading } = useQuery(
    ["addressExtrinsics", id, node, extrinsicsPage],
    async () => {
      const { data } = await axios.get(`${node}/addresses/${id}/extrinsics`, {
        params: {
          page: extrinsicsPage,
        },
      });
      return data;
    }
  );

  const { data: assetsData, isLoading: isAssetsLoading } = useQuery(
    ["addressAssets", id, node, assetsPage],
    async () => {
      const { data } = await axios.get(`${node}/addresses/${id}/assets`, {
        params: {
          page: assetsPage,
        },
      });
      return data;
    }
  );

  const { data: transfersData, isLoading: isTransfersLoading } = useQuery(
    ["addressTransfers", id, node, transfersPage],
    async () => {
      const { data } = await axios.get(`${node}/addresses/${id}/transfers`, {
        params: {
          page: transfersPage,
        },
      });
      return data;
    }
  );

  useEffect(() => {
    setTabTableData([
      {
        name: "Assets",
        total: assetsData?.total,
        head: addressAssetsHead,
        body: (assetsData?.items || []).map((item) => [
          <InLink
            to={`/${node}/asset/${item.assetId}_${item.assetCreatedAt.blockHeight}`}
          >{`#${item.assetId}`}</InLink>,
          item.assetSymbol,
          item.assetName,
          item.balance / Math.pow(10, item.assetDecimals),
          item.approved || 0,
          item.isFrozen.toString(),
          item.transfers,
        ]),
        foot: (
          <Pagination
            page={assetsData?.page}
            pageSize={assetsData?.pageSize}
            total={assetsData?.total}
            setPage={setAssetsPage}
          />
        ),
        isLoading: isAssetsLoading,
      },
      {
        name: "Transfers",
        total: transfersData?.total,
        head: addressTransfersHead,
        body: (transfersData?.items || []).map((item) => [
          `${item.indexer.blockHeight}-${item.eventSort}`,
          item.method,
          <MinorText>{timeDuration(item.indexer.blockTime)}</MinorText>,
          item.from !== id ? (
            <InLink to={`/${node}/address/${item.from}`}>
              {addressEllipsis(item.from)}
            </InLink>
          ) : (
            addressEllipsis(item.from)
          ),
          item.to !== id ? (
            <InLink to={`/${node}/address/${item.to}`}>
              {addressEllipsis(item.to)}
            </InLink>
          ) : (
            addressEllipsis(item.to)
          ),
          item.assetSymbol
            ? `${item.balance / Math.pow(10, item.assetDecimals)} ${
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
        name: "Extrinsics",
        total: extrinsicsData?.total,
        head: addressExtrincsHead,
        body: (extrinsicsData?.items || []).map((item) => [
          <InLink
            to={`/${node}/extrinsic/${item?.indexer?.blockHeight}-${item?.indexer?.index}`}
          >
            {`${item?.indexer?.blockHeight}-${item?.indexer?.index}`}
          </InLink>,
          <InLink to={`/${node}/block/${item?.indexer?.blockHeight}`}>
            {item?.indexer?.blockHeight}
          </InLink>,
          <BreakText>
            <ThemeText>{item?.hash}</ThemeText>
          </BreakText>,
          timeDuration(item?.indexer?.blockTime),
          <Result isSuccess={item?.isSuccess} />,
          `${item.section}(${item.name})`,
        ]),
        foot: (
          <Pagination
            page={extrinsicsData?.page}
            pageSize={extrinsicsData?.pageSize}
            total={extrinsicsData?.total}
            setPage={setExtrinsicsPage}
          />
        ),
        isLoading: isExtrinsicsLoading,
      },
    ]);
  }, [
    node,
    extrinsicsData,
    assetsData,
    transfersData,
    isExtrinsicsLoading,
    isAssetsLoading,
    isTransfersLoading,
    symbol,
    id,
  ]);

  return (
    <Section>
      <div>
        <Nav data={[{ name: "Address" }, { name: addressEllipsis(id) }]} />
        <DetailTable
          isLoading={isLoading}
          head={addressHead}
          body={[
            <CopyText text={data?.address}>
              <BreakText>
                <MinorText>{data?.address}</MinorText>
              </BreakText>
            </CopyText>,
            `${fromSymbolUnit(data?.data?.free || 0, symbol)} ${symbol}`,
            `${fromSymbolUnit(data?.data?.reserved || 0, symbol)} ${symbol}`,
            `${fromSymbolUnit(data?.data?.miscFrozen || 0, symbol)} ${symbol}`,
            <MinorText>{data?.nonce}</MinorText>,
          ]}
        />
      </div>
      <TabTable data={tabTableData} collapse={900} />
    </Section>
  );
}
