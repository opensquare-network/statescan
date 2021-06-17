import { useParams } from "react-router";

import Nav from "components/Nav";

export default function Address() {
  const { id } = useParams();
  return (
    <section>
      <Nav />
      <div>Address {id}</div>
    </section>
  );
}
