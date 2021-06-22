import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { useQuery } from "react-query";

import Section from "components/Section";
import Nav from "components/Nav";
import { useNode, useSymnol } from "utils/hooks";
import DetailTable from "components/DetailTable";
import { extrinsicHead, extrinsicEventsHead } from "utils/constants";
import InLink from "components/InLink";
import CopyText from "components/CopyText";
import Result from "components/Result";
import MinorText from "components/MinorText";
import { capitalize, timeUTC } from "utils";
import TabTable from "components/TabTable";
import ThemeText from "components/ThemeText";
import BreakText from "components/BreakText";
import Pagination from "components/Pgination";

export default function Extrinsic() {
  const { id } = useParams();
  const node = useNode();
  const symbol = useSymnol();
  const [extrinsicId, setExtrinsicId] = useState();
  const [tabTableData, setTabTableData] = useState();
  const [eventsPage, setEventsPage] = useState(0);

  const { data } = useQuery(["extrinsic", id, node], async () => {
    const { data } = await axios.get(`${node}/extrinsics/${id}`);
    return data;
  });

  const { data: eventsData } = useQuery(
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
          `${item?.indexer?.blockHeight}-${item?.index}`,
          <BreakText>
            <ThemeText>{item?.extrinsicHash}</ThemeText>
          </BreakText>,
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
      },
    ]);
  }, [eventsData]);

  return (
    <Section>
      <div>
        <Nav data={[{ name: "Extrinsic" }, { name: extrinsicId }]} />
        <DetailTable
          head={extrinsicHead}
          body={[
            <MinorText>{timeUTC(data?.indexer?.blockTime)}</MinorText>,
            <InLink to={`/${node}/block/${data?.indexer?.blockHeight}`}>
              {data?.indexer?.blockHeight}
            </InLink>,
            "-",
            <CopyText text={data?.hash}>
              <MinorText>{data?.hash}</MinorText>
            </CopyText>,
            <MinorText>{capitalize(data?.section)}</MinorText>,
            <MinorText>{capitalize(data?.name)}</MinorText>,
            <CopyText text={data?.signer}>
              <InLink>{data?.signer}</InLink>
            </CopyText>,
            <CopyText text={data?.args?.target?.id}>
              <InLink>{data?.args?.target?.id}</InLink>
            </CopyText>,
            `${data?.args?.amount ?? 0} ${symbol}`,
            "-",
            "-",
            <MinorText>
              <Result isSuccess={data?.isSuccess} />
            </MinorText>,
            <MinorText>XXX</MinorText>,
            <MinorText>XXX</MinorText>,
          ]}
        />
      </div>
      <TabTable data={tabTableData} collapse={900} />
    </Section>
  );
}
