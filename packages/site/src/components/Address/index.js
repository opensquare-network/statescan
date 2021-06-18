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

export default function Address() {
  const { id } = useParams();
  const node = useNode();
  const symbol = useSymnol();

  const { data } = useQuery(["address", id], async () => {
    const { data } = await axios.get(`/${node}/addresses/${id}`);
    return data;
  });

  return (
    <section>
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
    </section>
  );
}
