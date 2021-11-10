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

export default function NFTImage({ipfsMataData}) {
  if (!ipfsMataData?.image) {
    return <ImgWrapper>
      <NFTUnrecognizedSvg width={"100%"} height={"100%"} viewBox="0 0 480 480"/>
    </ImgWrapper>;
  }
  return <ImgWrapper>
    <Image
      src={`https://cloudflare-ipfs.com/ipfs/${ipfsMataData?.image.replace('ipfs://ipfs/', '')}`}
      width={ipfsMataData?.imageMetadata?.width ?? 480}
      height={ipfsMataData?.imageMetadata.height ?? 480}
      alt=""
      placeholder="blur"
      blurDataURL={ipfsMataData?.imageThumbnail}
    />
  </ImgWrapper>;
}
