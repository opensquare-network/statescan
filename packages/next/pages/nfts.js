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
import { Modal } from "semantic-ui-react";
import { useRef, useState } from "react";
import styled from "styled-components";
import { useOnClickOutside } from "../utils/hooks";
import Preview from "../components/nft/preview";
import { text_dark_minor } from "../styles/textStyles";
import Thumbnail from "components/nft/thumbnail";
import NftName from "components/nft/name";

const MyModal = styled(Modal)`
  > div {
    box-shadow: none;
    border: none;
  }

  padding: 24px;

  a {
    display: block;
    background-color: #000000;
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    line-height: 44px;
    color: #FFFFFF;
    text-align: center;
  }
`

const TextDarkMinor = styled.span`
  ${text_dark_minor};
`

export default function NftClasses({node, nfts, filter}) {
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
        <MyModal open={showModal} size="tiny">
          <Preview NFTClass={previewNFTClass}/>
        </MyModal>
      </div>
      <section>
        <Nav data={[{name: "NFT Classes"}]} node={node}/>
        <Filter total={`All ${nfts?.total} nft classes`} data={filter}/>
        <Table
          head={nftsHead}
          body={(nfts?.items || []).map((nftClass, index) => [
            <InLink key={`id${index}`} to={`/nft/classes/${nftClass.classId}`}>
              {nftClass.classId}
            </InLink>,
            <Thumbnail
              key={`thumbnail${index}`}
              imageThumbnail={nftClass?.ipfsMetadata?.imageThumbnail}
              onClick={() => {
                setPreviewNFTCLass(nftClass);
                setShowModal(true);
              }}
              style={{ cursor: "pointer" }}
            />,
            <InLink key={`name${index}`} to={`/nft/classes/${nftClass.classId}`}>
              <NftName name={nftClass?.ipfsMetadata?.name}/>
            </InLink>,
            <TextDarkMinor key={`time-${index}`}>{time(nftClass?.indexer?.blockTime)}</TextDarkMinor>,
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
  const {page, recognized, status} = context.query;

  const nPage = parseInt(page) || 1;

  const {result: nfts} = await nextApi.fetch(`nftclasses`, {
    page: nPage - 1,
    pageSize: 25,
    ...(recognized ? {recognized} : {}),
    ...(status ? {status} : {}),
  });

  const filter = [
    {
      value: "",
      name: "Category",
      query: "recognized",
      options: [
        {text: "All", value: ""},
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
    {
      value: "",
      name: "Status",
      query: "status",
      options: [
        {text: "All", value: ""},
        {text: "Active", value: "active"},
        {text: "Frozen", value: "frozen"},
        {text: "Destroyed", value: "destroyed"},
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
