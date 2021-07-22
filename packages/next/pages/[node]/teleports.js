import Layout from "components/layout";
// import { ssrNextApi as nextApi } from "services/nextApi";
import { teleportsHead, EmptyQuery } from "utils/constants";
import Nav from "components/nav";
import Table from "components/table";
import Pagination from "components/pagination";
import InLink from "components/inLink";
import AddressEllipsis from "components/AddressEllipsis";
import Filter from "components/filter";
import { bigNumber2Locale } from "utils";
import TeleportItem from "components/teleportItem";

export default function Events({ node, teleports, filter }) {
  return (
    <Layout node={node}>
      <section>
        <Nav data={[{ name: "Teleports" }]} node={node} />
        <Filter total={`All ${teleports?.total} teleports`} data={filter} />
        <Table
          head={teleportsHead}
          body={(teleports?.items || []).map((item) => [
            <InLink to={`/${node}/extrinsic/${item?.extrinsicId}`}>
              {item?.extrinsicId}
            </InLink>,
            item?.time,
            <TeleportItem name={item?.from} />,
            <img src="/imgs/arrow-transfer.svg" />,
            <TeleportItem name={item?.to} />,
            <AddressEllipsis
              address={item?.receiver}
              to={`/${node}/account/${item?.receiver}`}
            />,
            bigNumber2Locale(item?.amount + ""),
            bigNumber2Locale(item?.fee + ""),
            bigNumber2Locale(item?.totalAmount + ""),
          ])}
          foot={
            <Pagination
              page={teleports?.page}
              pageSize={teleports?.pageSize}
              total={teleports?.total}
            />
          }
          collapse={900}
        />
      </section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { node } = context.params;

  const teleports = {
    items: [
      {
        extrinsicId: "29179-1",
        time: 1622920692098,
        from: "Kusama",
        to: "Parachain",
        receiver: "5Fjw165apxdKh9qU6ot99d5EAy3fcdTV3C5UzcwrjW6LE494",
        amount: 76314.1303,
        fee: 0.5,
        totalAmount: 76314.1303,
      },
      {
        extrinsicId: "29179-1",
        time: 1622920692098,
        from: "Parachain",
        to: "Kusama",
        receiver: "5Fjw165apxdKh9qU6ot99d5EAy3fcdTV3C5UzcwrjW6LE494",
        amount: 176314.1303,
        fee: 0.5,
        totalAmount: 176314.1303,
      },
      {
        extrinsicId: "29179-1",
        time: 1622920692098,
        from: "Kusama",
        to: "OpenSquare",
        receiver: "5Fjw165apxdKh9qU6ot99d5EAy3fcdTV3C5UzcwrjW6LE494",
        amount: 276314.1303,
        fee: 0.5,
        totalAmount: 276314.1303,
      },
    ],
    page: 0,
    pageSize: 10,
    total: 3,
  };

  const filter = [
    {
      value: "",
      name: "Type",
      query: "type",
      options: [{ text: "All", value: "" }],
    },
  ];

  return {
    props: {
      node,
      teleports: teleports ?? EmptyQuery,
      filter,
    },
  };
}
