import styled from "styled-components";
import Container from "components/container";

const Wrapper = styled.main`
  flex-grow: 1;
  margin-top: 24px;
  z-index: 1;
`;

export default function Main({ children }) {
  return (
    <Wrapper>
      <Container>{children}</Container>
    </Wrapper>
  );
}
