import Layout from "components/layout";
import Nav from "components/nav";
import Table from "components/table";
import AddressEllipsis from "components/addressEllipsis";
import { nftsHead } from "utils/constants";
import Pagination from "components/pagination";
import Filter from "../components/filter";
import Status from "../components/status";
import InLink from "../components/inLink";
import { ssrNextApi as nextApi } from "../services/nextApi";
import { time } from "../utils";

export default function NftClasses({ node, nfts, filter }) {
  return (
    <Layout node={node}>
      <section>
        <Nav data={[{ name: "NFT Classes" }]} node={node} />
        <Filter total={`All ${nfts?.total} nft classes`} data={filter} />
        <Table
          head={nftsHead}
          body={(nfts?.items || []).map((nftClass, index) => [
            <InLink key={`id${index}`} to={`/nft/classes/${nftClass.classId}`}>
              {nftClass.classId}
            </InLink>,
            <img
              width={32}
              key={`class${index}`}
              src={
                nftClass?.ipfsMetadata?.imageThumbnail ?? "/imgs/icons/nft.png"
              }
              alt=""
            />,
            nftClass?.ipfsMetadata?.name ?? "unrecognized",
            time(nftClass?.indexer?.blockTime),
            <AddressEllipsis
              key={`owner-${index}`}
              address={nftClass.details?.owner}
              to={`/account/${nftClass.details?.owner}`}
            />,
            nftClass.details?.instances,
            <Status
              key={`status-${index}`}
              status={nftClass.details?.isFroze ? "Frozen" : "Active"}
            />,
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
  const { page, category, status } = context.query;

  const nPage = parseInt(page) || 1;

  const { result: nfts } = await nextApi.fetch(`nftclasses`, {
    page: nPage - 1,
    pageSize: 25,
    ...(category ? { category } : {}),
    ...(status ? { status } : {}),
  });

  const filter = [
    {
      value: "",
      name: "Category",
      query: "category",
      options: [
        { text: "All", value: "" },
        {
          text: "Recognized",
          value: "recognized",
        },
        {
          text: "Unrecognized",
          value: "unrecognized",
        },
      ],
    },
    {
      value: "",
      name: "Status",
      query: "status",
      options: [
        { text: "All", value: "" },
        { text: "Frozen", value: "frozen" },
      ],
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
