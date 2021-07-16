import { useRouter } from "next/router";
import Layout from "components/layout";
import PageNotFound from "components/pageNotFound";
import { useEffect, useState } from "react";

export default function Page404({}) {
  const router = useRouter();
  const [node, setNode] = useState("westmint");
  useEffect(() => {
    setNode(localStorage.getItem("node") || "westmint");
  }, []);

  if ("/404" === router.asPath) {
    return (
      <Layout node={node}>
        <PageNotFound />
      </Layout>
    );
  }
}
