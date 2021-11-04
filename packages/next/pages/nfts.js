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

const MyModal = styled(Modal)`
  > div{
    box-shadow: none;
    border: none;
  }
  padding: 24px;
  a{
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

export default function NftClasses({ node, nfts, filter }) {
  const [showModal, setShowModal] = useState(false);
  const ref = useRef();
  const NFTClass = nfts.items[0];
  const status = NFTClass?.details?.isFrozen ? "Frozen" : "Active";

  useOnClickOutside(ref, (event) => {
    //exclude manually
    if (document?.querySelector(".modals")?.contains(event.target)) {
      return;
    }
    setShowModal(false);
  });

  return (
    <Layout node={node}>
      <div ref={ref}>
        <MyModal open={showModal} size="tiny">
          <img
            src={`https://ipfs-sh.decoo-cloud.cn/ipfs/${nfts.items[0]?.ipfsMetadata?.image.replace('ipfs://ipfs/', '')}`}
            width={480} alt=""/>
          <DetailTable
            head={getNFTClassHead(status)}
            body={[
              <MinorText key="1">{NFTClass?.classId}</MinorText>,
              <MinorText key="2">
                {time(NFTClass?.indexer?.blockTime)}
              </MinorText>,
              <MinorText key="3">{NFTClass?.details?.instances}</MinorText>,
              <CopyText key="4" text={NFTClass?.owner}>
                <Address
                  address={NFTClass?.details?.owner}
                  to={`/account/${NFTClass?.details?.owner}`}
                />
              </CopyText>,
              <CopyText key="5" text={NFTClass?.details?.issuer}>
                <Address
                  address={NFTClass?.details?.issuer}
                  to={`/account/${NFTClass?.details?.issuer}`}
                />
              </CopyText>,
              <Status key="6" status={status}/>
            ]}
            info={
              <NftInfo
                data={{
                  title: NFTClass?.ipfsMetadata?.name ?? "Unrecognized",
                  description:
                    NFTClass?.ipfsMetadata?.description ?? "Unrecognized",
                }}
              />
            }
          />
          <a href={`/nft/classes/${NFTClass.classId}`}>Detail</a>
        </MyModal>
      </div>
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
              onClick={()=> setShowModal(true)}
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
