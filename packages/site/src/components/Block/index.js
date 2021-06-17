import { useParams } from "react-router";

import Nav from "components/Nav";

export default function Block() {
  const { id } = useParams();
  return (
    <section>
      <Nav />
      <div>Block {id}</div>
    </section>
  );
}
