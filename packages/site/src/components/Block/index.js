import { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router";
import axios from "axios";
import { useQuery } from "react-query";

import Nav from "components/Nav";
import { useNode } from "utils/hooks";
import { blockHead } from "utils/constants";
import DetailTable from "components/DetailTable";
import Section from "components/Section";
import MinorText from "components/MinorText";
import { timeDuration, time, hashEllipsis } from "utils";
import ThemeText from "components/ThemeText";
import CopyText from "components/CopyText";
import { blockExtrinsicsHead, blockEventsHead } from "utils/constants";
import TabTable from "components/TabTable";
import BreakText from "components/BreakText";
import InLink from "components/InLink";
import Result from "components/Result";
import Pagination from "components/Pgination";

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

export default function Block() {
  const { id } = useParams();
  const node = useNode();
  const [tabTableData, setTabTableData] = useState();
  const [extrinsicsPage, setExtrinsicsPage] = useState(0);
  const [eventsPage, setEventsPage] = useState(0);

  const { data, isLoading } = useQuery(["block", id, node], async () => {
    const { data } = await axios.get(`${node}/blocks/${id}`);
    return data;
  });

  const { data: extrinsicsData, isLoading: isExtrinsicsLoading } = useQuery(
    ["blockExtrinsics", id, node, extrinsicsPage],
    async () => {
      const { data } = await axios.get(`${node}/blocks/${id}/extrinsics`, {
        params: {
          page: extrinsicsPage,
        },
      });
      return data;
    }
  );

  const { data: eventsData, isLoading: isEventsLoading } = useQuery(
    ["blockEvents", id, node],
    async () => {
      const { data } = await axios.get(`${node}/blocks/${id}/events`, {
        params: {
          page: eventsPage,
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
        head: blockExtrinsicsHead,
        body: (extrinsicsData?.items || []).map((item) => [
          <InLink
            to={`/${node}/extrinsic/${item?.indexer?.blockHeight}-${item?.indexer?.index}`}
          >{`${item?.indexer?.blockHeight}-${item?.indexer?.index}`}</InLink>,
          <InLink to={`/${node}/extrinsic/${item?.hash}`}>
            {hashEllipsis(item?.hash)}
          </InLink>,
          <MinorText>
            <Result isSuccess={item?.isSuccess} />
          </MinorText>,
          <BreakText>{`${item?.section}(${item?.name})`}</BreakText>,
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
      {
        name: "Events",
        total: eventsData?.total,
        head: blockEventsHead,
        body: (eventsData?.items || []).map((item) => [
          `${item?.indexer?.blockHeight}-${item?.sort}`,
          <InLink
            to={`/${node}/extrinsic/${item?.indexer.blockHeight}-${item?.phase?.value}`}
          >{`${item?.indexer?.blockHeight}-${item?.phase?.value}`}</InLink>,
          <BreakText>{`${item?.section}(${item?.method})`}</BreakText>,
        ]),
        foot: (
          <Pagination
            page={eventsData?.page}
            pageSize={eventsData?.pageSize}
            total={eventsData?.total}
            setPage={setEventsPage}
          />
        ),
        isLoading: isEventsLoading,
      },
    ]);
  }, [node, extrinsicsData, eventsData, isExtrinsicsLoading, isEventsLoading]);

  return (
    <Section>
      <div>
        <Nav data={[{ name: "Block" }, { name: id }]} />
        <DetailTable
          head={blockHead}
          body={[
            <FlexWrapper>
              <MinorText>{time(data?.blockTime)}</MinorText>
              <AccessoryText>{timeDuration(data?.blockTime)}</AccessoryText>
            </FlexWrapper>,
            "-",
            <CopyText text={data?.hash}>
              <BreakText>
                <ThemeText>{data?.hash}</ThemeText>
              </BreakText>
            </CopyText>,
            <BreakText>
              <ThemeText>{data?.header?.parentHash}</ThemeText>
            </BreakText>,
            <BreakText>
              <MinorText>{data?.header?.stateRoot}</MinorText>
            </BreakText>,
            <BreakText>
              <MinorText>{data?.header?.extrinsicsRoot}</MinorText>
            </BreakText>,
            "-",
          ]}
          isLoading={isLoading}
        />
      </div>
      <TabTable data={tabTableData} collapse={900} />
    </Section>
  );
}
