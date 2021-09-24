import styled from "styled-components";

import { getAssetInfo } from "utils/assetInfoData";
import { useNode } from "utils/hooks";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  text-decoration: none;
  color: #111111;
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

export default function Symbol({ symbol, assetId }) {
  const node = useNode();
  const icon = getAssetInfo(node, assetId)?.icon;
  return (
    <Wrapper>
      <Icon src={icon ?? `/imgs/icons/default.svg`} />
      {symbol}
    </Wrapper>
  );
}
