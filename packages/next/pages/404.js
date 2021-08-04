import Layout from "components/layout";
import PageNotFound from "components/pageNotFound";
import { useEffect, useState } from "react";

export default function Page404({}) {
  const [node, setNode] = useState("statemine");
  useEffect(() => {
    setNode(localStorage.getItem("node") || "statemine");
  }, []);

  return (
    <Layout node={node}>
      <PageNotFound />
    </Layout>
  );
}
