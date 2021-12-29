import styled from "styled-components";

import { getAssetInfo } from "utils/assetInfoData";
import { useNode } from "utils/hooks";
import Tooltip from "./tooltip";
import SymbolLink from "./symbolLink";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  text-decoration: none;
  color: #111111;
`;

const Img = styled.img`
  width: 24px;
  height: 24px;
  display: initial !important;
  border-radius: 50%;
  object-fit: cover;
`;

const ImgWrapper = styled.div`
  width: 24px;
  height: 24px;
  position: relative;
  margin-right: 8px;
`;

const DestroyedIcon = styled.img`
  position: absolute;
  right: 0;
  bottom: 0;
`;

export default function Symbol({ symbol, assetId, destroyedAt = null, createdAt = null }) {
  const node = useNode();
  let iconSrc = getAssetInfo(node, assetId)?.icon ?? `/imgs/icons/default.svg`;
  let Icon = (
    <ImgWrapper>
      <Img src={iconSrc} />
    </ImgWrapper>
  );
  if (destroyedAt) {
    Icon = (
      <Tooltip content={"Asset has been destroyed"}>
        <ImgWrapper>
          <Img src={iconSrc} />
          <DestroyedIcon src="/imgs/icons/sub-destroyed.svg" />
        </ImgWrapper>
      </Tooltip>
    );
  }
  return (
    <SymbolLink assetId={assetId} destroyedAt={destroyedAt} createdAt={createdAt}>
      <Wrapper>
        {Icon}
        {symbol}
      </Wrapper>
    </SymbolLink>
  );
}
