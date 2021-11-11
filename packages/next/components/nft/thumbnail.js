import styled from 'styled-components';
import NFTUnrecognizedThumbnailSvg from "public/imgs/nft-unrecognized-thumbnail.svg";

const ThumbnailContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 5px;
  overflow: hidden;
  background-color: #555555;
  cursor: pointer;
`;

export default function Thumbnail({ imageThumbnail, onClick=()=>{}, style={} }) {
  return (
    imageThumbnail
    ? (
      <ThumbnailContainer style={style} onClick={onClick}>
        <img
          width={32}
          src={imageThumbnail}
          alt=""
        />
      </ThumbnailContainer>
    ) : (
      <NFTUnrecognizedThumbnailSvg style={style} onClick={onClick} />
    )
  );
}
