import styled from "styled-components";

import Container from "components/container";
import Producer from "./producer";
import SocialMedia from "./socialMedia";

const Wrapper = styled.div`
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  > * {
    white-space: nowrap;
  }
  @media screen and (max-width: 900px) {
    height: 132px;
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
          <SocialMedia />
        </Wrapper>
      </Container>
    </footer>
  );
}
