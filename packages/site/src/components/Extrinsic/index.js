import { useParams } from "react-router";

import Nav from "components/Nav";

export default function Extrinsic() {
  const { id } = useParams();
  return (
    <section>
      <Nav />
      <div>Extrinsic {id}</div>
    </section>
  );
}
