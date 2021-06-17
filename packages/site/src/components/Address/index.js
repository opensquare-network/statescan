import { useParams } from "react-router";

import Nav from "components/Nav";
import { addressEllipsis } from "utils";

export default function Address() {
  const { id } = useParams();
  return (
    <section>
      <Nav data={[{ name: "Address" }, { name: addressEllipsis(id) }]} />
      <div>Address {id}</div>
    </section>
  );
}
