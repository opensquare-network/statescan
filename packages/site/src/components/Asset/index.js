import { useParams } from "react-router";

import Nav from "components/Nav";
import { useNode } from "utils/hooks";

export default function Asset() {
  const { id } = useParams();
  const node = useNode();
  return (
    <section>
      <Nav
        data={[
          { name: "Asset Tracker", path: `/${node}/assets` },
          { name: id },
        ]}
      />
      <div>Asset {id}</div>
    </section>
  );
}
