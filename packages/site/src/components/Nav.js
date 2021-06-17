import styled from "styled-components";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { nodeSelector } from "store/reducers/nodeSlice";
import { nodes } from "utils/constants";

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

  const nodeName = nodes.find((item) => item.value === node).name;

  return (
    <Wrapper>
      <NavWrapper>
        <Link to={`/${node}`}>{nodeName}</Link>
      </NavWrapper>
    </Wrapper>
  );
}
