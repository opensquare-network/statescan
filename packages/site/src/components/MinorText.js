import styled from "styled-components";

const Wrapper = styled.div`
  color: rgba(17, 17, 17, 0.65);
  margin: 0;
  overflow: hidden;
  white-space: nowrap;

  a {
    text-decoration: none;
    color: #f22279;

    &:hover {
      color: #f22279;
    }
  }
`;

export default function MinorText({ children }) {
  return <Wrapper>{children}</Wrapper>;
}
