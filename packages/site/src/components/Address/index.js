import { useParams } from "react-router";
import axios from "axios";
import { useQuery } from "react-query";

import Nav from "components/Nav";
import { addressEllipsis } from "utils";
import { useNode } from "utils/hooks";
import DetailTable from "components/DetailTable";
import { addressHead } from "utils/constants";

export default function Address() {
  const { id } = useParams();
  const node = useNode();

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
          data.address,
          data.data.free,
          data.data.reserved,
          data.data.feeFrozen,
          0,
          data.nonce,
        ]}
      />
    </section>
  );
}
