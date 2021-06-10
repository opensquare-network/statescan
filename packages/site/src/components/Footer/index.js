import styled from "styled-components";

import Container from "components/Contaner";

const Wrapper = styled.div`
  height: 84px;
  display: flex;
  align-items: center;
`;

export default function Footer() {
  return (
    <footer>
      <Container>
        <Wrapper>© 2021 statemint</Wrapper>
      </Container>
    </footer>
  );
}
