import { useState, useEffect } from "react";
import styled from "styled-components";
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

const StyledSection = styled.section`
  > :not(:first-child) {
    margin-top: 32px;
  }
`;

export default function Address() {
  const { id } = useParams();
  const node = useNode();
  const symbol = useSymnol();
  const [tabTableData, setTabTableData] = useState();

  const { data } = useQuery(["address", id], async () => {
    const { data } = await axios.get(`/${node}/addresses/${id}`);
    return data;
  });

  const { data: extrinsicsData } = useQuery(["addressExtrinsics"], async () => {
    const { data } = await axios.get(`/${node}/addresses/${id}/extrinsics`);
    return data;
  });

  useEffect(() => {
    setTabTableData([
      {
        name: "Extrinsics",
        total: extrinsicsData?.total,
        head: addressExtrincsHead,
        body: [],
      },
    ]);
  }, [extrinsicsData]);

  console.log(extrinsicsData);

  return (
    <StyledSection>
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
            `${data?.data.free} ${symbol}`,
            `${data?.data.reserved} ${symbol}`,
            `${data?.data.feeFrozen} ${symbol}`,
            "-",
            <MinorText>{data?.nonce}</MinorText>,
          ]}
        />
      </div>
      <TabTable data={tabTableData} collapse={900} />
    </StyledSection>
  );
}
