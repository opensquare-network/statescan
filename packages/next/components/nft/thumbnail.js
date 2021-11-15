import styled, { css } from 'styled-components';
import NFTUnrecognizedThumbnailSvg from "public/imgs/nft-unrecognized-thumbnail.svg";

const Wrapper = styled.div`
  ${props => props.onClick && css`
    cursor: pointer;
  `};
`

const ThumbnailContainer = styled(Wrapper)`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  border-radius: 5px;
  overflow: hidden;
  background-color: #555555;
  ${props => props.onClick && css`
    cursor: pointer;
  `};
`;

export default function Thumbnail({imageThumbnail, size = 32, onClick = false}) {
  return (
    imageThumbnail
      ? (
        <ThumbnailContainer size={size} onClick={onClick}>
          <img
            width={size}
            src={imageThumbnail}
            alt=""
          />
        </ThumbnailContainer>
      ) : (
        <Wrapper onClick={onClick}>
          <NFTUnrecognizedThumbnailSvg width={size} height={size} viewBox="0 0 32 32" />
        </Wrapper>
      )
  );
}
