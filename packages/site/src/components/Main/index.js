import styled from "styled-components";

import Container from "components/Container";
import Home from "components/Home";

const Wrapper = styled.main`
  flex-grow: 1;
  margin-top: 32px;
`;

export default function Main() {
  return (
    <Wrapper>
      <Container>
        <Home />
      </Container>
    </Wrapper>
  );
}
