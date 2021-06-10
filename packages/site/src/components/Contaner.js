import styled from "styled-components";

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export default function Container({ children }) {
  return <Wrapper>{children}</Wrapper>;
}
