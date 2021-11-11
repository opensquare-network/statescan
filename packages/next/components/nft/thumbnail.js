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
  width: 32px;
  height: 32px;
  border-radius: 5px;
  overflow: hidden;
  background-color: #555555;
  ${props => props.onClick && css`
    cursor: pointer;
  `};
`;

export default function Thumbnail({imageThumbnail, onClick = false}) {
  return (
    imageThumbnail
      ? (
        <ThumbnailContainer onClick={onClick}>
          <img
            width={32}
            src={imageThumbnail}
            alt=""
          />
        </ThumbnailContainer>
      ) : (
        <Wrapper onClick={onClick}>
          <NFTUnrecognizedThumbnailSvg/>
        </Wrapper>
      )
  );
}
