import Layout from "components/layout";
import Nav from "components/nav";
import Table from "components/table";
import AddressEllipsis from "components/addressEllipsis";
import { destroyedNftHead, nftsHead } from "utils/constants";
import Pagination from "components/pagination";
import Filter from "../components/filter";
import Status from "../components/status";
import { ssrNextApi as nextApi } from "../services/nextApi";
import { time, getNftStatus } from "../utils";
import { useRef, useState } from "react";
import styled from "styled-components";
import { useOnClickOutside } from "../utils/hooks";
import Preview from "../components/nft/preview";
import { text_dark_minor } from "../styles/textStyles";
import Thumbnail from "components/nft/thumbnail";
import NftName from "components/nft/name";
import NftLink from "components/nft/nftLink";

const TextDarkMinor = styled.span`
  ${text_dark_minor};
`;

export default function NftClasses({ node, nfts, filter }) {
  const [showModal, setShowModal] = useState(false);
  const [previewNFTClass, setPreviewNFTCLass] = useState(null);
  const ref = useRef();

  useOnClickOutside(ref, (event) => {
    // exclude manually
    if (document?.querySelector(".modal")?.contains(event.target)) {
      return;
    }
    setShowModal(false);
  });

  return (
    <Layout node={node}>
      <div ref={ref}>
        <Preview
          open={showModal}
          nftClass={previewNFTClass}
          closeFn={() => {
            setShowModal(false);
          }}
        />
      </div>
      <section>
        <Nav data={[{ name: "Destroyed"}, { name: "NFT" }]} node={node} />
        <Filter total={`All ${nfts?.total} NFT classes`} data={filter} />
        <Table
          head={destroyedNftHead}
          body={(nfts?.items || []).map((nftClass, index) => [
            <NftLink key={`id${index}`} nftClass={nftClass}>
              {nftClass.classId}
            </NftLink>,
            <Thumbnail
              key={`thumbnail${index}`}
              imageThumbnail={nftClass?.nftMetadata?.imageThumbnail}
              background={nftClass?.nftMetadata?.imageMetadata?.background}
              onClick={() => {
                setPreviewNFTCLass(nftClass);
                setShowModal(true);
              }}
            />,
            <NftLink key={`name${index}`} nftClass={nftClass}>
              <NftName name={nftClass?.nftMetadata?.name} />
            </NftLink>,
            <TextDarkMinor key={`time-${index}`}>
              {time(nftClass?.destroyedAt?.blockTime)}
            </TextDarkMinor>,
            <AddressEllipsis
              key={`owner-${index}`}
              address={nftClass.details?.owner}
              to={`/account/${nftClass.details?.owner}`}
            />,
            <TextDarkMinor key={`instance-${index}`}>
              {nftClass.details?.instances}
            </TextDarkMinor>,
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
  const { page, recognized, status } = context.query;

  const nPage = parseInt(page) || 1;

  const { result: nfts } = await nextApi.fetch(`nftclasses`, {
    page: nPage - 1,
    pageSize: 25,
    status: "destroyed",
    ...(recognized ? { recognized } : {}),
  });

  const filter = [
    {
      value: recognized ?? "",
      name: "Category",
      query: "recognized",
      options: [
        { text: "All", value: "" },
        {
          text: "Recognized",
          value: "true",
        },
        {
          text: "Unrecognized",
          value: "false",
        },
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
