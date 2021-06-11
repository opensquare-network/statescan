import styled from "styled-components";

import Container from "components/Contaner";
import Producer from "./Producer";
import Donation from "./Donation";

const Wrapper = styled.div`
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default function Footer() {
  return (
    <footer>
      <Container>
        <Wrapper>
          <Producer />
          <Donation />
        </Wrapper>
      </Container>
    </footer>
  );
}
