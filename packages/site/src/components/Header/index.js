import styled from "styled-components";

import NodeSwitcher from "components/NodeSwitcher";

const Container = styled.header`
  position: relative;
  padding: 0 2rem;
`;

const Wrapper = styled.div`
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Background = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 320px;
  background: linear-gradient(180deg, #eeeeee 0%, #ffffff 100%);
  z-index: -1;
`;

export default function Header() {
  return (
    <Container>
      <Background />
      <Wrapper>
        <img src="/imgs/logo.svg" alt="logo" />
        <NodeSwitcher />
      </Wrapper>
    </Container>
  );
}
