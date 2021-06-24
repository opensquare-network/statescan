import styled from "styled-components";

const Wrapper = styled.div`
  color: rgba(17, 17, 17, 0.65);
  margin: 0;
`;

export default function MinorText({ children }) {
  return <Wrapper>{children}</Wrapper>;
}
