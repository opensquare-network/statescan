import styled, { css } from "styled-components";
import NftUnrecognizedThumbnailSvg from "public/imgs/nft-unrecognized-thumbnail.svg";

const Wrapper = styled.div`
  ${(props) =>
    props.onClick &&
    css`
      cursor: pointer;
    `};
`;

const ThumbnailContainer = styled(Wrapper)`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: ${(p) => p.size}px;
  height: ${(p) => p.size}px;
  border-radius: 5px;
  overflow: hidden;
  background-color: ${(props) => props.background ?? "#555555"};
  ${(props) =>
    props.onClick &&
    css`
      cursor: pointer;
    `};
`;

export default function Thumbnail({
  imageThumbnail,
  background,
  size = 32,
  onClick,
}) {
  return imageThumbnail ? (
    <ThumbnailContainer size={size} onClick={onClick} background={background}>
      <img width={size} src={imageThumbnail} alt="" />
    </ThumbnailContainer>
  ) : (
    <Wrapper onClick={onClick ?? (()=>{})}>
      <NftUnrecognizedThumbnailSvg
        width={size}
        height={size}
        viewBox="0 0 32 32"
      />
    </Wrapper>
  );
}
