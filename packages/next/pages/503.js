import Layout from "components/layout";
import PageError from "components/pageError";

export default function Page503({}) {
  return (
    <Layout>
      <PageError code="503" />
    </Layout>
  );
}
