import Layout from "components/layout";
import Nav from "components/nav";
import Table from "components/table";
import AddressEllipsis from "components/addressEllipsis";
import { nftsHead } from "utils/constants";
import Pagination from "components/pagination";
import Filter from "../components/filter";
import Status from "../components/status";
import InLink from "../components/inLink";

export default function NftClasses({ node, nfts, filter }) {
  return (
    <Layout node={node}>
      <section>
        <Nav data={[{ name: "NFT Classes" }]} node={node} />
        <Filter total={`All ${nfts?.total} nft classes`} data={filter} />
        <Table
          head={nftsHead}
          body={(nfts?.items || []).map((nftClass, index) => [
            <InLink key={`id${index}`} to={`/nft/classes/${nftClass.id}`}>
              {nftClass.id}
            </InLink>,
            <img
              width={32}
              key={`class${index}`}
              src={nftClass.class}
              alt=""
            />,
            nftClass.name,
            nftClass.createdTime,
            <AddressEllipsis
              key={`owner-${index}`}
              address={nftClass.owner}
              to={`/account/${nftClass.owner}`}
            />,
            nftClass.instanceCount,
            <Status key={`status-${index}`} status={nftClass.status} />,
          ])}
          foot={
            <Pagination
              page={nfts?.page}
              pageSize={nfts?.pageSize}
              total={nfts?.total}
            />
          }
          collapse={900}
        />
      </section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const node = process.env.NEXT_PUBLIC_CHAIN;

  const nfts = {
    items: [
      {
        id: 1,
        class: "/imgs/icons/nft.png",
        name: "Elementum amet, duis tellus",
        createdTime: "2021-10-25 20:12:00",
        owner: "EPk1wv1TvVFfsiG73YLuLAtGacfPmojyJKvmifobBzUTxFv",
        instanceCount: 10,
        status: "Active",
      },
      {
        id: 2,
        class: "/imgs/icons/nft.png",
        name: "Elementum amet, duis tellus",
        createdTime: "2021-10-25 20:12:00",
        owner: "EPk1wv1TvVFfsiG73YLuLAtGacfPmojyJKvmifobBzUTxFv",
        instanceCount: 10,
        status: "Frozen",
      },
    ],
    total: 2,
  };

  const filter = [
    {
      value: "",
      name: "Category",
      query: "category",
      options: [{ text: "All", value: "" }],
    },
    {
      value: "",
      name: "Status",
      query: "status",
      options: [{ text: "All", value: "" }],
    },
  ];

  return {
    props: {
      node,
      nfts,
      filter,
    },
  };
}
