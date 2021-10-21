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
  margin-right: 8px;
  display: initial !important;
  border-radius: 50%;
`;

export default function Symbol({ symbol, assetId, destroyedAt }) {
  const node = useNode();
  let iconSrc = getAssetInfo(node, assetId)?.icon ?? `/imgs/icons/default.svg`;
  let Icon = <Img src={iconSrc} />;
  if (destroyedAt) {
    iconSrc = `/imgs/icons/destroyed.svg`;
    Icon = (
      <Tooltip content={"Asset has been destroyed"}>
        <Img src={iconSrc} style={{ marginTop: 4 }} />
      </Tooltip>
    );
  }
  return (
    <SymbolLink assetId={assetId}>
      <Wrapper>
        {Icon}
        {symbol}
      </Wrapper>
    </SymbolLink>
  );
}
