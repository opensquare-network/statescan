import Layout from "components/layout";
import PageNotFound from "components/pageNotFound";

export default function Page503({}) {
  return (
    <Layout>
      <PageNotFound code="503" />
    </Layout>
  );
}
