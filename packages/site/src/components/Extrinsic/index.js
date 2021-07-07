import { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router";
import axios from "axios";
import { useQuery } from "react-query";

import Section from "components/Section";
import Nav from "components/Nav";
import { useNode } from "utils/hooks";
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
import { capitalize, time, timeDuration } from "utils";
import TabTable from "components/TabTable";
import Pagination from "components/Pgination";
import BreakText from "components/BreakText";
import { useHistory } from "react-router-dom";
import TransfersList from "./TransfersList";

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  > :not(:first-child) {
    margin-left: 16px;
  }
`;

const AccessoryText = styled.div`
  color: rgba(17, 17, 17, 0.35);
`;

export default function Extrinsic() {
  const { id } = useParams();
  const node = useNode();
  const [extrinsicId, setExtrinsicId] = useState("");
  const [tabTableData, setTabTableData] = useState();
  const [eventsPage, setEventsPage] = useState(0);
  const history = useHistory();

  const { data, isLoading } = useQuery(["extrinsic", id, node], async () => {
    const { data } = await axios.get(`${node}/extrinsics/${id}`);
    return data;
  });

  if (!isLoading && !data) {
    history.replace("/404");
  }

  const extrinsicHash = data?.hash;

  const { data: assetTransfers } = useQuery(
    ["assetTransfers", extrinsicHash],
    async () => {
      const { data } = await axios.get(
        `${node}/extrinsics/${extrinsicHash}/transfers`
      );
      return data;
    }
  );

  const hasTransfers = assetTransfers?.length > 0;

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
    if (data?.indexer) {
      setExtrinsicId(`${data?.indexer?.blockHeight}-${data?.indexer?.index}`);
    }
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
          item.data,
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
          head={hasTransfers ? extrinsicTransferHead : extrinsicHead}
          badge={
            hasTransfers
              ? [null, null, null, null, null, assetTransfers?.length, null]
              : null
          }
          body={[
            <FlexWrapper>
              <MinorText>{time(data?.indexer?.blockTime)}</MinorText>
              <AccessoryText>
                {timeDuration(data?.indexer?.blockTime)}
              </AccessoryText>
            </FlexWrapper>,
            <InLink to={`/${node}/block/${data?.indexer?.blockHeight}`}>
              {data?.indexer?.blockHeight}
            </InLink>,
            <BreakText>
              <CopyText text={data?.hash}>
                <MinorText>{data?.hash}</MinorText>
              </CopyText>
            </BreakText>,
            <MinorText>{capitalize(data?.section)}</MinorText>,
            <MinorText>{capitalize(data?.name)}</MinorText>,
            ...(hasTransfers
              ? [<TransfersList assetTransfers={assetTransfers} />]
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
