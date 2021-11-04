import Layout from "components/layout";
import Nav from "components/nav";
import Table from "components/table";
import AddressEllipsis from "components/addressEllipsis";
import { getNFTClassHead, nftsHead } from "utils/constants";
import Pagination from "components/pagination";
import Filter from "../components/filter";
import Status from "../components/status";
import InLink from "../components/inLink";
import { ssrNextApi as nextApi } from "../services/nextApi";
import { time } from "../utils";
import { Modal } from "semantic-ui-react";
import { useRef, useState } from "react";
import DetailTable from "../components/detailTable";
import MinorText from "../components/minorText";
import CopyText from "../components/copyText";
import Address from "../components/address";
import NftInfo from "../components/nftInfo";
import styled from "styled-components";
import { useOnClickOutside } from "../utils/hooks";
import Preview from "../components/nft/preview";

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

export default function NftClasses({node, nfts, filter}) {
  const [showModal, setShowModal] = useState(false);
  const [previewNFTClass, setPreviewNFTCLass] = useState(null);
  const ref = useRef();
  const NFTClass = nfts.items[0];
  const status = NFTClass?.details?.isFrozen ? "Frozen" : "Active";

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
            <img
              onClick={() => {
                setPreviewNFTCLass(nftClass);
                setShowModal(true);
              }}
              style={{cursor: "pointer", width: 32}}
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
