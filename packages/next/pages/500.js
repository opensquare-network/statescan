import Layout from "components/layout";
import PageError from "components/pageError";

export default function Page500({}) {
  return (
    <Layout>
      <PageError code="500" />
    </Layout>
  );
}
