import styled from "styled-components";
import Image from "next/image";
import NFTUnrecognizedSvg from "../../public/imgs/nft-unrecognized.svg";

const ImgWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: #555555;
`

// Smallest data URI image possible for a transparent image
const transparentThumbnail = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export default function NFTImage({nftMetadata}) {
  if (!nftMetadata?.image) {
    return <ImgWrapper>
      <NFTUnrecognizedSvg width={"100%"} height={"100%"} viewBox="0 0 480 480"/>
    </ImgWrapper>;
  }
  return <ImgWrapper>
    <Image
      src={`https://cloudflare-ipfs.com/ipfs/${nftMetadata?.image.replace('ipfs://ipfs/', '')}`}
      width={nftMetadata?.imageMetadata?.width ?? 480}
      height={nftMetadata?.imageMetadata?.height ?? 480}
      alt=""
      placeholder="blur"
      blurDataURL={nftMetadata?.imageThumbnail || transparentThumbnail}
    />
  </ImgWrapper>;
}
