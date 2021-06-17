import styled from "styled-components";
import { useSelector } from "react-redux";

import { nodeSelector } from "store/reducers/nodeSlice";

const Wrapper = styled.div`
  height: 36px;
  display: flex;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 16px;
`;

const NavWrapper = styled.div`
  font-weight: bold;
  font-size: 20px;
  line-height: 20px;
`;

export default function Nav() {
  const node = useSelector(nodeSelector);

  return (
    <Wrapper>
      <NavWrapper>{node}</NavWrapper>
    </Wrapper>
  );
}
