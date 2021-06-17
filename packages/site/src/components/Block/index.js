import { useParams } from "react-router";

import Nav from "components/Nav";

export default function Block() {
  const { id } = useParams();
  return (
    <section>
      <Nav data={[{ name: "Block" }, { name: id }]} />
      <div>Block {id}</div>
    </section>
  );
}
