import Layout from "components/layout";
import PageNotFound from "components/pageNotFound";

export default function Page500({}) {
  return (
    <Layout>
      <PageNotFound code="500" />
    </Layout>
  );
}
