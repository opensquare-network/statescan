import { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { useQuery } from "react-query";

import Nav from "components/Nav";
import { addressEllipsis } from "utils";
import { useNode, useSymnol } from "utils/hooks";
import DetailTable from "components/DetailTable";
import { addressHead } from "utils/constants";
import MinorText from "components/MinorText";
import BreakText from "components/BreakText";
import CopyText from "components/CopyText";
import TabTable from "components/TabTable";
import { addressExtrincsHead } from "utils/constants";
import Section from "components/Section";
import InLink from "components/InLink";
import ThemeText from "components/ThemeText";
import { timeDuration } from "utils";
import Result from "components/Result";

export default function Address() {
  const { id } = useParams();
  const node = useNode();
  const symbol = useSymnol();
  const [tabTableData, setTabTableData] = useState();

  const { data } = useQuery(["address", id, node], async () => {
    const { data } = await axios.get(`${node}/addresses/${id}`);
    return data;
  });

  const { data: extrinsicsData } = useQuery(
    ["addressExtrinsics", id, node],
    async () => {
      const { data } = await axios.get(`${node}/addresses/${id}/extrinsics`);
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
          <ThemeText>{item?.hash}</ThemeText>,
          timeDuration(item?.indexer?.blockTime),
          <Result isSuccess={item?.isSuccess} />,
          `${item.section}(${item.name})`,
        ]),
      },
    ]);
  }, [node, extrinsicsData]);

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
