import styled from "styled-components";

import Container from "components/Container";
import Producer from "./Producer";
import Donation from "./Donation";

const Wrapper = styled.div`
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  > * {
    white-space: nowrap;
  }
  @media screen and (max-width: 900px) {
    height: 116px;
    flex-direction: column;
    justify-content: center;
    > :not(:first-child) {
      margin-top: 12px;
    }
  }
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
