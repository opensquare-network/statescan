import { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { useQuery } from "react-query";

import Nav from "components/Nav";
import { addressEllipsis } from "utils";
import { useNode, useSymbol } from "utils/hooks";
import DetailTable from "components/DetailTable";
import { addressHead } from "utils/constants";
import MinorText from "components/MinorText";
import BreakText from "components/BreakText";
import CopyText from "components/CopyText";
import TabTable from "components/TabTable";
import { addressExtrincsHead, addressAssetsHead } from "utils/constants";
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

  const { data } = useQuery(["address", id, node], async () => {
    const { data } = await axios.get(`${node}/addresses/${id}`);
    return data;
  });

  const { data: extrinsicsData } = useQuery(
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

  const { data: assetsData } = useQuery(
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

  useEffect(() => {
    setTabTableData([
      {
        name: "Extrinsics",
        total: extrinsicsData?.total,
        head: addressExtrincsHead,
        body: (extrinsicsData?.items || []).map((item) => [
          `${item?.indexer?.blockHeight}-${item?.indexer?.index}`,
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
            s
            setPage={setExtrinsicsPage}
          />
        ),
      },
      {
        name: "Assets",
        total: assetsData?.total,
        head: addressAssetsHead,
        body: (assetsData?.items || []).map((item) => [
          "-",
          "-",
          "-",
          item.balance,
          "-",
          "-",
          "-",
        ]),
        foot: (
          <Pagination
            page={assetsData?.page}
            pageSize={assetsData?.pageSize}
            total={assetsData?.total}
            s
            setPage={setAssetsPage}
          />
        ),
      },
    ]);
  }, [node, extrinsicsData, assetsData]);

  return (
    <Section>
      <div>
        <Nav data={[{ name: "Address" }, { name: addressEllipsis(id) }]} />
        <DetailTable
          head={addressHead}
          body={[
            <CopyText text={data?.address}>
              <BreakText>
                <MinorText>{data?.address}</MinorText>
              </BreakText>
            </CopyText>,
            `${data?.data?.free} ${symbol}`,
            `${data?.data?.reserved} ${symbol}`,
            `${data?.data?.feeFrozen} ${symbol}`,
            "-",
            <MinorText>{data?.nonce}</MinorText>,
          ]}
        />
      </div>
      <TabTable data={tabTableData} collapse={900} />
    </Section>
  );
}
