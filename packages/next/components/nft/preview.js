import styled from "styled-components";
import Image from "next/image";
import { addressEllipsis, time } from "../../utils";
import Address from "../address";
import NftInfo from "../nftInfo";
import SquareBoxComponent from "../squareBox";
import NFTUnrecognizedSvg from  "public/imgs/nft-unrecognized.svg";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  > div{
    padding: 0;
  }

  img {
    object-fit: contain;
  }

  a {
    margin-top: 8px;
    width: 100%;
    border-radius: 8px;
  }

  .divider {
    margin-left: 0;
    margin-right: 0;
    width: 100%;
  }
`

const Row = styled.div`
  margin-bottom: 16px;
  width: 50%;
`

const Field = styled.div`
  font-size: 14px;
  line-height: 16px;
  color: rgba(17, 17, 17, 0.35);
`

const Value = styled.div`
    margin-top: 4px;
    font-size: 14px;
    line-height: 20px;
    color: rgba(17, 17, 17, 0.65);
`

const ImgWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: #555555;
`

export default function Preview({NFTClass}) {
  return <Wrapper>
    <div style={{ width: "100%", marginBottom: "24px" }}>
      <SquareBoxComponent>
        <ImgWrapper>
          {
            NFTClass?.ipfsMetadata?.imageThumbnail
            ? <Image
                src={`https://cloudflare-ipfs.com/ipfs/${NFTClass?.ipfsMetadata?.image.replace('ipfs://ipfs/', '')}`}
                width={NFTClass?.ipfsMetadata?.imageMetadata?.width ?? 480}
                height={NFTClass?.ipfsMetadata?.imageMetadata.height ?? 480}
                alt=""
                placeholder="blur"
                blurDataURL={NFTClass?.ipfsMetadata?.imageThumbnail}
              />
            : <NFTUnrecognizedSvg width={"100%"} height={"100%"} viewBox="0 0 480 480" />
          }

        </ImgWrapper>
      </SquareBoxComponent>
    </div>

    <NftInfo
      data={{
        title: NFTClass?.ipfsMetadata?.name ?? "[Unrecognized]",
        description:
          NFTClass?.ipfsMetadata?.description ?? "-",
      }}
    />

    <Row>
      <Field>Created Time</Field>
      <Value>{time(NFTClass.indexer.blockTime)}</Value>
    </Row>

    <Row>
      <Field>Owner</Field>
      <Value><Address address={addressEllipsis(NFTClass?.details?.owner)}/></Value>
    </Row>

    <Row>
      <Field>Instance</Field>
      <Value>{NFTClass?.details?.instances}</Value>
    </Row>

    <a href={`/nft/classes/${NFTClass?.classId}`}>Detail</a>
  </Wrapper>
}
