import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { useQuery } from "react-query";

import Section from "components/Section";
import Nav from "components/Nav";
import { useNode, useSymbol } from "utils/hooks";
import DetailTable from "components/DetailTable";
import {
  extrinsicHead,
  extrinsicTransferHead,
  extrinsicEventsHead,
} from "utils/constants";
import InLink from "components/InLink";
import CopyText from "components/CopyText";
import Result from "components/Result";
import MinorText from "components/MinorText";
import { capitalize, fromSymbolUnit, timeUTC } from "utils";
import TabTable from "components/TabTable";
import Pagination from "components/Pgination";

export default function Extrinsic() {
  const { id } = useParams();
  const node = useNode();
  const symbol = useSymbol();
  const [extrinsicId, setExtrinsicId] = useState();
  const [tabTableData, setTabTableData] = useState();
  const [eventsPage, setEventsPage] = useState(0);

  const { data, isLoading } = useQuery(["extrinsic", id, node], async () => {
    const { data } = await axios.get(`${node}/extrinsics/${id}`);
    return data;
  });

  const isTransfer =
    data?.section === "balances" &&
    (data?.name === "transfer" || data?.name === "transferKeepAlive");
  const isAssetTransfer =
    data?.section === "assets" &&
    (data?.name === "transfer" || data?.name === "transferKeepAlive");

  const extrinsicHash = data?.hash;
  const { data: assetTransfer } = useQuery(
    ["assetTransfer", isAssetTransfer, extrinsicHash],
    async () => {
      if (!isAssetTransfer || !extrinsicHash) {
        return null;
      }
      const { data } = await axios.get(`${node}/transfers/${extrinsicHash}`);
      return data;
    }
  );

  const { data: eventsData, isLoading: isEventsLoading } = useQuery(
    ["extrinsicEvents", id, node, eventsPage],
    async () => {
      const { data } = await axios.get(`${node}/extrinsics/${id}/events`, {
        params: {
          page: eventsPage,
        },
      });
      return data;
    }
  );

  useEffect(() => {
    setExtrinsicId(`${data?.indexer?.blockHeight}-${data?.indexer?.index}`);
  }, [data]);

  useEffect(() => {
    setTabTableData([
      {
        name: "Events",
        total: eventsData?.total,
        head: extrinsicEventsHead,
        body: (eventsData?.items || []).map((item) => [
          `${item?.indexer?.blockHeight}-${item?.sort}`,
          `${item?.section}(${item?.method})`,
        ]),
        foot: (
          <Pagination
            page={eventsData?.page}
            pageSize={eventsData?.pageSize}
            total={eventsData?.total}
            s
            setPage={setEventsPage}
          />
        ),
        isLoading: isEventsLoading,
      },
    ]);
  }, [eventsData, isEventsLoading]);

  return (
    <Section>
      <div>
        <Nav data={[{ name: "Extrinsic" }, { name: extrinsicId }]} />
        <DetailTable
          isLoading={isLoading}
          head={
            isTransfer || isAssetTransfer
              ? extrinsicTransferHead
              : extrinsicHead
          }
          body={[
            <MinorText>{timeUTC(data?.indexer?.blockTime)}</MinorText>,
            <InLink to={`/${node}/block/${data?.indexer?.blockHeight}`}>
              {data?.indexer?.blockHeight}
            </InLink>,
            <CopyText text={data?.hash}>
              <MinorText>{data?.hash}</MinorText>
            </CopyText>,
            <MinorText>{capitalize(data?.section)}</MinorText>,
            <MinorText>{capitalize(data?.name)}</MinorText>,
            <CopyText text={data?.signer}>
              <InLink to={`/${node}/address/${data?.signer}`}>
                {data?.signer}
              </InLink>
            </CopyText>,
            ...(isTransfer
              ? [
                  <CopyText text={data?.args?.dest?.id}>
                    <InLink to={`/${node}/address/${data?.args?.dest?.id}`}>
                      {data?.args?.dest?.id}
                    </InLink>
                  </CopyText>,
                  `${fromSymbolUnit(data?.args?.value ?? 0, symbol)} ${symbol}`,
                ]
              : []),
            ...(isAssetTransfer
              ? [
                  <CopyText text={data?.args?.target?.id}>
                    <InLink to={`/${node}/address/${data?.args?.target?.id}`}>
                      {data?.args?.target?.id}
                    </InLink>
                  </CopyText>,
                  `${
                    assetTransfer
                      ? (assetTransfer.balance ?? 0) /
                        Math.pow(10, assetTransfer.assetDecimals)
                      : 0
                  } ${assetTransfer?.assetSymbol || ""}`,
                ]
              : []),
            <MinorText>
              <Result isSuccess={data?.isSuccess} />
            </MinorText>,
          ]}
        />
      </div>
      <TabTable data={tabTableData} collapse={900} />
    </Section>
  );
}
